# Setup: Workflow WhatsApp Condomínio

## 1. Importar no n8n

1. Abrir n8n → **Workflows** → **Import from File**
2. Selecionar **`condominio-main.json`** (fluxo WhatsApp principal)
3. Repetir para **`condominio-dashboard-receiver.json`** (receiver Google Workspace)
4. Cada workflow importa com todos os nós — basta configurar as variáveis abaixo

---

## 2. Variáveis de Ambiente (n8n Variables)

Ir em **Settings → Variables** e criar:

| Variável                  | Descrição                                    | Exemplo                          |
|---------------------------|----------------------------------------------|----------------------------------|
| `EVOLUTION_API_URL`       | URL base do Evolution API                    | `http://localhost:8080`          |
| `EVOLUTION_API_INSTANCE`  | Nome da instância WhatsApp                   | `condo-principal`                |
| `EVOLUTION_API_KEY`       | API Key do Evolution API                     | `abc123xyz`                      |
| `ANTHROPIC_API_KEY`       | Chave da API Anthropic (Claude)              | `sk-ant-...`                     |
| `DASHBOARD_WEBHOOK_URL`   | URL do webhook do dashboard do síndico       | `https://meu-n8n.com/webhook/cz-dashboard` |
| `CONDO_NAME`              | Nome do condomínio (aparece no menu)         | `Condomínio Residencial Bela Vista` |
| `RESP_ZELADOR`            | WhatsApp do zelador (55 + DDD + número)      | `5511999990001`                  |
| `RESP_SINDICO`            | WhatsApp do síndico                          | `5511999990002`                  |
| `RESP_PORTARIA`           | WhatsApp da portaria                         | `5511999990003`                  |
| `RESP_FINANCEIRO`         | WhatsApp da administradora                   | `5511999990004`                  |
| `GOOGLE_SHEET_ID`         | ID da planilha Google (entre `/d/` e `/edit`)| `1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms` |
| `SINDICO_EMAIL`           | E-mail do síndico para notificações Gmail    | `sindico@gmail.com`              |
| `SHEETS_CSV_URL`          | CSV publicado da aba **Solicitacoes**        | `https://docs.google.com/spreadsheets/d/.../pub?gid=0&output=csv` |
| `ENCOMENDAS_CSV_URL`      | CSV publicado da aba **Encomendas**          | `https://docs.google.com/spreadsheets/d/.../pub?gid=1&output=csv` |
| `RESERVAS_CSV_URL`        | CSV publicado da aba **Reservas**            | `https://docs.google.com/spreadsheets/d/.../pub?gid=2&output=csv` |

> **Sem `ANTHROPIC_API_KEY`**: Mensagens de texto livre caem em "Outros" (degradação graciosa).  
> **Sem `DASHBOARD_WEBHOOK_URL`**: O nó de salvar falha silenciosamente (ignore400: true).  
> **Sem `GOOGLE_SHEET_ID` / `SINDICO_EMAIL`**: O workflow receiver falha — configure antes de ativar.

---

## 3. Configurar Evolution API

### Criar webhook no Evolution API:
```bash
POST http://localhost:8080/webhook/set/{instance}
{
  "url": "https://SEU-N8N.com/webhook/cz-whatsapp",
  "webhook_by_events": false,
  "webhook_base64": false,
  "events": ["MESSAGES_UPSERT"]
}
```

### Ou via Z-API:
Configurar o webhook de entrada para a URL do n8n:
`https://SEU-N8N.com/webhook/cz-whatsapp`

---

## 4. Fluxo de Mensagens

```
Morador envia mensagem
        ↓
[n8n] Extrai e normaliza (Evolution API / Z-API)
        ↓
[n8n] Recupera sessão (memória em workflow static data)
        ↓
┌─── Estado: aguardando_detalhes ──→ Cria ticket → Notifica responsável → Confirma morador
├─── Estado: aguardando_categoria ─→ Roteamento por número (1-5, 0) ou Claude IA (texto livre)
└─── Estado: novo / outros ────────→ Envia menu principal
```

### Estados de sessão

| Estado                  | O que significa                                  |
|-------------------------|--------------------------------------------------|
| `novo`                  | Primeiro contato ou sessão expirada (30 min)     |
| `aguardando_categoria`  | Menu enviado, aguardando escolha (1-5, 0 ou texto) |
| `aguardando_detalhes`   | Categoria definida, aguardando descrição do problema |

---

## 5. Ativar o Workflow

1. Clicar em **Activate** (toggle no canto superior direito)
2. A URL do webhook ficará disponível em: `https://SEU-N8N.com/webhook/cz-whatsapp`
3. Testar enviando uma mensagem para o WhatsApp conectado na instância

---

## 6. Integração com o Dashboard

