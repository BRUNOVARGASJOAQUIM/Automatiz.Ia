/**
 * N8N INTEGRATION MODULE - Showzap Sr. Altino
 * Integração com n8n para automações WhatsApp
 * 
 * Exemplo de uso:
 * n8nIntegration.enviarWebhook('novo_vip', {
 *   nome: 'João Silva',
 *   whatsapp: '11999999999',
 *   email: 'joao@email.com'
 * });
 */

const N8N_CONFIG = {
  // URL do webhook n8n (substituir com seu URL real)
  WEBHOOK_URL: localStorage.getItem('n8n_webhook_url') || 'https://seu-n8n.com/webhook/sr-altino-leads',
  
  // Chave de segurança para autenticação
  API_KEY: localStorage.getItem('n8n_api_key') || 'sua-chave-secreta-aqui',
  
  // Timeout em ms
  TIMEOUT: 10000,
  
  // Retry tentativas
  MAX_RETRIES: 3,
  
  // Log detalhado
  DEBUG: localStorage.getItem('n8n_debug') === 'true'
};

// =============================================================================
// CLASSE PRINCIPAL DE INTEGRAÇÃO
// =============================================================================

class N8NIntegration {
  constructor() {
    this.queue = [];
    this.isProcessing = false;
    this.stats = {
      sent: 0,
      failed: 0,
      retried: 0
    };
  }

  /**
   * Enviar webhook para n8n
   * @param {string} tipo - Tipo de evento: 'novo_vip', 'nova_reserva', 'campanha', etc
   * @param {object} dados - Dados do evento
   * @param {function} callback - Callback opcional (sucesso)
   * @param {function} errorCallback - Callback de erro
   */
  async enviarWebhook(tipo, dados, callback = null, errorCallback = null) {
    try {
      const payload = {
        type: tipo,
        timestamp: new Date().toISOString(),
        data: dados,
        source: 'showzap-website'
      };

      this.log(`📤 Enviando webhook: ${tipo}`, payload);

      // Tentar enviar 3 vezes se falhar
      for (let tentativa = 1; tentativa <= N8N_CONFIG.MAX_RETRIES; tentativa++) {
        try {
          const response = await this._fetchWebhook(payload);
          
          this.stats.sent++;
          this.log(`✅ Webhook enviado com sucesso (tentativa ${tentativa})`);
          
          if (callback) callback(response);
          return response;
          
        } catch (erro) {
          this.log(`⚠️  Tentativa ${tentativa} falhou: ${erro.message}`);
          this.stats.retried++;
          
          if (tentativa < N8N_CONFIG.MAX_RETRIES) {
            // Esperar antes de retry (backoff exponencial)
            await this._sleep(Math.pow(2, tentativa) * 1000);
          } else {
            throw erro;
          }
        }
      }
    } catch (erro) {
      this.stats.failed++;
      this.log(`❌ Falha ao enviar webhook: ${erro.message}`, 'error');
      
      if (errorCallback) errorCallback(erro);
      
      // Guardar na fila para enviar depois
      this.queue.push({ tipo, dados });
      this._salvarFila();
    }
  }

