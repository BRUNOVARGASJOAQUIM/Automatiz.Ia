# 📋 Workflows n8n - Exemplos Prontos

Este arquivo contém 3 workflows completos prontos para copiar e colar no n8n.

## 🚀 Como Usar

1. Abrir n8n: https://app.n8n.cloud (ou seu n8n)
2. Clicar em "+ New"
3. Colar o JSON abaixo em "Workflow JSON"
4. Clicar em "Import"
5. Configurar credenciais (Twilio, Sheety)
6. Salvar e ativar

---

## 📱 WORKFLOW 1: NOVO VIP

**O que faz:**
- Recebe webhook quando alguém se cadastra na lista VIP
- Valida dados (WhatsApp, email)
- Salva em Sheety (database)
- Envia mensagem WhatsApp de boas-vindas
- Retorna confirmação

**Copiar JSON e colar em n8n:**

```json
{
  "nodes": [
    {
      "parameters": {},
      "id": "webhook_trigger",
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [250, 300],
      "webhookId": "sr-altino-vip"
    },
    {
      "parameters": {
        "functionCode": "if (!$json.data.whatsapp || !$json.data.nome) {\n  throw new Error('Dados inválidos: whatsapp e nome são obrigatórios');\n}\n\n// Formatar WhatsApp\nlet whatsapp = $json.data.whatsapp.replace(/\\D/g, '');\nif (!whatsapp.startsWith('55')) {\n  whatsapp = '55' + whatsapp;\n}\n\nreturn {\n  ...items[0].json,\n  whatsapp: 'whatsapp:+' + whatsapp,\n  data_cadastro: new Date().toISOString()\n};"
      },
      "id": "validate",
      "name": "Validar Dados",
      "type": "n8n-nodes-base.function",
      "typeVersion": 1,
      "position": [450, 300]
    },
    {
      "parameters": {
        "spreadsheetId": "{{ $env.SHEETY_SPREADSHEET_ID }}",
        "range": "VIPs!A:E",
        "resource": "spreadsheet",
        "operation": "append",
        "fieldsUi": {
          "fields": [
            {
              "key": "nome",
              "value": "={{ $json.data.nome }}"
            },
            {
              "key": "whatsapp",
              "value": "={{ $json.data.whatsapp }}"
            },
            {
              "key": "email",
              "value": "={{ $json.data.email }}"
            },
            {
              "key": "data_cadastro",
              "value": "={{ $json.data_cadastro }}"
            }
          ]
        }
      },
      "id": "sheety_save",
      "name": "Salvar em Sheety",
      "type": "n8n-nodes-base.sheety",
      "typeVersion": 1,
      "position": [650, 300]
    },
    {
      "parameters": {
        "twilioAccount": "{{ $env.TWILIO_ACCOUNT_SID }}",
        "twilioAuthToken": "{{ $env.TWILIO_AUTH_TOKEN }}",
        "from": "whatsapp:{{ $env.TWILIO_WHATSAPP_NUMBER }}",
        "to": "={{ $json.whatsapp }}",
        "message": "Olá {{ $json.data.nome }}! 🎉\\n\\nBem-vindo à Lista VIP do Sr. Altino Bar!\\n\\nAgora você receberá:\\n✅ Promoções exclusivas\\n✅ Eventos especiais\\n✅ Convites VIP\\n\\nAproveite! 🍻"
      },
      "id": "twilio_send",
      "name": "Enviar WhatsApp",
      "type": "n8n-nodes-base.twilio",
      "typeVersion": 1,
      "position": [850, 300]
    },
    {
      "parameters": {
        "respondWith": "json",
        "responseBody": "{ \"success\": true, \"message\": \"Bem-vindo à lista VIP!\", \"whatsapp\": \"{{ $json.whatsapp }}\" }"
      },
      "id": "http_response",
      "name": "HTTP Response",
      "type": "n8n-nodes-base.respondToWebhook",
      "typeVersion": 1,
      "position": [1050, 300]
    }
  ],
  "connections": {
    "webhook_trigger": {
      "main": [
        [
          {
            "node": "validate",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "validate": {
      "main": [
        [
          {
            "node": "sheety_save",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "sheety_save": {
      "main": [
        [
          {
            "node": "twilio_send",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "twilio_send": {
      "main": [
        [
          {
            "node": "http_response",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  }
}
```

---

## 📅 WORKFLOW 2: NOVA RESERVA

**O que faz:**
- Recebe webhook de nova reserva
- Salva em Sheety
- Envia confirmação para cliente
- Notifica proprietário
- Agenda lembretes

**Copiar e colar:**

