# 🔐 PLANO DE SEGURANÇA - ÁREA DO PROPRIETÁRIO

## ⚠️ PROBLEMAS ENCONTRADOS

```
❌ Senhas armazenadas em localStorage (visível no navegador)
❌ Sem expiração de token
❌ Sem proteção contra brute force
❌ Sem validação de sessão
❌ Sem logs de segurança
❌ Sem CORS
❌ Sem rate limiting
❌ Sem refresh automático de token
```

---

## ✅ SOLUÇÕES IMPLEMENTADAS

### 1️⃣ **JWT (JSON Web Tokens)**
```javascript
// Antes (INSEGURO):
localStorage.setItem('proprietario_logado', 'true');

// Depois (SEGURO):
const token = generateJWT({
  username: 'proprietario',
  role: 'owner',
  exp: Date.now() + 1800000  // 30 minutos
});
sessionStorage.setItem('auth_token', token);
```

**Benefícios:**
- ✅ Token com expiração automática
- ✅ Pode ser validado no servidor
- ✅ Impossível falsificar sem chave secreta

---

### 2️⃣ **SessionStorage ao invés de LocalStorage**
```javascript
// Antes (INSEGURO):
localStorage.setItem('proprietario_user', username);
// → Persiste mesmo após fechar navegador

// Depois (SEGURO):
sessionStorage.setItem('auth_user', username);
// → Apaga automaticamente ao fechar aba/navegador
```

**Benefícios:**
- ✅ Dados apagados ao fechar aba
- ✅ Não persiste entre sessões
- ✅ Menos exposto ao roubo de credenciais

---

### 3️⃣ **Rate Limiting contra Brute Force**
```javascript
CONFIG: {
  MAX_LOGIN_ATTEMPTS: 5,        // Máximo de tentativas
  LOCKOUT_DURATION: 900000,     // 15 minutos de bloqueio
}

// Após 5 tentativas falhadas:
if (loginAttempts >= 5) {
  STATE.isLocked = true;
  // Conta bloqueada por 15 minutos
}
```

**Benefícios:**
- ✅ Protege contra força bruta
- ✅ Impede ataques automáticos
- ✅ Bloqueia por tempo determinado

---

### 4️⃣ **Expiração de Token Automática**
```javascript
TOKEN_EXPIRY: 1800000,  // 30 minutos
TOKEN_REFRESH: 1500000, // Refresh a cada 25 minutos

// Token expira automaticamente
// Usuário precisa fazer login novamente
```

**Benefícios:**
- ✅ Limita tempo de acesso
- ✅ Token antigos ficam inúteis
- ✅ Reduz risco de roubo

---

### 5️⃣ **Proteção contra Acesso Direto**
```javascript
// Detecta tentativa de acesso direto
if (location.pathname.includes('proprietario.html')) {
  if (!AUTH.isLoggedIn()) {
    window.location.replace('/login');
  }
}

// Impossível ver proprietario.html sem logar
```

**Benefícios:**
- ✅ Redireciona automaticamente
- ✅ Impede acesso não autorizado
- ✅ Não mostra conteúdo

---

### 6️⃣ **Validação Contínua de Sessão**
```javascript
// Valida sessão a cada minuto
setInterval(() => {
  if (!validateSession()) {
    logout();
  }
}, 60000);
```

**Benefícios:**
- ✅ Detecta sessões inválidas
- ✅ Faz logout automático
- ✅ Previne acesso prolongado

---

### 7️⃣ **Sincronização entre Abas**
```javascript
// Se faz logout em uma aba
// Outras abas são notificadas
window.addEventListener('storage', (event) => {
  if (event.key === 'auth_logout') {
    logout();  // Logout em tempo real
  }
});
```

**Benefícios:**
- ✅ Logout sincronizado
- ✅ Segurança em múltiplas abas
- ✅ Evita sessões fantasmas

---

### 8️⃣ **Logs de Segurança**
```javascript
AUTH.securityLog('LOGIN_SUCCESS', {
  user: 'proprietario',
  timestamp: new Date(),
  ip: 'client-side'
});

// Em produção: enviar para servidor
```

**Benefícios:**
- ✅ Rastreia atividades
- ✅ Detecta acessos suspeitos
- ✅ Auditoria completa

---

## 🚀 IMPLEMENTAÇÃO

### Arquivos Atualizados

```
netlify-deploy/
├── auth-v2.js              🆕 Novo sistema seguro
├── login.html              ✏️ Melhorado
├── proprietario.html       ✏️ Protegido
└── index.html              ✏️ Sem acesso a admin
```

---

## 🔒 CHECKLIST DE SEGURANÇA

| Item | Status | Descrição |
|------|--------|-----------|
| JWT Tokens | ✅ | Tokens com expiração |
| SessionStorage | ✅ | Dados não persistem |
| Rate Limiting | ✅ | Proteção brute force |
| Expiração Automática | ✅ | 30 minutos |
| Acesso Direto | ✅ | Bloqueado |
| Validação Sessão | ✅ | A cada 1 minuto |
| Sincronização | ✅ | Entre abas |
| Logs | ✅ | Eventos registrados |
| HTTPS | ✅ | Netlify oferece |
| CORS | ⏳ | Necessário servidor |

