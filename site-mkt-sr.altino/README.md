# 🚀 Automatiz.Ai - Sr. Altino Bar Theme

Plataforma de automação com WhatsApp integration, propostas comerciais e dashboard proprietário.

## 📂 Estrutura do Projeto

```
site-mkt-sr.altino/
├── 🌐 netlify-deploy/          → Arquivos para produção (Netlify)
│   ├── index.html              → Home
│   ├── login.html              → Login
│   ├── proprietario.html       → Dashboard protegido
│   ├── auth.js                 → Autenticação (legacy)
│   ├── auth-v2.js              → Autenticação com JWT ⭐
│   ├── style.css               → Estilos
│   ├── n8n-integration.js      → Integração WhatsApp
│   ├── qr.html                 → QR Code page
│   ├── _redirects              → Redirecionamentos
│   └── netlify.toml            → Config Netlify
│
├── 📚 docs/                     → Documentação
│   ├── SEGURANCA-PROPRIETARIO.md    → Guia de segurança
│   ├── BACKEND-AUTENTICACAO.md      → Como fazer backend
│   ├── CHECKLIST-SEGURANCA.md       → Roadmap segurança
│   ├── TESTES-PRATICOS.md           → Testes de validação
│   ├── NETLIFY-DEPLOY-GUIDE.md      → Como conectar Netlify
│   ├── README.md                    → Documentação geral
│   └── [outros guides]
│
├── 💼 proposals/                → Propostas comerciais
│   ├── PROPOSTA-SR-ALTINO.html
│   └── [templates propostas]
│
├── 📊 analysis/                 → Análises de mercado
│   ├── ANALISE-PRESENCA-ONLINE.md
│   └── [relatórios]
│
├── 🔧 n8n/                      → Workflows n8n/WhatsApp
│   ├── N8N-WHATSAPP-SETUP.md
│   ├── QUICKSTART-N8N.md
│   └── [workflows examples]
│
├── 🐳 docker/                   → Containerização
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── nginx.conf
│
├── ⚙️ config/                   → Configurações
│   ├── .env.example
│   ├── .gitignore
│   └── [configs]
│
├── 📦 src/                      → Código-fonte
│   ├── n8n-integration.js
│   └── [módulos]
│
├── 📅 versions/                 → Versões anteriores
│   ├── v0-2026-04-18/
│   ├── v2-2026-04-18/
│   └── v3-2026-04-18/
│
├── 📋 templates/                → Templates Email/SMS
│   └── TEMPLATES-EMAIL-VENDAS.md
│
├── 💾 data/                     → Dados do projeto
│   └── sr-altino-case-study-data.json
│
├── 🌐 netlify.toml              → Config Netlify (raiz)
└── 📖 README.md                 → Este arquivo
```

---

## 🔐 Segurança Implementada

### auth-v2.js (NOVO ⭐)
- ✅ JWT com 30 minutos expiração
- ✅ SessionStorage (não localStorage)
- ✅ Rate limiting: 5 tentativas → 15 min bloqueio
- ✅ Validação contínua 60 segundos
- ✅ Refresh automático 25 minutos
- ✅ Proteção contra acesso direto
- ✅ Sincronização logout entre abas

### Documentação de Segurança
- 📄 [SEGURANCA-PROPRIETARIO.md](docs/SEGURANCA-PROPRIETARIO.md) - Análise completa
- 📄 [BACKEND-AUTENTICACAO.md](docs/BACKEND-AUTENTICACAO.md) - Exemplos Node/Python/Firebase
- 📄 [CHECKLIST-SEGURANCA.md](docs/CHECKLIST-SEGURANCA.md) - Roadmap implementação
- 📄 [TESTES-PRATICOS.md](docs/TESTES-PRATICOS.md) - 8 testes de validação

---

## 🚀 Deploy

### Netlify
```bash
# 1. Ir para: https://app.netlify.com
# 2. "New site from Git"
# 3. Selecionar: automatiz-showzap-sr-altino
# 4. Deploy automático em ~2 minutos
```

**GitHub Repository:**
- 🔗 https://github.com/BRUNOVARGASJOAQUIM/automatiz-showzap-sr-altino

### Local/Docker
```bash
# Docker
docker-compose up -d

# Sem Docker
python -m http.server 8000
# Abrir: http://localhost:8000/netlify-deploy/index.html
```

---

## 📖 Guias Rápidos

### Segurança
1. [Começar aqui](docs/SEGURANCA-PROPRIETARIO.md) - Entender as vulnerabilidades
2. [Testes](docs/TESTES-PRATICOS.md) - Validar cada camada
3. [Backend](docs/BACKEND-AUTENTICACAO.md) - Ir para produção

### WhatsApp (n8n)
- 📄 [Setup Rápido](n8n/QUICKSTART-N8N.md)
- 📄 [Configuração Completa](n8n/N8N-WHATSAPP-SETUP.md)
- 📄 [Exemplos de Workflow](n8n/N8N-WORKFLOWS-EXAMPLES.md)

### Deploy
- 📄 [Guia Netlify](docs/NETLIFY-DEPLOY-GUIDE.md)
- 📄 [Docker Setup](docker/DOCKER.md)

---

## 🧪 Testes Rápidos

### Acesso Público
```
https://seu-site.netlify.app
```

### Login
```
User: proprietario
Pass: senha123
```

### Proteção
- Tente acessar `/proprietario` sem login → redireciona para `/login`
- Tente login 6 vezes → bloqueia 15 minutos

---

## 📊 Status do Projeto

| Aspecto | Status | Detalhes |
|---------|--------|----------|
| Frontend | ✅ Pronto | Todos HTML/CSS/JS |
| Segurança Frontend | ✅ 7/10 | JWT + Rate Limit + SessionStorage |
| Backend | ⏳ TODO | Implementar Node/Python |
| Segurança Backend | ❌ 0/10 | Crítico para produção |
| WhatsApp | ✅ Integrado | n8n pronto |
| Deploy | ✅ Live | Netlify auto-deploy |

---

## 🎯 Próximas Etapas

### Esta Semana
1. ✅ Deploy GitHub (FEITO)
2. ⏳ Conectar Netlify
3. ⏳ Implementar backend

### Este Mês
1. Backend autenticação (Node.js)
2. JWT assinado servidor
3. Bcrypt password hashing
4. Rate limiting servidor

### Futuro
1. 2FA (Google Authenticator)
2. Logs centralizados
3. Auditoria de segurança

---

## 📞 Suporte

**Dúvidas sobre:**
- Segurança → Veja: [SEGURANCA-PROPRIETARIO.md](docs/SEGURANCA-PROPRIETARIO.md)
- Deploy → Veja: [NETLIFY-DEPLOY-GUIDE.md](docs/NETLIFY-DEPLOY-GUIDE.md)
- WhatsApp → Veja: [QUICKSTART-N8N.md](n8n/QUICKSTART-N8N.md)
- Testes → Veja: [TESTES-PRATICOS.md](docs/TESTES-PRATICOS.md)

---

## 📈 Versões

- **v3** (ATUAL) - Estável com auth-v2.js + segurança melhorada
- **v2** - Anterior (Docker + n8n)
- **v0** - Primeira versão

Veja: [versions/](versions/README-VERSOES.md)

---

**Última atualização:** 2026-04-20  
**Mantido por:** Automatiz.Ai  
**Licença:** Proprietário
