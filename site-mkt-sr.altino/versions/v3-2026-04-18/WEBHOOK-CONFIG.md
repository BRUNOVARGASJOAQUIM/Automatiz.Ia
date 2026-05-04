# ⚙️ Configuração de Webhooks n8n

## 🎯 O que fazer aqui

Depois de ter seu n8n rodando, adicione as URLs dos webhooks neste arquivo e também no `localStorage` do seu navegador.

---

## 📝 URLs dos Webhooks (Preenchir após criar em n8n)

### VIP Webhook URL
```
https://seu-n8n.com/webhook/sr-altino-vip
```

### Reserva Webhook URL
```
https://seu-n8n.com/webhook/sr-altino-reserva
```

### Campanha Webhook URL
```
https://seu-n8n.com/webhook/sr-altino-campanha
```

---

## 🔧 Como Configurar (3 opções)

### Opção 1: Via Console (Quick Setup) ✅ Mais fácil

1. Abrir website: `http://localhost/index.html`
2. Pressionar F12 (Developer Tools)
3. Colar no console:

```javascript
// Salvar URL base (sem /sr-altino-vip no final)
localStorage.setItem('n8n_webhook_base_url', 'https://seu-n8n.com/webhook');

// Verificar
console.log('✅ Config salva:', localStorage.getItem('n8n_webhook_base_url'));

// Ver stats
n8nIntegration.obterStats();
```

### Opção 2: Via .env.example (Para produção)

1. Renomear `.env.example` → `.env`
2. Preenchertodas as variáveis:

```env
# n8n Webhooks
N8N_WEBHOOK_BASE_URL=https://seu-n8n.com/webhook
N8N_API_KEY=sua-chave-secreta-aqui

# Twilio
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_WHATSAPP_NUMBER=+1234567890

# Proprietário
PROPRIETARIO_WHATSAPP=+5511999999999

# Sheety
SHEETY_SPREADSHEET_ID=...
SHEETY_API_KEY=...
```

3. Recarregar website

### Opção 3: Diretamente no n8n-integration.js

Editar início do arquivo:

```javascript
class N8NIntegration {
  constructor() {
    this.WEBHOOK_URL = localStorage.getItem('n8n_webhook_base_url') || 'https://seu-n8n.com/webhook';
    this.API_KEY = localStorage.getItem('n8n_api_key') || 'sua-chave-secreta';
    // ...
  }
}
```

---

## ✅ Testar Conexão

### Test 1: Verificar localStorage

```javascript
// F12 console
localStorage.getItem('n8n_webhook_base_url');
// Resultado: "https://seu-n8n.com/webhook" ✅
```

### Test 2: Chamar webhook direto

```javascript
// F12 console
n8nIntegration.novoVIP(
  'Teste João',
  '+5511999999999',
  'teste@email.com',
  null,
  (response) => console.log('✅ Success:', response),
  (error) => console.log('❌ Error:', error)
);
```

### Test 3: Visualizar stats

```javascript
// F12 console
n8nIntegration.obterStats();
// Resultado:
// {
//   sent: 1,
//   failed: 0,
//   retried: 0,
//   fila: 0,
//   taxaSucesso: 100
// }
```

---

## 🔑 URLs n8n Esperadas

```
Workflow "Novo VIP"
├── Webhook ID: sr-altino-vip
└── URL: https://seu-n8n.com/webhook/sr-altino-vip

Workflow "Nova Reserva"
├── Webhook ID: sr-altino-reserva
└── URL: https://seu-n8n.com/webhook/sr-altino-reserva

Workflow "Enviar Campanha"
├── Webhook ID: sr-altino-campanha
└── URL: https://seu-n8n.com/webhook/sr-altino-campanha
```

---

## 🐛 Troubleshooting

| Erro | Causa | Solução |
|------|-------|---------|
| `TypeError: Cannot read property 'WEBHOOK_URL'` | Script não carregou | Verifique se n8n-integration.js existe no mesmo dir |
| `403 Forbidden` | URL webhook inválida ou expirada | Regenerar webhook em n8n |
| `undefined` ao chamar método | n8nIntegration não instanciado | Recarregar página |
| Fila não processa | n8n offline | Verificar n8n status |

---

## 📱 Exemplo Prático

**1. Preencher VIP Form:**
```
Nome: João Silva
WhatsApp: 11 99999-9999
Email: joao@email.com
Aniversário: 15/05
```

**2. Clicar "Entrar"**

**3. Internamente acontece:**
```
1. n8nIntegration.novoVIP() é chamado
   ↓
2. Envia POST para n8n webhook
   ↓
3. n8n valida dados
   ↓
4. n8n salva em Sheety
   ↓
5. n8n envia WhatsApp via Twilio
   ↓
6. Usuário recebe: "Olá João! Bem-vindo à Lista VIP..."
   ↓
7. Stats atualizadas: { sent: 1, failed: 0, ... }
```

---

## 🚀 Next Steps

1. ✅ Setup completo (webhook URL configurado)
2. ⏳ Testar com curl (veja QUICKSTART-N8N.md)
3. ⏳ Testar com formulário real
4. ⏳ Monitorar fila (localStorage)
5. ⏳ Escalizar (mais leads, campanhas)

---

## 💡 Dica

Se ficar preso:
1. Abrir F12 console
2. Rodar `n8nIntegration.setDebug(true)`
3. Tentar ação novamente
4. Ver logs detalhados no console
5. Verificar Network tab para ver requisição POST

Bom sorte! 🍻