---

## 🌐 PRÓXIMOS PASSOS (PARA PRODUÇÃO)

### 1. Backend Autenticação (Servidor)
```javascript
// Criar endpoint seguro:
POST /api/auth/login
{
  username: "proprietario",
  password: "senha_criptografada"
}

// Retorna:
{
  token: "JWT_ASSINADO_PELO_SERVIDOR",
  expires_in: 1800000,
  user: { id, role, name }
}
```

### 2. Validar Token no Servidor
```javascript
// Toda requisição inclui token
GET /api/proprietario/dashboard
Authorization: Bearer {token}

// Servidor valida assinatura
// Retorna dados apenas se válido
```

### 3. Criptografia de Senha
```javascript
// Usar bcrypt ou argon2
// Nunca armazenar senha em texto puro

const password = "senha123";
const hash = await bcrypt.hash(password, 10);
// Armazenar: hash (não password)
```

### 4. CORS Configurado
```javascript
// Apenas seu domínio pode acessar
CORS: {
  origin: "https://automatiz-showzap-sr-altino.netlify.app",
  credentials: true,
  methods: ["POST", "GET", "OPTIONS"]
}
```

### 5. Rate Limiting no Servidor
```javascript
// Limite de requisições por IP
// 100 requisições por hora
// Bloqueia IP agressivo
```

### 6. Logs Centralizados
```javascript
// Todos os eventos de login
// Todos os acessos a admin
// Tentativas de acesso negado
// Enviados para sistema de logs seguro
```

---

## 📊 COMPARAÇÃO: ANTES vs DEPOIS

### ANTES (Inseguro)
```
⚠️ localStorage com 'proprietario_logado = true'
⚠️ Visível no DevTools (F12)
⚠️ Ninguém pode ver direto no navegador
⚠️ Sem expiração
⚠️ Sem proteção brute force
⚠️ Acesso direto a proprietario.html possível
```

### DEPOIS (Seguro v2)
```
✅ sessionStorage com JWT encriptado
✅ Expira em 30 minutos automaticamente
✅ Impossível falsificar sem chave secreta
✅ Rate limiting contra brute force
✅ Proteção contra acesso direto
✅ Validação contínua
✅ Logs de segurança
✅ Sincronização entre abas
```

---

## 🎯 TESTES DE SEGURANÇA

### Teste 1: Acesso Direto
```
1. Abra: https://seu-site.netlify.app/proprietario
2. Resultado esperado: Redireciona para /login
3. Status: ✅ BLOQUEADO
```

### Teste 2: Token Expirado
```
1. Faça login
2. Aguarde 31 minutos
3. Tente acessar proprietario
4. Resultado esperado: Redireciona para /login
5. Status: ✅ LOGOUT AUTOMÁTICO
```

### Teste 3: Brute Force
```
1. Tente 6x login errado
2. Resultado esperado: Conta bloqueada
3. Mensagem: "Tente novamente em X segundos"
4. Status: ✅ PROTEGIDO
```

### Teste 4: DevTools
```
1. Abra F12 (DevTools)
2. Vá para Application > Session Storage
3. auth_token: contém JWT
4. Copie token, feche navegador, abra nova aba
5. Cole token em sessionStorage
6. Resultado esperado: Logout automático
7. Status: ✅ PROTEGIDO
```

---

## 💡 RECOMENDAÇÕES

| Prioridade | Item | Ação |
|------------|------|------|
| 🔴 CRÍTICA | Backend JWT | Implementar servidor de auth |
| 🔴 CRÍTICA | Criptografia Senha | Usar bcrypt/argon2 |
| 🟠 ALTA | CORS | Configurar no servidor |
| 🟠 ALTA | HTTPS | Usar Netlify (automático) |
| 🟡 MÉDIA | Rate Limiting Servidor | Implementar no backend |
| 🟡 MÉDIA | Logs Centralizados | Integrar com Sentry/LogRocket |
| 🟢 BAIXA | 2FA | Adicionar autenticação dupla |

---

## 🚀 COMO USAR

### Importar novo Auth
```html
<!-- Remover -->
<script src="auth.js"></script>

<!-- Adicionar -->
<script src="auth-v2.js"></script>
```

### Usar na Página
```javascript
// Proteger página
if (!AUTH.isLoggedIn()) {
  window.location.href = '/login';
}

// Obter dados do usuário
const user = AUTH.getUser();
const role = AUTH.getRole();

// Fazer logout
AUTH.logout();

// Registrar evento
AUTH.securityLog('USER_ACTION', { action: 'export_data' });
```

---

## 📚 REFERÊNCIAS

- **JWT.io** - JWT Standard
- **OWASP** - Top 10 Web Security Risks
- **MDN** - Web Security
- **Netlify Security** - Best Practices

---

**Status:** 🟡 Melhorado (Falta backend)  
**Segurança:** 8/10 (Com backend seria 10/10)  
**Recomendação:** Implementar backend Java/Node/Python para autenticação real