O workflow envia `POST` para `DASHBOARD_WEBHOOK_URL` com:
```json
{
  "type": "nova_solicitacao",
  "data": {
    "id": 1234567890,
    "protocolo": "CZ890123",
    "morador": "João Silva",
    "phone": "5511999990001",
    "categoria": "Manutenção",
    "catKey": "manutencao",
    "icone": "🔧",
    "prioridade": "Media",
    "descricao": "torneira vazando no banheiro",
    "status": "Aberta",
    "data": "20/04/2026",
    "hora": "10:30",
    "ts": "2026-04-20T13:30:00.000Z"
  }
}
```

O workflow **`condominio-dashboard-receiver.json`** recebe esse webhook, salva no Google Sheets e notifica o síndico por e-mail. Veja a seção abaixo.

---

## 7. Configurar Google Workspace

### 7.1 Criar a Planilha

1. Abrir [Google Sheets](https://sheets.google.com) → criar nova planilha → nome sugerido: **CondoZap**
2. Criar **3 abas** com os cabeçalhos exatos abaixo:

**Aba `Solicitacoes`** (linha 1):
| id | protocolo | morador | phone | unidade | categoria | catKey | icone | prioridade | descricao | status | data | hora | ts |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|

**Aba `Encomendas`** (linha 1):
| phone | morador | bloco | remetente | data_chegada | status |
|---|---|---|---|---|---|
> `status` = `Pendente` ou `Retirada`. A portaria preenche manualmente.

**Aba `Reservas`** (linha 1):
| id | protocolo | morador | phone | espaco | espacoLabel | espacoIcon | data | status | ts |
|---|---|---|---|---|---|---|---|---|---|

3. Copiar o ID da planilha da URL:  
   `https://docs.google.com/spreadsheets/d/**1BxiMVs...**​/edit`  
   → salvar como `GOOGLE_SHEET_ID` nas variáveis do n8n

---

### 7.2 Publicar as 3 abas como CSV

Para cada aba, fazer: **Arquivo → Publicar na web → selecionar a aba → CSV → Publicar → copiar URL**

| Variável n8n | Aba a publicar |
|---|---|
| `SHEETS_CSV_URL` | **Solicitacoes** |
| `ENCOMENDAS_CSV_URL` | **Encomendas** |
| `RESERVAS_CSV_URL` | **Reservas** |

No Dashboard → **Configurações → Google Workspace** → colar a URL de **Solicitacoes** no campo **Sheet CSV URL**.

> URLs no formato:  
> `https://docs.google.com/spreadsheets/d/SEU_ID/pub?gid=GID_DA_ABA&single=true&output=csv`  
> O `gid` de cada aba aparece na URL quando você clica nela.

---

### 7.3 Configurar Credenciais no n8n

#### Google Sheets
1. n8n → **Credentials** → **New** → `Google Sheets OAuth2`
2. Nome da credencial: **`Google Sheets (CondoZap)`** (exato — é o nome referenciado no workflow)
3. Autenticar com a conta Google que tem acesso à planilha

#### Gmail
1. n8n → **Credentials** → **New** → `Gmail OAuth2`
2. Nome da credencial: **`Gmail (CondoZap)`** (exato)
3. Autenticar com a conta Gmail do síndico (ou conta de serviço do condomínio)

---

### 7.4 Ativar o Workflow Receiver

1. Abrir `condominio-dashboard-receiver.json` no n8n
2. Verificar que as credenciais aparecem vinculadas nos nós **Google Sheets** e **Gmail**
3. Clicar em **Activate**
4. A URL do webhook receiver ficará disponível em:  
   `https://SEU-N8N.com/webhook/cz-dashboard`
5. Copiar essa URL → colar como `DASHBOARD_WEBHOOK_URL` nas variáveis do n8n (usado pelo workflow principal)

---

### 7.5 Fluxo Completo v2

```
Morador (WhatsApp)
       ↓
[Workflow 1 — condominio-main.json]
  Menu principal: 1=Solicitação · 2=Protocolo · 3=Encomendas · 4=Reserva · 0=Síndico
       │
       ├─ Solicitação → sub-menu categorias → descreve → cria ticket → POST webhook
       ├─ Protocolo   → busca no CSV "Solicitacoes" → responde status
       ├─ Encomendas  → busca no CSV "Encomendas"   → lista pacotes pendentes
       └─ Reserva     → escolhe espaço → data → verifica CSV "Reservas" → confirma → POST webhook
       ↓
[Workflow 2 — condominio-dashboard-receiver.json]
  nova_solicitacao → Google Sheets (Solicitacoes) + Gmail síndico
  nova_reserva     → Google Sheets (Reservas)     + Gmail síndico

Dashboard (navegador do síndico)
  → 🔄 Sincronizar → fetch CSV Solicitacoes → exibe tickets em tempo real
```
