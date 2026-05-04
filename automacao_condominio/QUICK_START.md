# CondoZap — Quick Start (Atalho)

**Versão:** 1.0  
**Data:** 2026-04-22  
**Responsável:** Bruno

---

## 🚀 EM 5 MINUTOS

### O que é CondoZap?
Sistema de atendimento via WhatsApp para condomínios. Moradores mandam mensagem → Bot responde → Abre tickets → Síndico recebe notificação → Vê tudo no dashboard em tempo real.

**Status:** 67% pronto. Código e documentação já estão prontos. Você só precisa configurar credenciais e rodar Docker.

---

## ✅ O QUE VOCÊ TEM PRONTO

| Arquivo | O quê | Onde |
|---------|-------|------|
| `docker-compose.yml` | 3 containers prontos | `docker/` |
| `.env.example` | Template de configuração | `docker/` |
| `condominio-main.json` | Workflow WhatsApp n8n | `src/workflows/` |
| `condominio-dashboard-receiver.json` | Receiver Google Sheets | `src/workflows/` |
| `index.html` | Dashboard do síndico | `src/dashboard/` |
| `classificador.md` | IA para categorizar solicitações | `src/prompts/` |
| `INSTALL.md` | 12 passos de instalação | `docker/` |
| `MEMORY.md` | Documentação completa | raiz |

---

## ⚠️ O QUE VOCÊ PRECISA FAZER

### 1️⃣ Cliente faz isso
- [ ] Cria Google Sheets com 3 abas: `Solicitacoes`, `Encomendas`, `Reservas`
- [ ] Compartilha o **SHEET_ID** com você

### 2️⃣ Você faz isso (~1h)

**A. Credenciais Google no n8n**
```
n8n → Credentials → New → Google Sheets OAuth2
Nome: "Google Sheets (CondoZap)" ← NOME EXATO

Repetir para Gmail OAuth2:
Nome: "Gmail (CondoZap)" ← NOME EXATO
```

**B. Arquivo `.env`**
```bash
cp docker/.env.example docker/.env
nano docker/.env

# Preencher:
POSTGRES_PASSWORD=senha_forte
N8N_PASSWORD=senha_forte
EVOLUTION_API_KEY=chave_forte
N8N_WEBHOOK_URL=https://seu-ngrok-ou-dominio.com
```

**C. Variáveis n8n (Settings → Variables)**
```
CONDO_NAME = "Residencial das Flores"
GOOGLE_SHEET_ID = ID_do_cliente
ANTHROPIC_API_KEY = sk-ant-...
RESP_SINDICO = 5511999990001
RESP_ZELADOR = 5511999990002
RESP_PORTARIA = 5511999990003
RESP_FINANCEIRO = 5511999990004
SINDICO_EMAIL = sindico@email.com
EVOLUTION_API_URL = http://condozap-evolution:8080
EVOLUTION_API_INSTANCE = condo-principal
EVOLUTION_API_KEY = mesma_de_cima
SHEETS_CSV_URL = preencher_depois
ENCOMENDAS_CSV_URL = preencher_depois
RESERVAS_CSV_URL = preencher_depois
DASHBOARD_WEBHOOK_URL = preencher_depois
```

### 3️⃣ Deploy (~30 min)

```bash
# Subir Docker
cd docker
docker compose up -d

# Verificar se está rodando
docker compose ps

# Acessar n8n
http://localhost:5678
login: admin / sua_senha

# Importar workflows
Workflows → Import → condominio-main.json
Workflows → Import → condominio-dashboard-receiver.json

# Publicar URLs CSV (no Google Sheets)
Aba → Compartilhar → Copiar link
Modificar URL para: .../pub?gid=0&output=csv (gid=0,1,2 para cada aba)
Preencher em n8n Variables

# Conectar WhatsApp
Evolution API http://localhost:8080
Criar instância, gerar QR code, escanear

# Testar
Enviar mensagem para WhatsApp → Bot responde → Verificar Google Sheets → Ver dashboard
```

---

## 🎯 CHECKLIST DE IMPLEMENTAÇÃO

```
[ ] 1. Cliente cria Google Sheets com 3 abas
[ ] 2. Você configura credenciais Google (2 credentials)
[ ] 3. Você copia .env.example para .env e preenche
[ ] 4. Você preenche as 13 variáveis no n8n
[ ] 5. docker compose up -d
[ ] 6. Importa 2 workflows JSON
[ ] 7. Publica URLs CSV das abas
[ ] 8. Preenche URLs CSV em n8n Variables
[ ] 9. Preenche DASHBOARD_WEBHOOK_URL em n8n Variables
[ ] 10. Conecta WhatsApp na Evolution API
[ ] 11. Testa fluxo completo
[ ] 12. Síndico acessa dashboard e sincroniza
```

