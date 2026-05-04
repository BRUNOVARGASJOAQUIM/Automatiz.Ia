# CondoZap — Checklist de Implementação

**Projeto:** CondoZap (Project 3)  
**Status Geral:** 67% pronto (8 de 12 itens)  
**Data:** 2026-04-22

---

## 📊 RESUMO EXECUTIVO

| Item | Status | Prazo |
|------|--------|-------|
| **Código & Infraestrutura** | ✅ 100% pronto | Imediato |
| **Documentação** | ✅ 100% pronto | Imediato |
| **Configuração de Credenciais** | ⚠️ Pendente | ~2-4h |
| **Deploy & Testes** | 🔴 Não iniciado | ~1-2 dias |

---

## ✅ FASE 1: O QUE JÁ ESTÁ PRONTO (Comece daqui)

### Arquivos Técnicos
- [x] `docker-compose.yml` — 3 containers (Postgres, n8n, Evolution API) prontos para rodar
- [x] `.env.example` — template com todas as variáveis de ambiente
- [x] `condominio-main.json` — workflow n8n principal (~63KB)
- [x] `condominio-dashboard-receiver.json` — receiver para webhook (~15KB)
- [x] `index.html` — dashboard do síndico (sem dependências externas)
- [x] `classificador.md` — prompt Claude Haiku documentado

### Documentação
- [x] `INSTALL.md` — 12 passos de instalação bem detalhados
- [x] `SETUP.md` — guia de configuração dos workflows
- [x] `MEMORY.md` — visão geral, stack, fluxo de dados

---

## ⚠️ FASE 2: O QUE VOCÊ PRECISA FAZER (Prioridade Alta)

### 2.1 Google Sheets do Cliente
**Responsável:** Cliente final  
**Prazo:** Deve estar pronto ANTES de começar a configurar o n8n

- [ ] Cliente cria uma planilha Google Sheets
- [ ] Cria 3 abas com nomes exatos:
  - [ ] `Solicitacoes` — colunas: `id, protocolo, morador, phone, unidade, categoria, catKey, icone, prioridade, descricao, status, data, hora, ts`
  - [ ] `Encomendas` — colunas: `phone, morador, bloco, remetente, data_chegada, status`
  - [ ] `Reservas` — colunas: `id, protocolo, morador, phone, espaco, espacoLabel, espacoIcon, data, status, ts`
- [ ] Compartilha o **SHEET_ID** com você (copiar da URL: `https://docs.google.com/spreadsheets/d/**1BxiMVs...**`)

**Referência:** Ver `MEMORY.md` seção "Google Sheets — Estrutura das Abas"

---

### 2.2 Credenciais Google Workspace OAuth2
**Responsável:** Você  
**Prazo:** ~30 min  
**Local:** n8n → Credentials → New

#### Credencial 1: Google Sheets OAuth2
1. No n8n: **Credentials** → **New** → buscar `Google Sheets OAuth2`
2. **Nome exato:** `Google Sheets (CondoZap)` ← IMPORTANTE
3. Fazer login com conta do cliente (ou sua)
4. Autorizar acesso
5. Salvar

#### Credencial 2: Gmail OAuth2
1. No n8n: **Credentials** → **New** → buscar `Gmail OAuth2`
2. **Nome exato:** `Gmail (CondoZap)` ← IMPORTANTE
3. Fazer login com a conta de e-mail do síndico
4. Autorizar acesso
5. Salvar

> ⚠️ **Crítico:** Os workflows buscam essas credenciais PELO NOME. Se não colocar o nome exato, os workflows quebram.

---

### 2.3 Arquivo `.env` do Docker
**Responsável:** Você  
**Prazo:** ~15 min

```bash
# Copiar .env.example para .env
cp docker/.env.example docker/.env

# Editar com seus valores
nano docker/.env
```

**Campos obrigatórios:**
```env
# Senhas (criar senhas FORTES)
POSTGRES_PASSWORD=sua_senha_postgres_aqui
N8N_PASSWORD=sua_senha_n8n_aqui
EVOLUTION_API_KEY=sua_chave_evolution_aqui

# URLs públicas (use ngrok para local ou VPS para produção)
N8N_WEBHOOK_URL=https://seu-ngrok-ou-dominio.com
EVOLUTION_PUBLIC_URL=https://seu-ngrok-ou-dominio.com:8080

# Usuário n8n
N8N_USER=admin
N8N_HOST=localhost
```