  /**
   * Executar requisição HTTP para webhook
   * @private
   */
  async _fetchWebhook(payload) {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Timeout na requisição'));
      }, N8N_CONFIG.TIMEOUT);

      fetch(N8N_CONFIG.WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-N8N-KEY': N8N_CONFIG.API_KEY,
          'X-Showzap-Source': 'website'
        },
        body: JSON.stringify(payload)
      })
      .then(response => {
        clearTimeout(timeout);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        return response.json();
      })
      .then(resolve)
      .catch(reject);
    });
  }

  /**
   * Enviar novo VIP para n8n
   */
  async novoVIP(nome, whatsapp, email, aniversario = null, callback = null) {
    // Validar WhatsApp
    const whatsappValidado = this._validarWhatsApp(whatsapp);
    if (!whatsappValidado) {
      this.log('❌ WhatsApp inválido', 'error');
      return;
    }

    return this.enviarWebhook('novo_vip', {
      nome: nome.trim(),
      whatsapp: whatsappValidado,
      email: email.trim(),
      aniversario: aniversario,
      data_cadastro: new Date().toISOString()
    }, callback);
  }

  /**
   * Enviar nova reserva para n8n
   */
  async novaReserva(nome, whatsapp, email, tipoEvento, pessoas, dataEvento, observacoes = '', callback = null) {
    const whatsappValidado = this._validarWhatsApp(whatsapp);
    if (!whatsappValidado) {
      this.log('❌ WhatsApp inválido', 'error');
      return;
    }

    return this.enviarWebhook('nova_reserva', {
      nome: nome.trim(),
      whatsapp: whatsappValidado,
      email: email.trim(),
      tipo_evento: tipoEvento,
      pessoas: parseInt(pessoas),
      data_evento: dataEvento,
      observacoes: observacoes.trim(),
      data_solicitacao: new Date().toISOString()
    }, callback);
  }

  /**
   * Enviar campanha para WhatsApp
   */
  async enviarCampanha(titulo, tipo, conteudo, listaLeads = null, callback = null) {
    // Se não especificar lista, pegar todas as leads do localStorage
    const leads = listaLeads || JSON.parse(localStorage.getItem('leads') || '[]');
    
    if (!leads.length) {
      this.log('⚠️  Nenhuma lead para enviar campanha', 'warning');
      return;
    }

    return this.enviarWebhook('enviar_campanha', {
      titulo: titulo.trim(),
      tipo: tipo,
      conteudo: conteudo.trim(),
      quantidade_leads: leads.length,
      leads_ids: leads.map(l => l.whatsapp),
      data_envio: new Date().toISOString()
    }, callback);
  }

  /**
   * Verificar leads entregues
   */
  async verificarEntrega(campanhaId, callback = null) {
    return this.enviarWebhook('verificar_entrega', {
      campanha_id: campanhaId,
      timestamp: new Date().toISOString()
    }, callback);
  }

  /**
   * Processar fila de mensagens nao enviadas
   */
  async processarFila() {
    if (this.queue.length === 0) return;

    this.log(`📋 Processando fila: ${this.queue.length} itens`);

    const fila = [...this.queue];
    this.queue = [];

    for (const item of fila) {
      try {
        await this.enviarWebhook(item.tipo, item.dados);
        await this._sleep(500); // Throttling
      } catch (erro) {
        this.log(`❌ Erro ao processar fila: ${erro.message}`, 'error');
        this.queue.push(item);
      }
    }

    this._salvarFila();
  }

  /**
   * VALIDAÇÕES
   */

  _validarWhatsApp(numero) {
    // Remove caracteres especiais
    let limpo = numero.replace(/\D/g, '');
    
    // Se tem menos de 10 digitos, inválido
    if (limpo.length < 10) return false;
    
    // Se não começa com 55 (código Brasil), adicionar
    if (!limpo.startsWith('55')) {
      limpo = '55' + limpo;
    }
    
    // Retornar em formato E.164
    return '+' + limpo;
  }

  _validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  /**
   * LOGGING E DEBUG
   */

  log(mensagem, tipo = 'info') {
    if (!N8N_CONFIG.DEBUG && tipo === 'info') return;

    const timestamp = new Date().toLocaleTimeString();
    const prefixo = {
      'info': '📝',
      'error': '❌',
      'warning': '⚠️',
      'success': '✅'
    }[tipo] || '📝';

    console.log(`[${timestamp}] ${prefixo} ${mensagem}`);
  }

  /**
   * UTILITÁRIOS
   */

  _sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  _salvarFila() {
    localStorage.setItem('n8n_fila', JSON.stringify(this.queue));
  }

  _carregarFila() {
    this.queue = JSON.parse(localStorage.getItem('n8n_fila') || '[]');
  }

  /**
   * Obter estatísticas
   */
  obterStats() {
    return {
      ...this.stats,
      fila: this.queue.length,
      taxaSucesso: this.stats.sent > 0 ? 
        Math.round((this.stats.sent / (this.stats.sent + this.stats.failed)) * 100) : 0
    };
  }

  /**
   * Reset estatísticas
   */
  resetarStats() {
    this.stats = { sent: 0, failed: 0, retried: 0 };
  }

  /**
   * Configurar webhook URL
   */
  configurarWebhook(url) {
    N8N_CONFIG.WEBHOOK_URL = url;
    localStorage.setItem('n8n_webhook_url', url);
    this.log(`✅ Webhook configurado: ${url}`);
  }

  /**
   * Configurar API key
   */
  configurarAPIKey(key) {
    N8N_CONFIG.API_KEY = key;
    localStorage.setItem('n8n_api_key', key);
    this.log(`✅ API Key configurada`);
  }

  /**
   * Ativar/desativar debug
   */
  setDebug(ativo) {
    N8N_CONFIG.DEBUG = ativo;
    localStorage.setItem('n8n_debug', ativo.toString());
    this.log(`🔍 Debug ${ativo ? 'ATIVADO' : 'DESATIVADO'}`);
  }
}

// =============================================================================
// INSTÂNCIA GLOBAL
// =============================================================================

const n8nIntegration = new N8NIntegration();
n8nIntegration._carregarFila();

// Recuperar fila quando app carrega
window.addEventListener('load', () => {
  if (n8nIntegration.queue.length > 0) {
    console.log(`⏳ Fila com ${n8nIntegration.queue.length} itens. Tentando processar...`);
    n8nIntegration.processarFila();
  }
});

// =============================================================================
// EXEMPLOS DE USO
// =============================================================================

/*

// 1. NOVO VIP
n8nIntegration.novoVIP(
  'João Silva',
  '11 99999-9999',
  'joao@email.com',
  '1990-06-15',
  (response) => {
    console.log('Sucesso:', response);
    alert('Bem-vindo à lista VIP! Você receberá mensagens no WhatsApp');
  }
);

// 2. NOVA RESERVA
n8nIntegration.novaReserva(
  'Maria Santos',
  '11988888888',
  'maria@email.com',
  'Show/Festa',
  8,
  '2026-04-25',
  'Mesa perto do palco',
  (response) => {
    console.log('Reserva enviada!', response);
  }
);

// 3. ENVIAR CAMPANHA
n8nIntegration.enviarCampanha(
  'Show da Semana',
  'show',
  'Amanhã tem show do X ao vivo! 🎵 Aproveite nossos drinks especiais. Reserve já!',
  null, // usar todas as leads
  (response) => {
    console.log('Campanha enviada para', response.total_enviadas);
  }
);

// 4. DEBUG
n8nIntegration.setDebug(true);

// 5. CONFIGURAR
n8nIntegration.configurarWebhook('https://meu-n8n.com/webhook/showzap');
n8nIntegration.configurarAPIKey('minha-chave-secreta');

*/
