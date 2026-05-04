# 🗺️ MAPA VISUAL DO PROJETO

## 🎯 ONDE ESTÁ CADA COISA?

```
site-mkt-sr.altino/
│
├─ 🌐 PRODUÇÃO
│  └─ netlify-deploy/
│     ├─ 🚀 index.html (HOME)
│     ├─ 🔐 login.html (LOGIN)
│     ├─ 📊 proprietario.html (DASHBOARD)
│     ├─ 🔑 auth.js (AUTENTICAÇÃO OLD)
│     ├─ ⭐ auth-v2.js (AUTENTICAÇÃO NEW - USE ESTE!)
│     ├─ 🎨 style.css (ESTILOS)
│     ├─ ⚙️ netlify.toml (CONFIG)
│     └─ 🔄 _redirects (ROTAS)
│
├─ 📚 DOCUMENTAÇÃO
│  └─ docs/
│     ├─ 📖 README.md (INFO GERAL)
│     ├─ 🔐 SEGURANCA-PROPRIETARIO.md (LEIA 1º!)
│     ├─ 💻 BACKEND-AUTENTICACAO.md (IMPLEMENTAR)
│     ├─ ✅ TESTES-PRATICOS.md (VALIDAR)
│     ├─ 📋 CHECKLIST-SEGURANCA.md (ROADMAP)
│     ├─ 🚀 NETLIFY-DEPLOY-GUIDE.md (DEPLOY)
│     └─ [18 outros documentos]
│
├─ 💼 COMERCIAL
│  └─ proposals/
│     ├─ 📄 PROPOSTA-SR-ALTINO.html
│     ├─ 📄 PROPOSTA-SHOWZAP.html
│     └─ 📄 PROPOSTA-COMERCIAL-TEMPLATE.md
│
├─ 📊 ANÁLISES
│  └─ analysis/
│     ├─ 📈 ANALISE-PRESENCA-ONLINE.md
│     ├─ 📈 CASE-STUDY-SR-ALTINO.md
│     └─ 📊 [relatórios]
│
├─ 🤖 WHATSAPP
│  └─ n8n/
│     ├─ ⚡ QUICKSTART-N8N.md (COMECE AQUI)
│     ├─ ⚡ N8N-WHATSAPP-SETUP.md (SETUP)
│     ├─ ⚡ N8N-WORKFLOWS-EXAMPLES.md (EXEMPLOS)
│     └─ 📄 WEBHOOK-CONFIG.md
│
├─ 🐳 CONTAINER
│  └─ docker/
│     ├─ 📦 Dockerfile
│     ├─ 📦 docker-compose.yml
│     └─ 📦 nginx.conf
│
├─ ⚙️ CONFIGURAÇÃO
│  └─ config/
│     ├─ 🔧 .env.example
│     ├─ 🔧 .gitignore
│     └─ [configs]
│
├─ 💾 CÓDIGO
│  └─ src/
│     ├─ ⚙️ n8n-integration.js
│     └─ [módulos]
│
├─ 📅 HISTÓRICO
│  └─ versions/
│     ├─ 📦 v0-2026-04-18/ (PRIMEIRA)
│     ├─ 📦 v2-2026-04-18/ (SEGUNDA)
│     ├─ 📦 v3-2026-04-18/ (ATUAL ⭐)
│     └─ [ZIPs antigos]
│
├─ 📋 TEMPLATES
│  └─ templates/
│     └─ 📧 TEMPLATES-EMAIL-VENDAS.md
│
├─ 💾 DADOS
│  └─ data/
│     └─ 📊 sr-altino-case-study-data.json
│
└─ 📖 NAVEGAÇÃO (raiz)
   ├─ 📄 README.md (LEIA PRIMEIRO)
   ├─ 📄 ESTRUTURA.md (ESTE ARQUIVO)
   └─ ⚙️ netlify.toml
```

---

## 🎓 ROTEIROS RÁPIDOS

### 👶 Iniciante (Quero entender tudo)
```
1. Ler README.md
   ↓
2. Explorar ESTRUTURA.md
   ↓
3. Fazer deploy (docs/NETLIFY-DEPLOY-GUIDE.md)
   ↓
4. Testar login
   ↓
5. Ler docs/SEGURANCA-PROPRIETARIO.md
```

### 👨‍💻 Desenvolvedor (Quero modificar)
```
1. Editar em netlify-deploy/
   ↓
2. Entender auth-v2.js
   ↓
3. Fazer testes (docs/TESTES-PRATICOS.md)
   ↓
4. git push (auto-deploy)
   ↓
5. Implementar backend
```

