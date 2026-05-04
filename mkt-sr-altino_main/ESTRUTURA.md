# 📂 GUIA DE ESTRUTURA DO PROJETO

## 🎯 Onde encontrar cada coisa?

### 🌐 Para Deploy/Produção
📁 **`netlify-deploy/`**
- `index.html` - Página principal
- `login.html` - Login seguro
- `proprietario.html` - Dashboard protegido
- `auth-v2.js` ⭐ - Autenticação com JWT (USE ESTE!)
- `style.css` - Estilos
- `netlify.toml` - Config Netlify

👉 **Use este diretório para Netlify**

---

### 🔐 Para Segurança
📁 **`docs/`**
- `SEGURANCA-PROPRIETARIO.md` - 📖 Leia primeiro!
- `BACKEND-AUTENTICACAO.md` - Como fazer backend
- `CHECKLIST-SEGURANCA.md` - O que fazer/quando
- `TESTES-PRATICOS.md` - Como validar
- `NETLIFY-DEPLOY-GUIDE.md` - Conectar Netlify

👉 **Leia docs/SEGURANCA-PROPRIETARIO.md para entender**

---

### 💼 Para Propostas
📁 **`proposals/`**
- `PROPOSTA-SR-ALTINO.html` - Modelo Sr. Altino
- Mais templates

👉 **Para enviar para clientes**

---

### 🤖 Para WhatsApp/n8n
📁 **`n8n/`**
- `QUICKSTART-N8N.md` - Começar rápido
- `N8N-WHATSAPP-SETUP.md` - Setup completo
- `N8N-WORKFLOWS-EXAMPLES.md` - Exemplos

👉 **Integração WhatsApp**

---

### 📊 Para Análises
📁 **`analysis/`**
- Análises de mercado
- Pesquisa de concorrentes
- Case studies

👉 **Relatórios e estudos**

---

### 🐳 Para Docker
📁 **`docker/`**
- `Dockerfile` - Imagem
- `docker-compose.yml` - Orquestração
- `nginx.conf` - Web server

👉 **Deploy em container**

---

### 📦 Para Código
📁 **`src/`**
- `n8n-integration.js` - Integração
- Módulos JavaScript

👉 **Código-fonte organizado**

---

### ⚙️ Para Configuração
📁 **`config/`**
- `.env.example` - Variáveis de ambiente
- `.gitignore` - Arquivos ignorados
- Configs gerais

👉 **Configurações do projeto**

---

### 📅 Para Histórico
📁 **`versions/`**
- `v0-2026-04-18/` - Primeira versão
- `v2-2026-04-18/` - Segunda versão
- `v3-2026-04-18/` - Versão atual (estável)

👉 **Backup de versões antigas**

---

### 📋 Para Templates
📁 **`templates/`**
- `TEMPLATES-EMAIL-VENDAS.md` - Templates email

👉 **Reutilizáveis**

---

### 💾 Para Dados
📁 **`data/`**
- `sr-altino-case-study-data.json` - Dados do case
- Datasets

👉 **Dados estruturados**

---

## 🚀 FLUXOS COMUNS

### 1. Quero fazer deploy no Netlify
```
1. Abrir: docs/NETLIFY-DEPLOY-GUIDE.md
2. Ir para: https://app.netlify.com
3. Conectar repositório GitHub
4. Deploy automático! 🎉
```

### 2. Quero melhorar a segurança
```
1. Ler: docs/SEGURANCA-PROPRIETARIO.md
2. Entender: docs/BACKEND-AUTENTICACAO.md
3. Testar: docs/TESTES-PRATICOS.md
4. Implementar: backend (Node/Python)
```

### 3. Quero integrar WhatsApp
```
1. Ler: n8n/QUICKSTART-N8N.md
2. Setup: n8n/N8N-WHATSAPP-SETUP.md
3. Exemplos: n8n/N8N-WORKFLOWS-EXAMPLES.md
4. Integrar no proprietario.html
```

### 4. Quero fazer uma proposta
```
1. Abrir: proposals/PROPOSTA-SR-ALTINO.html
2. Customizar com seu conteúdo
3. Enviar ao cliente
```

### 5. Quero usar Docker
```
1. Ler: docker/DOCKER.md
2. Executar: docker-compose up -d
3. Pronto! Acesse em localhost
```

---

## 📖 ARQUIVOS PRINCIPAIS NA RAIZ

| Arquivo | Objetivo |
|---------|----------|
| `README.md` | 📖 Documentação principal |
| `ESTRUTURA.md` | 📂 Este arquivo (navegação) |
| `netlify.toml` | ⚙️ Config Netlify |
| `.gitignore` | 🔒 Arquivos ignorados |

