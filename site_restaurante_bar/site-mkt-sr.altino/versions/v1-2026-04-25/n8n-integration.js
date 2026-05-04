/**
 * N8N INTEGRATION MODULE - Sr. Altino Bar
 *
 * Payload enviado ao n8n (type: "campanha_whatsapp"):
 * {
 *   type: "campanha_whatsapp",
 *   timestamp: "ISO string",
 *   campanha: { id, titulo, tipo, publico, confirmacao, total_leads },
 *   mensagens: [
 *     { whatsapp: "+5511...", nome: "João", mensagem: "texto já personalizado", imagem: "base64|null" }
 *   ]
 * }
 *
 * Payload para novo VIP (type: "novo_vip"):
 * { nome, whatsapp, email, aniversario, data_cadastro }
 *
 * Payload para nova reserva (type: "nova_reserva"):
 * { nome, whatsapp, email, tipo_evento, pessoas, data_evento, observacoes, data_solicitacao }
 *
 * Payload para confirmação de presença (type: "confirmacao_presenca"):
 * { campanha_id, whatsapp, nome, data }
 */

const N8N_CONFIG = {
  WEBHOOK_URL: localStorage.getItem('n8n_webhook_url') || '',
  API_KEY:     localStorage.getItem('n8n_api_key') || '',
  TIMEOUT:     12000,
  MAX_RETRIES: 3,
  DEBUG:       localStorage.getItem('n8n_debug') === 'true'
};

class N8NIntegration {
  constructor() {
    this.queue = [];
    this.stats = { sent: 0, failed: 0, retried: 0 };
  }

  get WEBHOOK_URL() { return N8N_CONFIG.WEBHOOK_URL; }

  configurarWebhook(url) {
    N8N_CONFIG.WEBHOOK_URL = url.trim();
    localStorage.setItem('n8n_webhook_url', url.trim());
  }

  configurarAPIKey(key) {
    N8N_CONFIG.API_KEY = key.trim();
    localStorage.setItem('n8n_api_key', key.trim());
  }

  setDebug(ativo) {
    N8N_CONFIG.DEBUG = ativo;
    localStorage.setItem('n8n_debug', String(ativo));
  }

  estaConfigurado() {
    return !!N8N_CONFIG.WEBHOOK_URL;
  }

  // ─── HTTP ────────────────────────────────────────────────────────────────────

  async _post(payload) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), N8N_CONFIG.TIMEOUT);

    try {
      const res = await fetch(N8N_CONFIG.WEBHOOK_URL, {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...(N8N_CONFIG.API_KEY ? { 'X-N8N-KEY': N8N_CONFIG.API_KEY } : {})
        },
        body: JSON.stringify(payload)
      });
      clearTimeout(timer);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json().catch(() => ({ ok: true }));
    } catch (e) {
      clearTimeout(timer);
      throw e;
    }
  }

  async enviarWebhook(tipo, dados, onSuccess = null, onError = null) {
    if (!this.estaConfigurado()) {
      const err = new Error('Webhook não configurado');
      if (onError) onError(err);
      return;
    }

    const payload = {
      type: tipo,
      timestamp: new Date().toISOString(),
      source: 'showzap-sr-altino',
      data: dados
    };

    for (let t = 1; t <= N8N_CONFIG.MAX_RETRIES; t++) {
      try {
        const res = await this._post(payload);
        this.stats.sent++;
        if (N8N_CONFIG.DEBUG) console.log(`✅ [n8n] ${tipo} enviado`, res);
        if (onSuccess) onSuccess(res);
        return res;
      } catch (e) {
        this.stats.retried++;
        if (N8N_CONFIG.DEBUG) console.warn(`⚠️ [n8n] tentativa ${t} falhou:`, e.message);
        if (t < N8N_CONFIG.MAX_RETRIES) await this._sleep(Math.pow(2, t) * 800);
        else {
          this.stats.failed++;
          this.queue.push({ tipo, dados });
          this._salvarFila();
          if (onError) onError(e);
        }
      }
    }
  }

  // ─── EVENTOS DE NEGÓCIO ──────────────────────────────────────────────────────

  novoVIP(nome, whatsapp, email, aniversario = null, mesa = '', onSuccess = null, onError = null) {
    if (typeof mesa === 'function') {
      onError = onSuccess;
      onSuccess = mesa;
      mesa = '';
    }
    const tel = this._formatarTel(whatsapp);
    if (!tel) { if (onError) onError(new Error('WhatsApp inválido')); return; }
    return this.enviarWebhook('novo_vip', {
      nome: nome.trim(), whatsapp: tel, email: (email || '').trim(),
      aniversario, mesa, data_cadastro: new Date().toISOString()
    }, onSuccess, onError);
  }

  novaReserva(nome, whatsapp, email, tipoEvento, pessoas, dataEvento, observacoes = '', mesa = '', onSuccess = null, onError = null) {
    if (typeof mesa === 'function') {
      onError = onSuccess;
      onSuccess = mesa;
      mesa = '';
    }
    const tel = this._formatarTel(whatsapp);
    if (!tel) { if (onError) onError(new Error('WhatsApp inválido')); return; }
    return this.enviarWebhook('nova_reserva', {
      nome: nome.trim(), whatsapp: tel, email: (email || '').trim(),
      tipo_evento: tipoEvento, pessoas: parseInt(pessoas),
      data_evento: dataEvento, observacoes: (observacoes || '').trim(), mesa,
      data_solicitacao: new Date().toISOString()
    }, onSuccess, onError);
  }

  /**
   * Envia campanha para n8n com payload completo:
   * - mensagens já personalizadas por lead (nome substituído)
   * - imagem em base64 (se houver)
   * - flag de confirmação de presença
   */
  enviarCampanha(campanha, mensagens, onSuccess = null, onError = null) {
    // campanha = { id, titulo, tipo, publico, confirmacao }
    // mensagens = [{ whatsapp, nome, mensagem, imagem }]
    return this.enviarWebhook('campanha_whatsapp', {
      campanha: {
        id:          campanha.id,
        titulo:      campanha.titulo,
        tipo:        campanha.tipo,
        publico:     campanha.publico || 'todos',
        confirmacao: !!campanha.confirmacao,
        total_leads: mensagens.length
      },
      mensagens
    }, onSuccess, onError);
  }

  // ─── FILA ────────────────────────────────────────────────────────────────────

  async processarFila() {
    if (!this.queue.length || !this.estaConfigurado()) return;
    const fila = [...this.queue];
    this.queue = [];
    for (const item of fila) {
      try {
        await this.enviarWebhook(item.tipo, item.dados);
        await this._sleep(400);
      } catch { this.queue.push(item); }
    }
    this._salvarFila();
  }

  _salvarFila() { localStorage.setItem('n8n_fila', JSON.stringify(this.queue)); }
  _carregarFila() { this.queue = JSON.parse(localStorage.getItem('n8n_fila') || '[]'); }

  // ─── UTILS ───────────────────────────────────────────────────────────────────

  _formatarTel(numero) {
    let n = (numero || '').replace(/\D/g, '');
    if (n.length < 10) return null;
    if (!n.startsWith('55')) n = '55' + n;
    return '+' + n;
  }

  _sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

  obterStats() {
    return { ...this.stats, fila: this.queue.length, configurado: this.estaConfigurado() };
  }
}

const n8nIntegration = new N8NIntegration();
n8nIntegration._carregarFila();

window.addEventListener('load', () => {
  if (n8nIntegration.queue.length > 0 && n8nIntegration.estaConfigurado()) {
    n8nIntegration.processarFila();
  }
});