### 🚀 DevOps (Quero fazer deploy)
```
1. Conectar Netlify
   ↓
2. Setup auto-deploy do GitHub
   ↓
3. Configurar Docker (opcional)
   ↓
4. Preparar HTTPS
   ↓
5. Monitorar builds
```

### 💼 Vendedor (Quero propostas)
```
1. Abrir proposals/PROPOSTA-SR-ALTINO.html
   ↓
2. Customizar com seu nome
   ↓
3. Imprimir ou enviar
   ↓
4. Ver case study em analysis/
```

### 🤖 Integrador WhatsApp (Quero n8n)
```
1. Ler n8n/QUICKSTART-N8N.md
   ↓
2. Setup n8n/N8N-WHATSAPP-SETUP.md
   ↓
3. Ver exemplos n8n/N8N-WORKFLOWS-EXAMPLES.md
   ↓
4. Integrar no proprietario.html
```

---

## ⚡ ATALHOS

| Preciso de | Arquivo |
|-----------|---------|
| Começar | `README.md` |
| Navegar | `ESTRUTURA.md` |
| Fazer deploy | `docs/NETLIFY-DEPLOY-GUIDE.md` |
| Entender segurança | `docs/SEGURANCA-PROPRIETARIO.md` |
| Fazer backend | `docs/BACKEND-AUTENTICACAO.md` |
| Testar tudo | `docs/TESTES-PRATICOS.md` |
| Proposta | `proposals/PROPOSTA-SR-ALTINO.html` |
| WhatsApp | `n8n/QUICKSTART-N8N.md` |
| Docker | `docker/docker-compose.yml` |
| Histórico | `versions/` |

---

## 📊 O QUE CADA PASTA CONTÉM

### 🌐 netlify-deploy/ (8 arquivos)
Arquivos prontos para produção no Netlify
- 2 HTML (index, login)
- 1 Dashboard (proprietario.html)
- 2 JS (auth.js, auth-v2.js)
- 1 CSS
- 2 Configs (netlify.toml, _redirects)

### 📚 docs/ (19 arquivos)
Toda documentação do projeto
- Guias de segurança
- Guias de deploy
- Guias de backend
- Checklists
- Testes práticos
- Referências

### 💼 proposals/ (3 arquivos)
Propostas comerciais prontas
- Template Sr. Altino
- Template ShowZap
- Template genérico

### 📊 analysis/ (2 arquivos)
Análises de mercado
- Análise de presença online
- Case study

### 🤖 n8n/ (5 arquivos)
Integração WhatsApp
- Setup rápido
- Setup completo
- Exemplos de workflow
- Configs de webhook

### 🐳 docker/ (7 arquivos)
Containerização
- Dockerfile
- docker-compose.yml
- Configs nginx

### ⚙️ config/ (3 arquivos)
Configurações do projeto
- .env.example
- .gitignore
- Configs gerais

### 💾 src/ (1 arquivo)
Código-fonte
- n8n-integration.js

### 📅 versions/ (4 pastas)
Histórico de versões
- v0 (primeira)
- v2 (segunda)
- v3 (atual)
- ZIPs antigos

### 📋 templates/ (1 arquivo)
Templates reutilizáveis
- Templates de email

### 💾 data/ (1 arquivo)
Dados estruturados
- Case study JSON

---

## 🎯 CHECKLIST DE SETUP

### Initial Setup
- [ ] Clonar repositório
- [ ] Ler `README.md`
- [ ] Ler `ESTRUTURA.md`
- [ ] Explorar pastas

### Deploy
- [ ] Conectar Netlify
- [ ] Fazer primeiro deploy
- [ ] Testar em produção
- [ ] Configurar domínio

### Segurança
- [ ] Ler docs/SEGURANCA-PROPRIETARIO.md
- [ ] Entender auth-v2.js
- [ ] Fazer testes em docs/TESTES-PRATICOS.md
- [ ] Planejar backend

### Desenvolvimento
- [ ] Setup ambiente local
- [ ] Editar em netlify-deploy/
- [ ] Testar mudanças
- [ ] git push (auto-deploy)

### Integração WhatsApp
- [ ] Setup n8n
- [ ] Criar workflows
- [ ] Integrar em proprietario.html
- [ ] Testar envio

---

## 🚀 PRÓXIMOS PASSOS

**Imediato:**
1. Conectar Netlify
2. Fazer primeiro deploy
3. Testar login/segurança

**Esta semana:**
1. Ler guias de segurança
2. Implementar backend
3. Integrar WhatsApp (opcional)

**Este mês:**
1. Ir para produção
2. Configurar domínio
3. Começar a vender

---

**Última atualização:** 2026-04-20  
**Versão:** 3.0  
**Mantido por:** Automatiz.Ai

✨ **Estrutura pronta para crescer!**
