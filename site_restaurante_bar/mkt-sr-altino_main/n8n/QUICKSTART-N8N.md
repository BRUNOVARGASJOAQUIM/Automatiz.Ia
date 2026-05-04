# ⚡ Setup Rápido: n8n + WhatsApp em 30 Minutos

## 🎯 Objetivo
Ter o seu site enviando mensagens WhatsApp automáticas em 30 minutos.

---

## ✅ Checklist Setup

### Passo 1: Criar Conta Twilio (5 min)
- [ ] Ir em https://www.twilio.com/console
- [ ] Sign up (free trial com $15 crédito)
- [ ] Verificar email
- [ ] Copiar **Account SID**
- [ ] Copiar **Auth Token**
- [ ] Ir em "Phone Numbers" → "Try WhatsApp"
- [ ] Copiar número WhatsApp (ex: +1234567890)

### Passo 2: Criar Conta n8n (5 min)
- [ ] Ir em https://app.n8n.cloud
- [ ] Sign up com email
- [ ] Verificar email
- [ ] Fazer login

### Passo 3: Criar Spreadsheet Sheety (3 min)
- [ ] Criar Google Sheet novo: https://sheets.google.com
- [ ] Criar abas: VIPs, Reservas, Campanhas_Log
- [ ] Ir em https://sheety.co
- [ ] Conectar Google Sheet
- [ ] Copiar **Spreadsheet ID**

### Passo 4: Setup n8n (10 min)

#### A. Configurar Credentials

```
n8n Dashboard
├── Settings (roda no canto)
├── Credentials
├── New
│   ├── Name: "Twilio"
│   ├── Type: Twilio
│   ├── Account SID: (copiar do Twilio)
│   ├── Auth Token: (copiar do Twilio)
│   └── From Number: +1234567890
└── Save
```

Repetir para:
- **Sheety**: API Key + Spreadsheet ID
- **HTTP**: Para webhooks genéricos

#### B. Criar Workflow Novo VIP

1. Clicar "+ New"
2. Colar JSON do arquivo: **N8N-WORKFLOWS-EXAMPLES.md**
3. Clicar "Import"
4. Conectar nós:
   - Webhook → Validate → Sheety → Twilio → Response
5. Salvar
6. Ativar (botão no topo)

**Webhook ID**: Pegar de "Webhook" node
**URL webhook**: `https://seu-n8n.com/webhook/sr-altino-vip`

#### C. Criar Workflow Nova Reserva (Repetir)

1. "+ New"
2. Colar JSON (WORKFLOW 2)
3. Import
4. Salvar e ativar
5. Copiar URL webhook

#### D. Criar Workflow Campanha (Repetir)

1. "+ New"
2. Colar JSON (WORKFLOW 3)
3. Import
4. Salvar e ativar

### Passo 5: Integrar no Site (5 min)

#### A. Adicionar script

```html
<!-- Em index.html, antes de </body> -->
<script src="n8n-integration.js"></script>

<script>
  // Configurar n8n
  n8nIntegration.configurarWebhook('https://seu-n8n.com/webhook/sr-altino-vip');
  n8nIntegration.configurarAPIKey('sua-chave-secreta');
  
  // Debug (opcional)
  n8nIntegration.setDebug(false);
</script>
```

#### B. Integrar formulários

```javascript
// Formulário VIP - ao fazer submit
document.getElementById('form-vip').addEventListener('submit', (e) => {
  e.preventDefault();
  
  n8nIntegration.novoVIP(
    document.getElementById('nome').value,
    document.getElementById('whatsapp').value,
    document.getElementById('email').value,
    null,
    (response) => {
      alert('✅ Bem-vindo! Você receberá mensagem no WhatsApp');
      e.target.reset();
    }
  );
});
```

---

## 🧪 Teste Completo

### Teste 1: Twilio WhatsApp Manual

```bash
curl -X POST https://api.twilio.com/2010-04-01/Accounts/YOUR_SID/Messages.json \
  -d "From=whatsapp:+1234567890" \
  -d "To=whatsapp:+5511999999999" \
  -d "Body=Teste Showzap!" \
  -u YOUR_SID:YOUR_AUTH_TOKEN
```

✅ Se receber mensagem no WhatsApp, Twilio está OK.

### Teste 2: Webhook n8n

```bash
curl -X POST https://seu-n8n.com/webhook/sr-altino-vip \
  -H "Content-Type: application/json" \
  -d '{
    "type": "novo_vip",
    "data": {
      "nome": "Teste João",
      "whatsapp": "+5511999999999",
      "email": "teste@email.com"
    }
  }'
```

✅ Se receber resposta JSON sucesso, webhook está OK.

### Teste 3: Formulário Website

1. Abrir `http://localhost/index.html`
2. Preencher formulário VIP
3. Clicar em "Entrar"
4. Verificar:
   - localStorage atualizado: `localStorage.getItem('leads')`
   - Console: `n8nIntegration.obterStats()`
   - WhatsApp: mensagem chegou?

---

## 🐛 Troubleshooting Rápido

| Problema | Solução |
|----------|---------|
| Twilio diz "invalid from" | Usar número exato do dashboard Twilio |
| n8n diz webhook inválido | Verificar se URL está HTTPS |
| Mensagem não chega | Verificar Twilio tem crédito ($15 free) |
| Formulário não envia | F12 console → ver erro exato |
| Sheety não salva | Verificar API key está correta |

---

## 📊 Verificar Funcionamento

```javascript
// No console (F12)

// 1. Ver estatísticas
n8nIntegration.obterStats()
// Resultado: { sent: 1, failed: 0, retried: 0, ... }

// 2. Ver fila
n8nIntegration.queue
// Resultado: [] (vazio = tudo enviado)

// 3. Ver logs
n8nIntegration.setDebug(true)
// Agora vê logs detalhados no console
```

---

## 🎯 Próximos Passos Após Setup

1. **Testar com amigos** (enviar para 10 people)
2. **Ajustar mensagens** (templates em n8n)
3. **Adicionar campanhas** (proprietário.html)
4. **Monitorar stats** (dashboard)
5. **Escalar** (mais leads, lembretes, etc)

---

## 💰 Custos (30 dias)

```
Twilio:     $10-20    (200-2000 msgs)
n8n:        $0-20     (free plan)
Sheety:     $0        (free)
────────────────────
TOTAL:      ~$10-20   (Muito barato!)
```

---

## ✨ Você consegue! 🚀

Se ficar preso em algo:
1. Verificar console (F12)
2. Testar URL webhook com curl
3. Ver logs no n8n Dashboard
4. Ler troubleshooting acima
5. Chamar support se necessário

**Tempo estimado**: 30 minutos  
**Dificuldade**: Fácil ✅  
**ROI**: 1000% em conversão  

Bom sorte! 🍻