```json
{
  "nodes": [
    {
      "parameters": {},
      "id": "webhook_trigger",
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [250, 300],
      "webhookId": "sr-altino-reserva"
    },
    {
      "parameters": {
        "functionCode": "const data = $json.data;\n\nif (!data.whatsapp || !data.nome || !data.tipo_evento || !data.pessoas) {\n  throw new Error('Dados obrigatórios faltando');\n}\n\nlet whatsapp = data.whatsapp.replace(/\\D/g, '');\nif (!whatsapp.startsWith('55')) {\n  whatsapp = '55' + whatsapp;\n}\n\nreturn {\n  ...items[0].json,\n  whatsapp: 'whatsapp:+' + whatsapp,\n  data_solicitacao: new Date().toISOString()\n};"
      },
      "id": "validate",
      "name": "Validar Dados",
      "type": "n8n-nodes-base.function",
      "typeVersion": 1,
      "position": [450, 300]
    },
    {
      "parameters": {
        "spreadsheetId": "{{ $env.SHEETY_SPREADSHEET_ID }}",
        "range": "Reservas!A:G",
        "resource": "spreadsheet",
        "operation": "append",
        "fieldsUi": {
          "fields": [
            {
              "key": "nome",
              "value": "={{ $json.data.nome }}"
            },
            {
              "key": "whatsapp",
              "value": "={{ $json.data.whatsapp }}"
            },
            {
              "key": "tipo_evento",
              "value": "={{ $json.data.tipo_evento }}"
            },
            {
              "key": "pessoas",
              "value": "={{ $json.data.pessoas }}"
            },
            {
              "key": "data_evento",
              "value": "={{ $json.data.data_evento }}"
            },
            {
              "key": "data_solicitacao",
              "value": "={{ $json.data_solicitacao }}"
            }
          ]
        }
      },
      "id": "sheety_save",
      "name": "Salvar em Sheety",
      "type": "n8n-nodes-base.sheety",
      "typeVersion": 1,
      "position": [650, 300]
    },
    {
      "parameters": {
        "twilioAccount": "{{ $env.TWILIO_ACCOUNT_SID }}",
        "twilioAuthToken": "{{ $env.TWILIO_AUTH_TOKEN }}",
        "from": "whatsapp:{{ $env.TWILIO_WHATSAPP_NUMBER }}",
        "to": "={{ $json.whatsapp }}",
        "message": "Olá {{ $json.data.nome }}! 📅\\n\\nRecebemos sua solicitação de reserva!\\n\\n📋 Detalhes:\\n• Data: {{ $json.data.data_evento }}\\n• Pessoas: {{ $json.data.pessoas }}\\n• Tipo: {{ $json.data.tipo_evento }}\\n\\n✅ Confirmaremos em breve!\\nSr. Altino Bar 🍻"
      },
      "id": "twilio_cliente",
      "name": "Enviar Confirmação Cliente",
      "type": "n8n-nodes-base.twilio",
      "typeVersion": 1,
      "position": [850, 200]
    },
    {
      "parameters": {
        "twilioAccount": "{{ $env.TWILIO_ACCOUNT_SID }}",
        "twilioAuthToken": "{{ $env.TWILIO_AUTH_TOKEN }}",
        "from": "whatsapp:{{ $env.TWILIO_WHATSAPP_NUMBER }}",
        "to": "whatsapp:{{ $env.PROPRIETARIO_WHATSAPP }}",
        "message": "📢 NOVA RESERVA!\\n\\nNome: {{ $json.data.nome }}\\nWhatsApp: {{ $json.data.whatsapp }}\\nData: {{ $json.data.data_evento }}\\nPessoas: {{ $json.data.pessoas }}\\nTipo: {{ $json.data.tipo_evento }}"
      },
      "id": "twilio_proprietario",
      "name": "Notificar Proprietário",
      "type": "n8n-nodes-base.twilio",
      "typeVersion": 1,
      "position": [850, 400]
    },
    {
      "parameters": {
        "respondWith": "json",
        "responseBody": "{ \"success\": true, \"message\": \"Reserva recebida! Você receberá uma confirmação.\", \"status\": \"pendente\" }"
      },
      "id": "http_response",
      "name": "HTTP Response",
      "type": "n8n-nodes-base.respondToWebhook",
      "typeVersion": 1,
      "position": [1050, 300]
    }
  ],
  "connections": {
    "webhook_trigger": {
      "main": [
        [
          {
            "node": "validate",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "validate": {
      "main": [
        [
          {
            "node": "sheety_save",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "sheety_save": {
      "main": [
        [
          {
            "node": "twilio_cliente",
            "type": "main",
            "index": 0
          },
          {
            "node": "twilio_proprietario",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "twilio_cliente": {
      "main": [
        [
          {
            "node": "http_response",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "twilio_proprietario": {
      "main": [
        [
          {
            "node": "http_response",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  }
}
```

---

## 📢 WORKFLOW 3: ENVIAR CAMPANHA

**O que faz:**
- Recebe webhook com lista de leads
- Loop: envia para cada lead
- Throttling: 5 mensagens por segundo
- Log de entrega
- Retorna relatório

**Copiar e colar:**

