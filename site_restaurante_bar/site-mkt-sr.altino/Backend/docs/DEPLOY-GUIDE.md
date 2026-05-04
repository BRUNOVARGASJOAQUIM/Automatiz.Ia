# 🚀 GUIA DE DEPLOY NO NETLIFY

## Opção 1: Via GitHub (Recomendado)

### Passo 1: Criar repositório no GitHub
```bash
# 1. Acesse https://github.com/new
# 2. Nome: automatiz-showzap-sr-altino
# 3. Descrição: Automatiz.IA - Showzap Sr. Altino Theme
# 4. Público
# 5. Crie o repositório
```

### Passo 2: Push do repositório local
```bash
cd C:\Users\brvar\OneDrive\Projects\Automatiz.Ai\Project 2\site-mkt-sr.altino\netlify-deploy

git remote add origin https://github.com/SEU_USUARIO/automatiz-showzap-sr-altino.git
git branch -M main
git push -u origin main
```

### Passo 3: Deploy no Netlify
```
1. Acesse https://netlify.com
2. Sign up / Login com GitHub
3. Clique "New site from Git"
4. Selecione o repositório "automatiz-showzap-sr-altino"
5. Deploy settings:
   - Build command: (deixar vazio)
   - Publish directory: .
6. Clique "Deploy site"
```

---

## Opção 2: Drag & Drop (Rápido)

```
1. Acesse https://app.netlify.com/drop
2. Arraste a pasta 'netlify-deploy' para a página
3. Pronto! Seu site está live
4. Você receberá uma URL tipo: https://random-name.netlify.app
```

---

## Opção 3: Netlify CLI (Profissional)

### Instalar Netlify CLI
```bash
npm install -g netlify-cli
```

### Deploy
```bash
cd C:\Users\brvar\OneDrive\Projects\Automatiz.Ai\Project 2\site-mkt-sr.altino\netlify-deploy

netlify login
netlify deploy --prod
```

---

## ✅ URLs Após Deploy

Após publicar, você terá:

- **Dashboard:** https://seu-site.netlify.app/
- **Proposta:** https://seu-site.netlify.app/proposta
- **Análise:** https://seu-site.netlify.app/analise
- **Login:** https://seu-site.netlify.app/login
- **Admin:** https://seu-site.netlify.app/admin

---

## 📝 Configurações do Netlify

O arquivo `netlify.toml` já contém:

✅ Redirects configuradas
✅ Headers de segurança
✅ Cache control
✅ Fallback para SPA

---

## 🎯 Próximas Etapas

1. **Domínio customizado:**
   - Site Settings → Domain Management → Add domain
   - Configure DNS apontando para Netlify

2. **SSL (Automático)**
   - Netlify oferece HTTPS grátis automaticamente

3. **Variáveis de Ambiente:**
   - Site Settings → Build & deploy → Environment
   - Adicionar: API_KEY, N8N_WEBHOOK_URL, etc

4. **Automação de Deploy:**
   - Sempre que fazer push no GitHub, Netlify fará deploy automático

---

## 🔒 Segurança

- ✅ HTTPS automático (Let's Encrypt)
- ✅ Headers de segurança configurados
- ✅ Proteção contra clickjacking (X-Frame-Options)
- ✅ Content Security Policy disponível

---

## 📊 Monitoramento

Após deploy, você verá no Netlify:

- Tempo de build
- Tamanho do site
- Analytics
- Deploy history
- Alertas de erros

---

**Recomendação:** Use a **Opção 1 (GitHub)** para ter controle de versão completo e deploys automáticos.

Caso precise de ajuda: https://docs.netlify.com