---

## 🔍 MAPA RÁPIDO

```
BEGINNER?
↓
Leia: README.md
↓
Deploy: docs/NETLIFY-DEPLOY-GUIDE.md
↓
Segurança: docs/SEGURANCA-PROPRIETARIO.md
↓
Implementar: docs/BACKEND-AUTENTICACAO.md

---

DESENVOLVEDOR?
↓
Código: netlify-deploy/ (para editar)
↓
Testes: docs/TESTES-PRATICOS.md
↓
Backend: docs/BACKEND-AUTENTICACAO.md
↓
WhatsApp: n8n/

---

DESIGNER/MARKETING?
↓
Propostas: proposals/
↓
Análises: analysis/
↓
Templates: templates/
```

---

## ✨ ARQUIVOS IMPORTANTES

### ⭐ ESSENCIAIS
- 📄 `netlify-deploy/auth-v2.js` - Novo sistema de autenticação
- 📄 `docs/SEGURANCA-PROPRIETARIO.md` - Entender segurança
- 📄 `docs/BACKEND-AUTENTICACAO.md` - Próximo passo

### 📚 COMPLEMENTARES  
- 📄 `docs/TESTES-PRATICOS.md` - Validar
- 📄 `docs/NETLIFY-DEPLOY-GUIDE.md` - Deploy
- 📄 `n8n/QUICKSTART-N8N.md` - WhatsApp

### 📊 REFERÊNCIA
- 📄 `analysis/ANALISE-PRESENCA-ONLINE.md` - Market research
- 📄 `versions/` - Histórico de versões

---

## 🎓 ROTEIROS DE APRENDIZADO

### Para Iniciantes (1-2 dias)
1. Ler `README.md`
2. Explorar `netlify-deploy/`
3. Fazer deploy no Netlify
4. Testar login/segurança

### Para Desenvolvedores (1 semana)
1. Entender `auth-v2.js`
2. Ler `docs/SEGURANCA-PROPRIETARIO.md`
3. Fazer `docs/TESTES-PRATICOS.md`
4. Implementar backend

### Para DevOps (2 dias)
1. Ler `docker/DOCKER.md`
2. Setup com Docker Compose
3. Configurar Netlify auto-deploy
4. Preparar produção

### Para Gestores (alguns minutos)
1. Explorar `proposals/`
2. Ver `analysis/`
3. Entender roadmap em `docs/CHECKLIST-SEGURANCA.md`

---

## 🆘 NÃO ENCONTROU?

| Procurando | Arquivo |
|-----------|---------|
| Como fazer deploy? | `docs/NETLIFY-DEPLOY-GUIDE.md` |
| Como integrar WhatsApp? | `n8n/QUICKSTART-N8N.md` |
| Como melhorar segurança? | `docs/SEGURANCA-PROPRIETARIO.md` |
| Como fazer um proposta? | `proposals/PROPOSTA-SR-ALTINO.html` |
| Como usar Docker? | `docker/DOCKER.md` |
| Como testar? | `docs/TESTES-PRATICOS.md` |
| Qual versão usar? | `versions/v3-2026-04-18/` |
| Dados do projeto? | `data/sr-altino-case-study-data.json` |

---

## 🎯 CHECKLIST POR PAPEL

### 👨‍💼 Proprietário
- [ ] Ler `README.md`
- [ ] Acessar site via Netlify
- [ ] Testar login (`proprietario/senha123`)
- [ ] Ver propostas em `proposals/`

### 👨‍💻 Dev Frontend
- [ ] Editar em `netlify-deploy/`
- [ ] Entender `auth-v2.js`
- [ ] Fazer testes em `docs/TESTES-PRATICOS.md`
- [ ] Deploy via git push

### 👨‍💻 Dev Backend
- [ ] Ler `docs/BACKEND-AUTENTICACAO.md`
- [ ] Criar API `/api/auth/login`
- [ ] Integrar com `auth-v2.js`
- [ ] Implementar JWT assinado

### 🐳 DevOps
- [ ] Setup Docker com `docker/docker-compose.yml`
- [ ] Configurar Netlify auto-deploy
- [ ] Monitorar builds
- [ ] Preparar HTTPS

### 📊 Marketing/Vendas
- [ ] Usar propostas em `proposals/`
- [ ] Estudar análises em `analysis/`
- [ ] Customizar templates
- [ ] Enviar para prospects

---

**Última atualização:** 2026-04-20  
**Versão:** 3.0  
**Status:** ✅ Pronto para usar