> **Para testar localmente:** Use `ngrok http 5678` (n8n) e `ngrok http 8080` (Evolution) para obter URLs públicas.

---

### 2.4 Variáveis do n8n
**Responsável:** Você  
**Prazo:** ~20 min  
**Local:** n8n → Settings → Variables

| Variável | Valor | Exemplo |
|----------|-------|---------|
| `CONDO_NAME` | Nome do condomínio | "Residencial das Flores" |
| `EVOLUTION_API_URL` | URL interna (Docker) | `http://condozap-evolution:8080` |
| `EVOLUTION_API_INSTANCE` | Nome da instância | `condo-principal` |
| `EVOLUTION_API_KEY` | Mesma do `.env` | `sua_chave_evolution` |
| `ANTHROPIC_API_KEY` | Sua chave Claude (opcional) | `sk-ant-...` |
| `GOOGLE_SHEET_ID` | ID da planilha do cliente | `1BxiMVs0...` |
| `SINDICO_EMAIL` | E-mail do síndico | `sindico@email.com` |
| `RESP_ZELADOR` | WhatsApp (55+DDD+número) | `5511999990001` |
| `RESP_SINDICO` | WhatsApp síndico | `5511999990002` |
| `RESP_PORTARIA` | WhatsApp portaria | `5511999990003` |
| `RESP_FINANCEIRO` | WhatsApp financeiro | `5511999990004` |
| `SHEETS_CSV_URL` | URL CSV aba Solicitacoes | `https://docs.google.com/...csv` |
| `ENCOMENDAS_CSV_URL` | URL CSV aba Encomendas | `https://docs.google.com/...csv` |
| `RESERVAS_CSV_URL` | URL CSV aba Reservas | `https://docs.google.com/...csv` |
| `DASHBOARD_WEBHOOK_URL` | URL webhook receiver (passo 8) | `https://seu-n8n.com/webhook/...` |

> **Nota:** As URLs CSV só podem ser obtidas DEPOIS que você importar o workflow 2 (receiver).

---

## 🔴 FASE 3: DEPLOYMENT (Não fazer até Phase 2 estar 100%)

### 3.1 Subir Docker
```bash
cd docker
docker compose up -d
```

Verificar se está saudável:
```bash
docker compose ps
```

Saída esperada:
```
condozap-postgres       running (healthy)
condozap-n8n            running
condozap-evolution      running
```

---

### 3.2 Acessar n8n
- Abrir: **http://localhost:5678**
- Usuário: `admin` (ou valor de `N8N_USER`)
- Senha: seu `N8N_PASSWORD`

---

### 3.3 Importar Workflows
1. **Workflows** → **Import from File**
2. Selecionar: `src/workflows/condominio-main.json`
3. Repetir para: `src/workflows/condominio-dashboard-receiver.json`

> ⚠️ Os workflows não vão funcionar até as credenciais Google estarem configuradas (Phase 2.2).

---

### 3.4 Configurar Webhook do Receiver
**Passo crítico para Google Sheets sincronizar**

1. No n8n, abrir o workflow `condominio-dashboard-receiver`
2. Copiar a URL do webhook (aparece ao lado do nome do workflow)
3. Ir em **Settings → Variables**
4. Preencher: `DASHBOARD_WEBHOOK_URL` com essa URL
5. Salvar

---

### 3.5 Publicar URLs CSV do Google Sheets
Para o dashboard do síndico funcionar, as abas precisam estar publicadas como CSV.

**Para cada aba (Solicitacoes, Encomendas, Reservas):**
1. Abrir Google Sheets → aba
2. **Compartilhar** → **Link**
3. Copiar a URL que começa com `https://docs.google.com/spreadsheets/d/`
4. Modificar o fim para `pub?gid=0&output=csv` (gid = 0 para 1ª aba, 1 para 2ª, 2 para 3ª)
5. Preencher em n8n Variables: `SHEETS_CSV_URL`, `ENCOMENDAS_CSV_URL`, `RESERVAS_CSV_URL`

