# CondoZap — Guia de Instalação

## Pré-requisitos

- **Docker** e **Docker Compose** instalados
  - [Instalar Docker](https://docs.docker.com/get-docker/)
- **URL pública** para receber webhooks — uma das opções:
  - **ngrok** (teste local): `ngrok http 5678`
  - **VPS** com domínio (produção)

---

## 1. Baixar os arquivos

```bash
# Criar pasta do projeto
mkdir condozap && cd condozap

# Copiar os arquivos do projeto:
# docker-compose.yml  →  condozap/docker-compose.yml
# .env.example        →  condozap/.env.example
```

---

## 2. Configurar variáveis de ambiente

```bash
cp .env.example .env
nano .env   # ou: notepad .env (Windows)
```

Preencher os campos obrigatórios:

```env
POSTGRES_PASSWORD=senha_forte_aqui
N8N_USER=admin
N8N_PASSWORD=outra_senha_forte_aqui
N8N_WEBHOOK_URL=https://SEU-NGROK-OU-DOMINIO.com
N8N_HOST=localhost
EVOLUTION_API_KEY=chave_evolution_forte_aqui
EVOLUTION_PUBLIC_URL=https://SEU-NGROK-OU-DOMINIO.com:8080
```

> **ngrok**: rode `ngrok http 5678` → copie a URL `https://abc123.ngrok-free.app` → cole em `N8N_WEBHOOK_URL`.  
> Para a Evolution API, abra outro terminal: `ngrok http 8080` → cole em `EVOLUTION_PUBLIC_URL`.

---

## 3. Subir os containers

```bash
docker compose up -d
```

Verificar se os 3 containers estão rodando:

```bash
docker compose ps
```

Saída esperada:
```
NAME                    STATUS
condozap-postgres       running (healthy)
condozap-n8n            running
condozap-evolution      running
```

Acompanhar logs (opcional):
```bash
docker compose logs -f n8n
```

---

## 4. Acessar o n8n

Abrir no navegador: **http://localhost:5678**

- Usuário: valor de `N8N_USER` (padrão: `admin`)
- Senha: valor de `N8N_PASSWORD`

---

## 5. Importar os workflows

1. No n8n: **Workflows** → **Import from File**
2. Importar **`condominio-main.json`**
3. Importar **`condominio-dashboard-receiver.json`**

> Os arquivos estão em `src/workflows/` no projeto.

---

## 6. Configurar credenciais Google

### Google Sheets OAuth2
1. n8n → **Credentials** → **New** → buscar `Google Sheets OAuth2`
2. Nome exato: **`Google Sheets (CondoZap)`**
3. Clicar em **Connect** → autenticar com a conta Google da planilha

### Gmail OAuth2
1. n8n → **Credentials** → **New** → buscar `Gmail OAuth2`
2. Nome exato: **`Gmail (CondoZap)`**
3. Clicar em **Connect** → autenticar com o Gmail do síndico

> Os nomes das credenciais precisam ser exatamente esses — os workflows já referenciam por nome.

---

## 7. Configurar variáveis no n8n

**Settings → Variables → Add Variable** (uma por vez):

| Variável | Valor |
|---|---|
| `EVOLUTION_API_URL` | `http://condozap-evolution:8080` |
| `EVOLUTION_API_INSTANCE` | `condo-principal` |
| `EVOLUTION_API_KEY` | mesma chave do `.env` |
| `ANTHROPIC_API_KEY` | `sk-ant-...` (opcional) |
| `CONDO_NAME` | nome do condomínio |
| `RESP_ZELADOR` | `5511999990001` |
| `RESP_SINDICO` | `5511999990002` |
| `RESP_PORTARIA` | `5511999990003` |
| `RESP_FINANCEIRO` | `5511999990004` |
| `GOOGLE_SHEET_ID` | ID da planilha (entre `/d/` e `/edit`) |
| `SINDICO_EMAIL` | e-mail do síndico |
| `SHEETS_CSV_URL` | URL CSV da aba Solicitacoes |
| `ENCOMENDAS_CSV_URL` | URL CSV da aba Encomendas |
| `RESERVAS_CSV_URL` | URL CSV da aba Reservas |
| `DASHBOARD_WEBHOOK_URL` | preencher no passo 9 |

> Veja `src/workflows/SETUP.md` seção 7 para criar a planilha e as URLs CSV.

---

## 8. Ativar o workflow receiver

1. Abrir `condominio-dashboard-receiver.json` no n8n
2. Verificar que as credenciais Google Sheets e Gmail aparecem vinculadas (sem ícone vermelho)
3. Clicar em **Activate** (toggle superior direito)
4. Copiar a URL do webhook exibida:
   ```
   https://SEU-N8N.com/webhook/cz-dashboard
   ```
5. Voltar em **Settings → Variables** → adicionar:
   - `DASHBOARD_WEBHOOK_URL` = URL copiada acima

---

## 9. Criar instância WhatsApp na Evolution API

```bash
# Substituir YOUR_API_KEY pela chave do .env
curl -X POST http://localhost:8080/instance/create \
  -H "apikey: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"instanceName": "condo-principal", "qrcode": true}'
```

Conectar o WhatsApp:

```bash
# Obter QR code
curl http://localhost:8080/instance/connect/condo-principal \
  -H "apikey: YOUR_API_KEY"
```

Abrir o link retornado no navegador → escanear com o WhatsApp do condomínio.

---

## 10. Configurar webhook da Evolution API

```bash
curl -X POST http://localhost:8080/webhook/set/condo-principal \
  -H "apikey: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://SEU-N8N.com/webhook/cz-whatsapp",
    "webhook_by_events": false,
    "webhook_base64": false,
    "events": ["MESSAGES_UPSERT"]
  }'
```

> Substituir `https://SEU-N8N.com` pela URL do `N8N_WEBHOOK_URL` do `.env`.

---

## 11. Ativar o workflow principal

1. Abrir `condominio-main.json` no n8n
2. Clicar em **Activate**
3. URL do webhook ativa: `https://SEU-N8N.com/webhook/cz-whatsapp`

---

## 12. Testar

Envie uma mensagem de qualquer número para o WhatsApp conectado:

```
Oi
```

O bot deve responder com o menu principal em segundos.

---

## Comandos úteis

```bash
# Ver logs em tempo real
docker compose logs -f

# Reiniciar um serviço
docker compose restart n8n

# Parar tudo
docker compose down

# Parar e apagar dados (cuidado!)
docker compose down -v
```

---

## Solução de problemas

| Problema | Solução |
|---|---|
| n8n não abre | Verificar `docker compose ps` — postgres precisa estar `healthy` antes do n8n subir |
| Webhook não recebe | Confirmar que `N8N_WEBHOOK_URL` é acessível externamente (testar com `curl`) |
| QR code não aparece | Aguardar 30s após criar instância, tentar `connect` novamente |
| Credencial Google inválida | Revogar e re-autenticar em myaccount.google.com → Segurança → Apps com acesso |
| Bot não responde | Verificar logs: `docker compose logs -f n8n` — checar se webhook está ativado na Evolution API |
