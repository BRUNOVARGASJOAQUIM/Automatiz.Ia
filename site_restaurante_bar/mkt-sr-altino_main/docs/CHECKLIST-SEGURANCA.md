# ✅ CHECKLIST: IMPLEMENTAR SEGURANÇA PROPRIETÁRIO

## 🎯 OBJETIVO FINAL
Implementar autenticação segura para a área do proprietário com backend

---

## 📋 FASE 1: FRONTEND (JÁ PRONTO ✅)

- [x] **auth-v2.js criado** - Sistema JWT completo
  - JWT com expiração 30 minutos
  - Rate limiting (5 tentativas → 15 min bloqueio)
  - SessionStorage (não localStorage)
  - Validação contínua cada 60 segundos
  - Refresh automático a cada 25 minutos
  - Sincronização entre abas
  - Logs de segurança

- [x] **login.html atualizado** - Melhor UX
  - Integração com auth-v2.js
  - Mensagens de erro específicas
  - Indicador de tentativas
  - Feedback visual
  - Auto-redirect se já logado

- [x] **Documentação completa**
  - SEGURANCA-PROPRIETARIO.md (guia completo)
  - BACKEND-AUTENTICACAO.md (exemplos Node/Python)

---

## ⏳ FASE 2: DEPLOY FRONTEND (PRÓXIMO)

### Passo 1: Ativar auth-v2.js no login.html
```html
<!-- MUDAR DE:
<script src="auth.js"></script>

PARA:
<script src="auth-v2.js"></script>
-->
```

### Passo 2: Testar localmente
1. Abrir login.html em navegador
2. Tentar login com:
   - ✅ User: proprietario / Pass: senha123
3. Testar proteção:
   - ❌ Acessar /proprietario diretamente
   - Deve redirecionar para /login
4. Testar rate limiting:
   - Tentar login errado 6 vezes
   - Deve bloquear por 15 minutos

### Passo 3: Deploy (Git → Netlify Auto-Deploy)
```bash
git add -A
git commit -m "🔐 Melhorias de segurança: auth-v2.js com JWT"
git push
# Netlify auto-deploy em ~2 minutos
```

**Status**: ⏳ Aguardando execução

---

## 🔧 FASE 3: IMPLEMENTAR BACKEND (CRÍTICO!)

### ⚠️ ATUAL: Apenas Frontend
- Segurança: **7/10** ⚠️
- Risco: Senhas visíveis no código
- Problema: Validação somente no cliente

### ✅ ALVO: Frontend + Backend
- Segurança: **10/10** 🔒
- Proteção: JWT assinado pelo servidor
- Validação: Server-side + Client-side

### Opção A: Node.js (RECOMENDADO)
1. Ler: `docs/BACKEND-AUTENTICACAO.md` (seção Node.js)
2. Criar `server.js` no backend
3. Instalar dependências: `npm install express bcryptjs jsonwebtoken`
4. Configurar `.env` com JWT_SECRET
5. Testar com Postman/Insomnia
6. Deploy em Railway/Heroku
7. Atualizar frontend para usar `/api/auth/login`

**Tempo**: ~2-4 horas  
**Dificuldade**: Médio

### Opção B: Python/Flask
1. Ler: `docs/BACKEND-AUTENTICACAO.md` (seção Python)
2. Criar `app.py` com Flask-JWT
3. Instalar: `pip install flask flask-jwt-extended`
4. Configurar autenticação
5. Deploy em Railway
6. Conectar frontend

**Tempo**: ~2-4 horas  
**Dificuldade**: Médio

### Opção C: Firebase (Mais Fácil)
1. Criar projeto Firebase
2. Ativar autenticação por email/senha
3. Usar SDK no frontend
4. Validação automática

**Tempo**: ~1 hora  
**Dificuldade**: Fácil

---

## 🧪 FASE 4: TESTES DE SEGURANÇA

### Teste 1: Acesso Não-Autorizado
```
1. Abrir proprietario.html sem login
2. ❌ DEVE: Redirecionar para login
3. ✅ RESULTADO: Token inválido → Redireciona
```

### Teste 2: Brute Force
```
1. Tentar login com:
   - Admin / senha_errada
   - Admin / outra_senha
   - Admin / teste123
   - Admin / 123456
   - Admin / password
   - Admin / qualquer_coisa
2. ❌ DEVE: Bloquear na 6ª tentativa
3. ✅ RESULTADO: "⏰ Sua conta foi bloqueada por 15 minutos"
```

