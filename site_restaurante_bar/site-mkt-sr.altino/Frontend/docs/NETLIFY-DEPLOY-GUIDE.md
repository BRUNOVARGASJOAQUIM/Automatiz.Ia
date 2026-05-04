# 🚀 GUIA: DEPLOY NO NETLIFY VIA GITHUB

## ✅ Status Atual

- ✅ Repositório GitHub criado: `https://github.com/BRUNOVARGASJOAQUIM/automatiz-showzap-sr-altino`
- ✅ Código enviado (git push)
- ✅ Branch main atualizado
- ⏳ Netlify: Aguardando conexão

---

## 📋 PASSOS PARA CONECTAR NETLIFY

### 1️⃣ Acessar Netlify
```
1. Ir para: https://app.netlify.com
2. Clicar em: "Log in with GitHub"
3. Fazer login com suas credenciais GitHub
4. Autorizar Netlify a acessar seus repositórios
```

### 2️⃣ Adicionar Novo Site
```
1. No dashboard Netlify, clicar: "New site from Git"
OU "Add new site"

2. Escolher plataforma: GitHub
3. Conectar e autorizar (se pedido)
```

### 3️⃣ Selecionar Repositório
```
1. Procurar por: "automatiz-showzap-sr-altino"
2. Selecionar o repositório
3. Clicar em: "Next"
```

### 4️⃣ Configurar Deploy
```
Preencher:

BASIC BUILD SETTINGS:
├─ Branch to deploy: main
├─ Build command: (deixar vazio)
├─ Publish directory: . (ponto)

ADVANCED BUILD SETTINGS:
├─ Clique em: Show advanced
├─ Adicione Variáveis de Ambiente se precisar:
   - JWT_SECRET: sua_chave_secreta
   - NODE_ENV: production
```

### 5️⃣ Deploy
```
1. Clicar: "Deploy site"
2. Aguardar ~2 minutos
3. Netlify vai gerar URL automática
4. Site ao vivo! 🎉
```

---

## 📁 ESTRUTURA ENVIADA PARA GITHUB

```
main branch contém:
├─ index.html                    (página inicial)
├─ login.html                    (login - novo!)
├─ proprietario.html             (área proprietário)
├─ auth.js                       (autenticação old)
├─ auth-v2.js                    (autenticação NEW - JWT)
├─ style.css                     (estilos)
├─ n8n-integration.js            (integração WhatsApp)
├─ qr.html                       (QR code)
├─ netlify.toml                  (configuração Netlify)
├─ _redirects                    (redirecionamentos)
├─ docs/                         (documentação)
│  ├─ SEGURANCA-PROPRIETARIO.md  (🔐 NEW!)
│  ├─ BACKEND-AUTENTICACAO.md    (🔐 NEW!)
│  ├─ CHECKLIST-SEGURANCA.md     (🔐 NEW!)
│  ├─ TESTES-PRATICOS.md         (🔐 NEW!)
│  └─ ...outros docs
└─ proposals/                    (propostas)
```

---

## 🔐 MELHORIAS IMPLEMENTADAS

### auth-v2.js (NOVO!)
- ✅ JWT com 30 minutos expiração
- ✅ SessionStorage (seguro)
- ✅ Rate limiting: 5 tentativas → 15 min bloqueio
- ✅ Validação contínua 60 segundos
- ✅ Refresh automático 25 minutos
- ✅ Proteção contra acesso direto

### Documentação
- ✅ SEGURANCA-PROPRIETARIO.md (guia completo)
- ✅ BACKEND-AUTENTICACAO.md (Node/Python/Firebase)
- ✅ CHECKLIST-SEGURANCA.md (roadmap)
- ✅ TESTES-PRATICOS.md (validação)

---

## 🔗 LINKS IMPORTANTES

| Tipo | URL |
|------|-----|
| GitHub Repo | https://github.com/BRUNOVARGASJOAQUIM/automatiz-showzap-sr-altino |
| Netlify Login | https://app.netlify.com |
| GitHub Login | https://github.com/login |

---

## ⚙️ CONFIGURAÇÃO NETLIFY (Optional - se usar netlify.toml)

Arquivo: `netlify.toml`
```toml
[build]
  command = ""
  publish = "."

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## 🧪 TESTES APÓS DEPLOY

1. **Acesso público**
   ```
   https://seu-site-netlify.netlify.app
   Deve mostrar: home com link para login
   ```

2. **Login**
   ```
   https://seu-site-netlify.netlify.app/login
   Teste: proprietario / senha123
   ```

3. **Proteção proprietário**
   ```
   https://seu-site-netlify.netlify.app/proprietario
   Sem login: redireciona para /login
   Com login: mostra dashboard
   ```

4. **Rate limiting**
   ```
   Teste 6 vezes com senha errada
   Resultado: bloqueio 15 minutos
   ```

---

## ❓ DÚVIDAS COMUNS

**P: URL do site?**
R: Após deploy, Netlify gera: `seu-nome-projeto.netlify.app`

**P: Como mudar domínio?**
R: Em Netlify → Site Settings → Domain Management → Custom Domain

**P: Auto-deploy funciona?**
R: Sim! Cada git push em main dispara novo deploy automático

**P: Demora quanto tempo?**
R: ~1-2 minutos por deploy

**P: Posso ver logs?**
R: Sim! Netlify → Deploys → clique no deploy → ver logs

---

## 🚀 PRÓXIMAS ETAPAS

1. ✅ Deploy no Netlify (HOJE)
2. ⏳ Implementar backend para segurança real
3. ⏳ Adicionar 2FA
4. ⏳ Integrar com Twilio/n8n

---

## 📞 SUPORTE

**Problema no deploy?**
1. Verificar Netlify Builds → Logs
2. Ver erro específico
3. Corrigir e fazer git push
4. Deploy automático refaz sozinho

**Arquivo não encontrado?**
1. Verificar se arquivo está em: `netlify-deploy/`
2. Fazer `git add` + `git push`
3. Deploy automático atualiza

---

**Status:** ✅ Pronto para Netlify  
**Repositório:** https://github.com/BRUNOVARGASJOAQUIM/automatiz-showzap-sr-altino  
**Última atualização:** 2026-04-20