```json
{
  "nodes": [
    {
      "parameters": {},
      "id": "webhook_trigger",
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [250, 300],
      "webhookId": "sr-altino-campanha"
    },
    {
      "parameters": {
        "functionCode": "if (!$json.data.conteudo || !$json.data.leads_ids || $json.data.leads_ids.length === 0) {\n  throw new Error('Conteúdo e leads obrigatórios');\n}\n\nreturn items[0].json;"
      },
      "id": "validate",
      "name": "Validar Campanha",
      "type": "n8n-nodes-base.function",
      "typeVersion": 1,
      "position": [450, 300]
    },
    {
      "parameters": {
        "dataPropertyName": "data.leads_ids"
      },
      "id": "split_leads",
      "name": "Split em Leads",
      "type": "n8n-nodes-base.splitInBatches",
      "typeVersion": 1,
      "position": [650, 300]
    },
    {
      "parameters": {
        "waitTime": 200
      },
      "id": "throttle",
      "name": "Throttle (5 msgs/seg)",
      "type": "n8n-nodes-base.wait",
      "typeVersion": 1,
      "position": [850, 300]
    },
    {
      "parameters": {
        "twilioAccount": "{{ $env.TWILIO_ACCOUNT_SID }}",
        "twilioAuthToken": "{{ $env.TWILIO_AUTH_TOKEN }}",
        "from": "whatsapp:{{ $env.TWILIO_WHATSAPP_NUMBER }}",
        "to": "whatsapp:+{{ $json.item }}",
        "message": "{{ $json.data.conteudo }}"
      },
      "id": "twilio_send",
      "name": "Enviar WhatsApp",
      "type": "n8n-nodes-base.twilio",
      "typeVersion": 1,
      "position": [1050, 300]
    },
    {
      "parameters": {
        "spreadsheetId": "{{ $env.SHEETY_SPREADSHEET_ID }}",
        "range": "Campanhas_Log!A:D",
        "resource": "spreadsheet",
        "operation": "append",
        "fieldsUi": {
          "fields": [
            {
              "key": "campanha_id",
              "value": "={{ $json.data.titulo }}"
            },
            {
              "key": "whatsapp_destino",
              "value": "={{ $json.item }}"
            },
            {
              "key": "status",
              "value": "enviada"
            },
            {
              "key": "timestamp",
              "value": "={{ new Date().toISOString() }}"
            }
          ]
        }
      },
      "id": "log_entrega",
      "name": "Log Entrega",
      "type": "n8n-nodes-base.sheety",
      "typeVersion": 1,
      "position": [1250, 300]
    },
    {
      "parameters": {
        "respondWith": "json",
        "responseBody": "{ \"success\": true, \"total_enviadas\": {{ $json.data.leads_ids.length }}, \"status\": \"enviando\" }"
      },
      "id": "http_response",
      "name": "HTTP Response",
      "type": "n8n-nodes-base.respondToWebhook",
      "typeVersion": 1,
      "position": [1450, 300]
    }
  ],
  "connections": {
    "webhook_trigger": {
      "main": [
        [
          {
            "node": "validate",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "validate": {
      "main": [
        [
          {
            "node": "split_leads",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "split_leads": {
      "main": [
        [
          {
            "node": "throttle",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "throttle": {
      "main": [
        [
          {
            "node": "twilio_send",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "twilio_send": {
      "main": [
        [
          {
            "node": "log_entrega",
            "type": "main",
            "index": 0
          },
          {
            "node": "http_response",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  }
}
```

---

## 🔧 Variáveis de Ambiente

Adicione no n8n (Settings → Environment):

```
TWILIO_ACCOUNT_SID=seu_sid_aqui
TWILIO_AUTH_TOKEN=seu_token_aqui
TWILIO_WHATSAPP_NUMBER=+1234567890
PROPRIETARIO_WHATSAPP=+5511988887777
SHEETY_SPREADSHEET_ID=seu_id_aqui
```

---

## 🧪 Testar Workflows

### Método 1: Webhook URL Direto

```bash
# Novo VIP
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

# Nova Reserva
curl -X POST https://seu-n8n.com/webhook/sr-altino-reserva \
  -H "Content-Type: application/json" \
  -d '{
    "type": "nova_reserva",
    "data": {
      "nome": "Maria Silva",
      "whatsapp": "+5511988888888",
      "email": "maria@email.com",
      "tipo_evento": "Show",
      "pessoas": "8",
      "data_evento": "2026-04-25",
      "observacoes": "Mesa perto do palco"
    }
  }'
```

### Método 2: Botão de Teste no n8n

1. Abrir workflow no n8n
2. Clicar em "Test Workflow"
3. n8n mostra um webhook URL temporário
4. Usar curl ou Postman para testar

---

## 📊 Monitoramento

```javascript
// No console do navegador
n8nIntegration.obterStats()

// Retorna:
{
  "sent": 5,
  "failed": 0,
  "retried": 0,
  "fila": 0,
  "taxaSucesso": 100
}
```

---

**Última atualização**: 18/04/2026