---

## 📊 ESTRUTURA DO PROJETO

```
Project 3/
├── MEMORY.md                          ← Documentação completa (LEIA PRIMEIRO)
├── CHECKLIST_IMPLEMENTACAO.md         ← Guia passo a passo (você está aqui)
├── QUICK_START.md                     ← Este arquivo
└── Automacao_Condominio/
    ├── docker/
    │   ├── docker-compose.yml         ← Containers
    │   ├── .env.example               ← Template .env
    │   └── INSTALL.md                 ← 12 passos instalação
    └── src/
        ├── dashboard/
        │   └── index.html             ← Dashboard síndico (abrir no navegador)
        ├── prompts/
        │   └── classificador.md        ← Prompt Claude Haiku
        └── workflows/
            ├── SETUP.md               ← Guia de workflows
            ├── condominio-main.json   ← Workflow principal n8n
            └── condominio-dashboard-receiver.json ← Receiver
```

---

## 🔑 CREDENCIAIS CRÍTICAS

| O quê | Onde armazenar | Formato |
|------|-----------------|---------|
| PostgreSQL | `.env` → `POSTGRES_PASSWORD` | Texto | 
| n8n | `.env` → `N8N_PASSWORD` | Texto |
| Evolution API | `.env` → `EVOLUTION_API_KEY` | Texto |
| Claude AI | n8n Variables → `ANTHROPIC_API_KEY` | sk-ant-xxx |
| Google Sheets ID | n8n Variables → `GOOGLE_SHEET_ID` | ID longo |
| Gmail (credencial) | n8n → Credentials → "Gmail (CondoZap)" | OAuth2 |
| Sheets (credencial) | n8n → Credentials → "Google Sheets (CondoZap)" | OAuth2 |

> ⚠️ **NOMES EXATOS PARA CREDENCIAIS:**
> - "Google Sheets (CondoZap)" ← sem aspas
> - "Gmail (CondoZap)" ← sem aspas

---

## 🆘 PROBLEMA? AQUI VÃO AS CAUSAS

| Problema | Causa | Solução |
|----------|-------|---------|
| n8n não sobe | Postgres não está `healthy` | Aguardar 30s, fazer `docker compose restart` |
| Workflow não encontra credencial | Nome da credencial está errado | Verificar nomes exatos (Phase 2.2) |
| WhatsApp não responde | Evolution API não está rodando | `docker compose ps`, depois `docker compose logs evolution-api` |
| Dashboard não carrega dados | URLs CSV não preenchidas ou erradas | Verificar URLs em n8n Variables, testar no navegador |
| Google Sheets não sincroniza | Webhook URL não está preenchida | Copiar URL do workflow receiver, preencher em n8n Variables |
| IA não classifica corretamente | `ANTHROPIC_API_KEY` não preenchida | Preencher em n8n Variables (usando sua chave Claude) |

---

## 📞 ARQUIVOS IMPORTANTES PARA LER

**Leitura obrigatória nesta ordem:**

1. **MEMORY.md** (este projeto) — Visão geral, stack, fluxo de dados
2. **CHECKLIST_IMPLEMENTACAO.md** — Guia detalhado fase por fase
3. **docker/INSTALL.md** — Instruções de instalação
4. **src/workflows/SETUP.md** — Detalhes dos workflows

---

## ⏱️ TEMPO ESTIMADO

| Fase | Tempo |
|------|-------|
| Cliente cria Sheets | 15 min |
| Você configura credenciais | 30 min |
| Você configura .env | 15 min |
| Você preenche variáveis n8n | 20 min |
| Deploy Docker + workflows | 10 min |
| Testes e ajustes | 1-2h |
| **TOTAL** | **~3-4 horas** |

---

## 🎯 PRÓXIMA AÇÃO AGORA

1. Leia `MEMORY.md` (5 min)
2. Peça ao cliente para criar Google Sheets (dele)
3. Abra `CHECKLIST_IMPLEMENTACAO.md` e siga a Phase 2

**Quando tiver dúvidas durante implementação, volte a este arquivo e consulte a seção "PROBLEMA? AQUI VÃO AS CAUSAS".**