### Teste 3: Token Expiration
```
1. Fazer login
2. Abrir DevTools → Console
3. Executar: localStorage.removeItem('auth_token');
4. Atualizar página
5. ❌ DEVE: Redirecionar para login
6. ✅ RESULTADO: Sessão expirada
```

### Teste 4: Cross-Tab Sync
```
1. Abrir proprietario.html em Tab A (logado)
2. Abrir proprietario.html em Tab B
3. Fazer logout em Tab A
4. ❌ DEVE: Tab B também fazer logout
5. ✅ RESULTADO: Sincronização automática
```

### Teste 5: XSS Protection
```
1. No campo de login, tentar:
   <img src=x onerror=alert('XSS')>
2. ❌ NÃO DEVE: Executar JavaScript
3. ✅ RESULTADO: Tratado como entrada normal
```

### Teste 6: CSRF Protection
```
1. Com auth-v2.js: Protegido automaticamente
2. Com backend JWT: Token só aceita requisições de seu domínio
3. ✅ RESULTADO: Requisições maliciosas bloqueadas
```

---

## 📊 MATRIZ DE IMPLEMENTAÇÃO

| Componente | Frontend | Backend | Status |
|-----------|----------|---------|--------|
| Login Form | ✅ | - | ✅ Pronto |
| auth-v2.js | ✅ | - | ✅ Pronto |
| JWT Tokens | ✅ | ⏳ | ⏳ Pendente |
| Rate Limit | ✅ | ⏳ | ⏳ Pendente |
| Password Hash | - | ⏳ | ⏳ Pendente |
| CORS | - | ⏳ | ⏳ Pendente |
| Logs | ✅ | ⏳ | ⏳ Pendente |
| 2FA | - | ⏳ | 🔮 Futuro |

---

## 🚀 PRÓXIMAS AÇÕES RECOMENDADAS

### Hoje (DEVE-fazer):
- [ ] Revisar login.html atualizado
- [ ] Testar proteção localmente
- [ ] Deploy frontend com auth-v2.js

### Esta semana (DEVERIA-fazer):
- [ ] Escolher backend (Node/Python/Firebase)
- [ ] Ler documentação backend
- [ ] Começar implementação

### Este mês (PODERIA-fazer):
- [ ] Terminar backend
- [ ] Implementar 2FA
- [ ] Configurar logs centralizados

---

## 🔐 RESUMO DE SEGURANÇA

```
ANTES:
├─ Auth: localStorage (inseguro)
├─ Senhas: Plain text (muito ruim)
├─ Validação: Client-only (fraco)
├─ Expiração: Nenhuma (perigoso)
├─ Brute force: Desprotegido
└─ Segurança: 2/10 ❌

DEPOIS (Fase 2 - Hoje):
├─ Auth: sessionStorage + JWT (melhor)
├─ Senhas: Ainda client-side (OK para demo)
├─ Validação: Client-side (aceitável)
├─ Expiração: 30 minutos (bom)
├─ Brute force: 5 tentativas (bom)
└─ Segurança: 7/10 ✅

ALVO (Fase 3 - Com Backend):
├─ Auth: JWT assinado servidor (excelente)
├─ Senhas: Bcrypt hash (excelente)
├─ Validação: Server-side (excelente)
├─ Expiração: Token + Refresh (excelente)
├─ Brute force: Rate limiting server (excelente)
└─ Segurança: 10/10 🔒
```

---

## 📚 REFERÊNCIAS

- [JWT.io](https://jwt.io) - Entender JWT
- [OWASP Top 10](https://owasp.org/www-project-top-ten/) - Segurança web
- [MDN: localStorage vs sessionStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [Auth0 Best Practices](https://auth0.com/blog/secure-jwt-practices/)
- [Bcrypt Hash Generator](https://bcrypt-generator.com/)

---

## 💡 DÚVIDAS FREQUENTES

**P: Posso usar auth-v2.js em produção?**
R: Não. É apenas para demo. Produção PRECISA de backend.

**P: Quanto tempo leva implementar backend?**
R: 2-4 horas com documentação pronta.

**P: Qual backend é melhor?**
R: Node.js é mais fácil; Python é mais legível; Firebase é mais rápido.

**P: auth-v2.js vai bloquear os usuários?**
R: Sim, após 5 tentativas erradas (15 min bloqueio).

**P: Como resetar o bloqueio?**
R: Abrir DevTools → sessionStorage → remover `auth_blocked`

---

**Última atualização**: 2024  
**Versão**: 1.0  
**Status**: Pronto para implementação ✅