---

### 3.6 Conectar WhatsApp (Evolution API)
1. Acessar Evolution API: **http://localhost:8080** (ou sua URL)
2. Usar `EVOLUTION_API_KEY` para autenticar
3. Criar instância `condo-principal`
4. Gerar QR code
5. Escanear com WhatsApp do cliente

> Após isso, o bot respondará automaticamente a mensagens chegando via Evolution.

---

### 3.7 Testar Fluxo Completo
**Checklist de testes:**

- [ ] Bot responde com menu ao receber mensagem
- [ ] Opção 1 (Solicitação) abre formulário
- [ ] Classificador IA funciona (categoriza corretamente)
- [ ] Entrada aparece no Google Sheets
- [ ] Síndico recebe e-mail de notificação (Gmail)
- [ ] Dashboard do síndico carrega dados do Sheets
- [ ] Opção 3 (Encomendas) busca do Sheets
- [ ] Opção 4 (Reservas) agenda corretamente

---

### 3.8 Acessar Dashboard do Síndico
- Abrir arquivo: `src/dashboard/index.html` no navegador
- Ou servir via HTTP (recomendado para produção)
- Dashboard sincroniza automaticamente com Google Sheets a cada refresh

---

## 📅 CRONOGRAMA ESTIMADO

| Fase | Item | Tempo | Bloqueadores |
|------|------|-------|--------------|
| 2 | Google Sheets | 30 min | Depende do cliente |
| 2 | Credenciais OAuth2 | 30 min | Nenhum |
| 2 | .env Docker | 15 min | Nenhum |
| 2 | Variáveis n8n | 20 min | Sheets ID do cliente |
| 3 | Docker up | 5 min | Nenhum |
| 3 | Importar workflows | 5 min | n8n rodando |
| 3 | Webhook receiver | 5 min | Workflow importado |
| 3 | URLs CSV | 20 min | Sheets publicadas |
| 3 | WhatsApp Evolution | 30 min | Cliente disponível |
| 3 | Testes | 1-2h | Tudo acima pronto |

**Total:** ~3-4 horas (excluindo tempo de cliente)

---

## ⚡ TROUBLESHOOTING RÁPIDO

### n8n não conecta ao Postgres
```bash
docker compose logs postgres
docker compose ps
```
Se não estiver `healthy`, aguarde 30s e tente novamente.

### Credenciais Google não funcionam
- Verificar nomes exatos: `Google Sheets (CondoZap)` e `Gmail (CondoZap)`
- Verificar se estão **ativas** (botão de toggle)
- Renovar autorização se expirou

### Workflow não encontra credencial
- Editar workflow → nó que usa Google Sheets → dropdown deve mostrar a credencial
- Se não aparecer, significa o nome está errado (Phase 2.2)

### WhatsApp não responde
- Verificar se Evolution está rodando: `docker compose ps`
- Verificar se instância foi criada
- Verificar logs: `docker compose logs evolution-api`
- QR code expirou? Gerar novo

### Dashboard não carrega dados
- Verificar se URLs CSV em n8n estão preenchidas (Phase 3.5)
- Verificar se Google Sheets está compartilhada corretamente
- Abrir console do navegador (F12) → ver erros de CORS

---

## 📞 REFERÊNCIAS RÁPIDAS

- **Stack:** n8n, Evolution API, Claude AI, Google Sheets, Gmail, PostgreSQL
- **Portas:** n8n=5678, Evolution=8080, Postgres=5432
- **Containers:** condozap-postgres, condozap-n8n, condozap-evolution
- **Documentação técnica:** Ver `INSTALL.md` e `SETUP.md` na pasta `docker/` e `src/workflows/`
- **Memória do projeto:** `MEMORY.md` (raiz do Project 3)

---

## 🎯 PRÓXIMA AÇÃO

1. Peça ao cliente para criar o Google Sheets (Phase 2.1)
2. Enquanto aguarda, configure credenciais Google (Phase 2.2)
3. Assim que tiver SHEET_ID, configure `.env` (Phase 2.3)
4. Preencha variáveis n8n (Phase 2.4)
5. Execute Phase 3 (deployment)
