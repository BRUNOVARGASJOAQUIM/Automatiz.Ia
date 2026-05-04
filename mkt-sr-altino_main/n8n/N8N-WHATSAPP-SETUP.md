# 📱 n8n + Twilio + WhatsApp - Setup Completo

## 📋 Índice
1. [Arquitetura](#arquitetura)
2. [Setup Twilio](#setup-twilio)
3. [Setup n8n](#setup-n8n)
4. [Workflows](#workflows)
5. [Integração no Site](#integração-no-site)
6. [Testes](#testes)
7. [Monitoramento](#monitoramento)
8. [Troubleshooting](#troubleshooting)

---

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                    SHOWZAP WEBSITE                          │
│  ┌────────────────────────────────────────────────────┐   │
│  │ Formulários (VIP + Reserva)                        │   │
│  │ + Campanhas                                        │   │
│  └──────────────────────┬───────────────────────────┘   │
│                         │                                │
│              n8n-integration.js                           │
│              (módulo JavaScript)                          │
└─────────────────────────────────────────────────────────────┘
                         │
                      Webhook POST
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                    N8N WORKFLOWS                            │
│  ┌────────────────────────────────────────────────────┐   │
│  │ 1. Novo VIP                                        │   │
│  │    ├── Receber webhook                            │   │
│  │    ├── Validar dados                              │   │
│  │    ├── Salvar em Sheety (DB)                      │   │
│  │    └── Enviar WhatsApp via Twilio                 │   │
│  │                                                    │   │
│  │ 2. Nova Reserva                                   │   │
│  │    ├── Receber webhook                            │   │
│  │    ├── Salvar em Sheety                           │   │
│  │    ├── Enviar confirmação ao cliente              │   │
│  │    └── Notificar proprietário                     │   │
│  │                                                    │   │
│  │ 3. Enviar Campanha                                │   │
│  │    ├── Receber webhook com lista de leads         │   │
│  │    ├── Loop: Enviar para cada lead                │   │
│  │    ├── Throttling: 5 msgs/seg                     │   │
│  │    ├── Log em Sheety                              │   │
│  │    └── Relatório de entrega                       │   │
│  └────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                         │
                    Twilio API
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                  WHATSAPP BUSINESS                          │
│  ┌────────────────────────────────────────────────────┐   │
│  │ Cliente recebe mensagem                            │   │
│  │ "Olá João! Bem-vindo à lista VIP..."              │   │
│  └────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                         │
                    Resposta (opcional)
                         ↓
                  Sheety Database
```

---

## 🚀 Setup Twilio

### 1. Criar Conta Twilio

**URL**: https://www.twilio.com/console

1. Sign up (gratuito)
2. Verificar email
3. Ir para Console Dashboard

### 2. Obter Credenciais

```
Dashboard → Account
├── Account SID
├── Auth Token
└── Phone Numbers

Copiar para lugar seguro!
```

### 3. Configurar WhatsApp

**Dashboard → Messaging → Try it out → WhatsApp**

1. Clique em "Get a Free WhatsApp Sandbox"
2. Você receberá um número Twilio (ex: +1234567890)
3. Instruções para adicionar seu número na sandbox

### 4. Teste Manual

```bash
# Usar curl para testar
curl -X POST https://api.twilio.com/2010-04-01/Accounts/YOUR_ACCOUNT_SID/Messages.json \
  -d "From=whatsapp:+1234567890" \
  -d "To=whatsapp:+5511999999999" \
  -d "Body=Olá! Teste do Twilio" \
  -u YOUR_ACCOUNT_SID:YOUR_AUTH_TOKEN
```

**Resposta esperada:**
```json
{
  "sid": "SM...",
  "status": "queued",
  "to": "whatsapp:+5511999999999",
  "body": "Olá! Teste do Twilio"
}
```

### 5. Custos Twilio

```
Plano Free:     $15 crédito para testes
Envio:          ~$0.007 por mensagem
Recebimento:    ~$0.0075 por mensagem
────────────────────────────────
1000 msgs/mês:  ~$7.50
```

---

## 🏗️ Setup n8n

### Opção A: n8n Cloud (Recomendado para começar)

1. **Cadastro**: https://app.n8n.cloud
2. **Plano Free**: 1000 workflows/mês
3. **Plano Pago**: $20/mês (Professional)

### Opção B: n8n Self-hosted (Docker)

```bash
docker run -it --rm \
  -p 5678:5678 \
  -e N8N_BASIC_AUTH_ACTIVE=true \
  -e N8N_BASIC_AUTH_USER=seu_usuario \
  -e N8N_BASIC_AUTH_PASSWORD=sua_senha \
  n8nio/n8n

# Acessar: http://localhost:5678
```

### Opção C: Docker Compose

```yaml
version: '3'
services:
  n8n:
    image: n8nio/n8n:latest
    ports:
      - "5678:5678"
    environment:
      N8N_BASIC_AUTH_ACTIVE: "true"
      N8N_BASIC_AUTH_USER: admin
      N8N_BASIC_AUTH_PASSWORD: senha123
      N8N_EDITOR_BASE_URL: https://seu-dominio.com/n8n
    volumes:
      - n8n_storage:/home/node/.n8n
    restart: unless-stopped

volumes:
  n8n_storage:
```

---

## 🔧 Configurar Integrações no n8n

### 1. Adicionar Credencial Twilio

```
Settings → Credentials → New
Type: Twilio
├── Account SID: (copiar do dashboard Twilio)
├── Auth Token: (copiar do dashboard Twilio)
└── From Number: +1234567890 (seu número Twilio)
```

### 2. Adicionar Credencial Sheety (Database)

```
Settings → Credentials → New
Type: Sheety (ou HTTP Request genérico)
├── API Key: (gerar em Sheety)
└── Spreadsheet ID: (copiar da URL Sheety)
```

---

## 🔄 Workflows n8n

### WORKFLOW 1: Novo VIP

```
Webhook (POST) 
  ↓
Validar Dados
  ├── WhatsApp válido?
  ├── Email válido?
  └── Nome não vazio?
  ↓
Salvar em Sheety
  ├── Tabela: VIPs
  └── Colunas: nome, whatsapp, email, data_cadastro
  ↓
Enviar WhatsApp (Twilio)
  ├── Número: {{$json.whatsapp}}
  ├── Mensagem template
  └── Status: queued
  ↓
Retornar sucesso
```

**JSON do Webhook:**
```json
{
  "type": "novo_vip",
  "timestamp": "2026-04-18T10:30:00Z",
  "data": {
    "nome": "João Silva",
    "whatsapp": "+5511999999999",
    "email": "joao@email.com",
    "aniversario": "1990-06-15"
  }
}
```

### WORKFLOW 2: Nova Reserva

```
Webhook (POST)
  ↓
Validar & Enriquecer
  ├── Formatar data
  ├── Calcular pessoas
  └── Validar WhatsApp
  ↓
Salvar em Sheety
  ├── Tabela: Reservas
  └── Link com VIP se existir
  ↓
Enviar 2 Mensagens (Paralelo)
  ├── Para Cliente: Confirmação recebida
  └── Para Proprietário: Nova reserva!
  ↓
Agendar Lembretes
  ├── +24h: Lembrete
  ├── +2h: Último aviso
  └── Salvar IDs em Sheety
```

### WORKFLOW 3: Enviar Campanha

```
Webhook (POST com lista de leads)
  ↓
Validar Campanha
  ├── Título OK?
  ├── Conteúdo OK?
  └── Leads > 0?
  ↓
Loop: Para cada lead
  ├── Enviar WhatsApp (Twilio)
  ├── Throttle: 200ms entre mensagens (5 msgs/seg)
  ├── Log resultado
  └── Retry se falhar
  ↓
Compilar Relatório
  ├── Total enviadas
  ├── Falhas
  ├── Taxa sucesso
  └── Salvar em Sheety
  ↓
Retornar relatório
```

---

## 🔌 Integração no Site

### 1. Adicionar Script n8n-integration.js

```html
<!-- Em index.html, login.html, proprietario.html -->
<script src="n8n-integration.js"></script>
```

### 2. Configurar no Carregamento

```html
<script>
// No final da página, ou em um arquivo de config

// Configurar webhook n8n
n8nIntegration.configurarWebhook(
  'https://seu-n8n.com/webhook/sr-altino-leads'
);

// Configurar API key
n8nIntegration.configurarAPIKey('sua-chave-secreta');

// Ativar debug (opcional)
// n8nIntegration.setDebug(true);
</script>
```

### 3. Integrar nos Formulários

**index.html - Formulário VIP:**

```javascript
// Ao fazer submit do formulário VIP
document.getElementById('form-vip').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const nome = document.getElementById('nome-vip').value;
  const whatsapp = document.getElementById('whatsapp-vip').value;
  const email = document.getElementById('email-vip').value;
  const aniversario = document.getElementById('aniversario-vip').value;
  
  // Enviar para n8n
  n8nIntegration.novoVIP(
    nome, 
    whatsapp, 
    email, 
    aniversario,
    (response) => {
      // Sucesso
      console.log('✅ Bem-vindo à lista VIP!', response);
      alert('Você receberá uma mensagem no WhatsApp em breve! 🎉');
      
      // Limpar form
      e.target.reset();
      
      // Salvar localmente também (backup)
      const lead = { tipo: 'VIP', nome, whatsapp, email, aniversario, data: new Date().toISOString() };
      const leads = JSON.parse(localStorage.getItem('leads') || '[]');
      leads.push(lead);
      localStorage.setItem('leads', JSON.stringify(leads));
    }
  );
});
```

**index.html - Formulário Reserva:**

```javascript
// Ao fazer submit do formulário Reserva
document.getElementById('form-reserva').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const nome = document.getElementById('nome-reserva').value;
  const whatsapp = document.getElementById('whatsapp-reserva').value;
  const email = document.getElementById('email-reserva').value;
  const tipo_evento = document.getElementById('tipo-evento').value;
  const pessoas = document.getElementById('pessoas').value;
  const data_evento = document.getElementById('data-evento').value;
  const observacoes = document.getElementById('observacoes').value || '';
  
  // Enviar para n8n
  n8nIntegration.novaReserva(
    nome,
    whatsapp,
    email,
    tipo_evento,
    pessoas,
    data_evento,
    observacoes,
    (response) => {
      console.log('✅ Reserva enviada!', response);
      alert('Sua reserva foi recebida! Você receberá uma confirmação no WhatsApp.');
      e.target.reset();
      
      // Salvar localmente
      const reserva = { 
        tipo: 'Reserva', 
        nome, whatsapp, email, tipo_evento, pessoas, data_evento, observacoes,
        data: new Date().toISOString()
      };
      const leads = JSON.parse(localStorage.getItem('leads') || '[]');
      leads.push(reserva);
      localStorage.setItem('leads', JSON.stringify(leads));
    }
  );
});
```

### 4. Integrar em Campanhas (proprietario.html)

```javascript
// No botão "Enviar para Leads" em Campanhas

async function enviarCampanha() {
  const titulo = document.getElementById('titulo-campanha').value;
  const tipo = document.getElementById('tipo-campanha').value;
  const conteudo = document.getElementById('conteudo-campanha').value;
  
  if (!titulo || !conteudo) {
    alert('Preencha título e conteúdo!');
    return;
  }
  
  // Mostrar progresso
  const btnEnviar = event.target;
  btnEnviar.disabled = true;
  btnEnviar.textContent = 'Enviando...';
  
  // Enviar via n8n
  n8nIntegration.enviarCampanha(
    titulo,
    tipo,
    conteudo,
    null, // usar todas as leads
    (response) => {
      console.log('✅ Campanha enviada!', response);
      alert(`Campanha enviada para ${response.leads_count} leads!`);
      
      // Restaurar botão
      btnEnviar.disabled = false;
      btnEnviar.textContent = 'Enviar para Leads';
      
      // Salvar campanha no localStorage (já feito pelo código atual)
    }
  );
}
```

---

## 🧪 Testes

### Teste 1: WhatsApp Manual

```bash
# Testar se Twilio está funcionando
curl -X POST https://api.twilio.com/2010-04-01/Accounts/YOUR_SID/Messages.json \
  -d "From=whatsapp:+1234567890" \
  -d "To=whatsapp:+5511999999999" \
  -d "Body=Teste Showzap ✅" \
  -u YOUR_SID:YOUR_TOKEN
```

### Teste 2: Webhook n8n

```bash
# Testar webhook
curl -X POST https://seu-n8n.com/webhook/sr-altino-leads \
  -H "Content-Type: application/json" \
  -H "X-N8N-KEY: sua-chave" \
  -d '{
    "type": "novo_vip",
    "data": {
      "nome": "Teste João",
      "whatsapp": "+5511999999999",
      "email": "teste@email.com"
    }
  }'
```

### Teste 3: Formulário Website

1. Abrir http://localhost/index.html
2. Preencher formulário VIP
3. Clicar em "Entrar"
4. Verificar:
   - ✅ localStorage atualizado
   - ✅ Console mostra webhook enviado
   - ✅ WhatsApp recebe mensagem em 2-3 segundos

---

## 📊 Monitoramento

### n8n Dashboard

```
Workflows → Aba: Executions
├── Ver todas as execuções
├── Status (sucesso/falha)
├── Tempo de execução
└── Logs detalhados
```

### Sheety Dashboard

```
Sua planilha em Sheety
├── Abas: VIPs, Reservas, Campanhas
├── Dados em tempo real
├── Filtros e busca
└── Exportar para CSV
```

### Verificar Fila Local

```javascript
// No console do navegador
n8nIntegration.obterStats()

// Retorna:
{
  sent: 15,
  failed: 2,
  retried: 3,
  fila: 0,
  taxaSucesso: 88
}

// Ver fila
console.log(n8nIntegration.queue)

// Processar fila manualmente
n8nIntegration.processarFila()
```

---

## 🆘 Troubleshooting

### Erro: "Webhook URL inválido"

```
Solução:
1. Verificar URL do n8n
2. Verificar se n8n está online
3. Verificar HTTPS (obrigatório)
4. Testar com curl primeiro
```

### Erro: "API Key inválida"

```
Solução:
1. Regenerar chave no n8n
2. Configurar novamente: n8nIntegration.configurarAPIKey('nova-chave')
3. Limpar localStorage: localStorage.clear()
```

### Erro: "WhatsApp inválido"

```
Solução:
1. Formato deve ser: +55 11 99999-9999
2. Ou: 11999999999
3. Função valida e converte para E.164 automaticamente
```

### Mensagens não chegam

```
Solução:
1. Verificar se Twilio está com crédito
2. Verificar logs no n8n Dashboard
3. Verificar fila local: n8nIntegration.queue
4. Testar WhatsApp manualmente com Twilio
```

### n8n mostra erro na execução

```
Solução:
1. Ir em Workflows → Executions
2. Clicar na execução vermelha (erro)
3. Ver logs detalhados
4. Comum: JSON inválido, webhook não retorna sucesso
5. Solução: Adicionar HTTP Response no final do workflow
```

---

## 🔐 Segurança

### Checklist

- [ ] API Key guardada em n8n (não no código do site)
- [ ] Webhook tem autenticação (header X-N8N-KEY)
- [ ] HTTPS obrigatório em produção
- [ ] Twilio Token nunca exposto
- [ ] Rate limiting ativado no n8n
- [ ] Logs auditados regularmente
- [ ] Backup automático do Sheety

---

## 📈 Roadmap

### Fase 1: Setup (HOJE)
- [x] Criar conta Twilio
- [x] Criar n8n
- [x] Configurar workflows
- [x] Testar webhooks

### Fase 2: Deploy Beta (1 semana)
- [ ] Testar com 10 leads reais
- [ ] Ajustar templates de mensagem
- [ ] Monitorar taxa de entrega

### Fase 3: Escalar (2 semanas)
- [ ] Campanhas em massa
- [ ] Lembretes automáticos
- [ ] Analytics de engajamento

### Fase 4: Avançado (Futuro)
- [ ] Multi-idioma
- [ ] Personalização por segmento
- [ ] Bot com IA
- [ ] Integração com CRM

---

## 📚 Recursos Úteis

- [Documentação Twilio](https://www.twilio.com/docs)
- [Documentação n8n](https://docs.n8n.io)
- [Sheety](https://sheety.co)
- [WhatsApp Business API](https://developers.facebook.com/docs/whatsapp/cloud-api)

---

**Última atualização**: 18/04/2026  
**Status**: ✅ Pronto para implementar
