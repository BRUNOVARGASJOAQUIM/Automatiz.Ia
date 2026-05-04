# 🧪 TESTES PRÁTICOS: SEGURANÇA DO PROPRIETÁRIO

## 🎯 Objetivo
Validar que a segurança está funcionando corretamente

---

## 1️⃣ TESTE: Acesso Direto Bloqueado

### O que testar?
Verificar que não é possível acessar `/proprietario.html` sem estar logado.

### Como testar?

**Passo 1**: Abrir DevTools (F12)
```
Abrir Navegador
Pressionar F12 → Console
```

**Passo 2**: Limpar sessionStorage (simular sem login)
```javascript
sessionStorage.clear();
```

**Passo 3**: Acessar proprietario.html
```
URL: https://seu-site.com/proprietario.html
OU: http://localhost/proprietario.html
```

### Resultado esperado ✅
```
❌ NÃO DEVE: Mostrar dashboard
✅ DEVE: Redirecionar para /login
```

### Se falhar ❌
```javascript
// No console:
AUTH.isLoggedIn()  // Deve retornar false
AUTH.protectPage() // Deve redirecionar
```

---

## 2️⃣ TESTE: Rate Limiting (Brute Force)

### O que testar?
Verificar que após 5 tentativas erradas, a conta bloqueia por 15 minutos.

### Como testar?

**Método 1: UI (Recomendado)**
1. Ir para `/login`
2. Tentar login com:
   - User: proprietario / Pass: errada1
   - User: proprietario / Pass: errada2
   - User: proprietario / Pass: errada3
   - User: proprietario / Pass: errada4
   - User: proprietario / Pass: errada5
3. **6ª tentativa** → Deve bloquear

**Método 2: JavaScript (Console)**
```javascript
// Simular 5 tentativas falhadas
AUTH.login('proprietario', 'errada');
AUTH.login('proprietario', 'errada');
AUTH.login('proprietario', 'errada');
AUTH.login('proprietario', 'errada');
AUTH.login('proprietario', 'errada');

// 6ª tentativa
AUTH.login('proprietario', 'errada');

// Verificar estado
console.log(AUTH.STATE.isLocked);  // true
console.log(AUTH.STATE.lockoutEnd); // timestamp futuro
```

### Resultado esperado ✅
```
❌ TENTATIVA 1-5: "Usuário ou senha incorretos"
✅ TENTATIVA 6+: "⏰ Sua conta foi bloqueada por 15 minutos"
   Lockout até: [hora futura]
```

### Resetar bloqueio (para testes)
```javascript
// No console:
sessionStorage.removeItem('auth_blocked');
AUTH.STATE.isLocked = false;
```

---

## 3️⃣ TESTE: Expiração de Token

### O que testar?
Verificar que o token expira após 30 minutos e faz logout automático.

### Como testar?

**Método 1: Aguardar 30 minutos**
```
1. Fazer login em proprietario.html
2. Aguardar 30 minutos (impraticável)
3. Página deve fazer logout automático
```

**Método 2: Simular expiração (recomendado)**
```javascript
// No console, após login:

// 1. Obter token
const token = sessionStorage.getItem('auth_token');
console.log(token);

// 2. Modificar tempo do sistema (não funciona bem)
// Melhor: Editar o token para ter exp no passado

// 3. Remover token (simula expiração)
sessionStorage.removeItem('auth_token');

// 4. Atualizar página
location.reload();

// Resultado: Deve redirecionar para login
```

**Método 3: Validação contínua (cada 60 segundos)**
```javascript
// O código já faz isso:
setInterval(() => {
  if (!AUTH.validateSession()) {
    AUTH.logout();  // Faz logout se expirado
  }
}, 60000);
```

### Resultado esperado ✅
```
✅ Cada 60 segundos: Validação de token
✅ Se expirado: Logout automático
✅ Redireciona para: /login
✅ Mensagem: "Sessão expirada"
```

---

## 4️⃣ TESTE: Sincronização Entre Abas

### O que testar?
Verificar que logout em uma aba faz logout em todas as outras abas.

### Como testar?

**Passo 1**: Abrir duas abas do navegador
```
Tab A: https://seu-site.com/proprietario.html
Tab B: https://seu-site.com/proprietario.html
```

**Passo 2**: Fazer login em ambas
```
Tab A: Login com proprietario/senha123
Tab B: Atualizar (deve estar logado)
```

**Passo 3**: Fazer logout em uma aba
```
Tab A: Clicar "Logout" (ou fechar)
```

**Passo 4**: Verificar outra aba
```
Tab B: Atualizar página
```

### Resultado esperado ✅
```
✅ Tab A: Logout realizado
✅ Tab B: Automaticamente redirecionado para /login
   (Sem precisar clicar em logout)
```

### Código (Console)
```javascript
// Tab A: Fazer logout
AUTH.logout();

// Tab B: Vai receber evento de storage
// e fazer logout automaticamente

// Verificar logs
AUTH.securityLog('LOGOUT', {tab: 'Tab A'});
```

---

## 5️⃣ TESTE: Proteção XSS (Injeção)

### O que testar?
Verificar que scripts injetados não são executados.

### Como testar?

**Passo 1**: Ir para página de login

**Passo 2**: No campo de usuário, tentar:
```html
<img src=x onerror=alert('XSS')>
```

**Passo 3**: No campo de senha, tentar:
```javascript
<script>alert('Hacked')</script>
```

**Passo 4**: Clicar "Entrar"

### Resultado esperado ✅
```
❌ NÃO DEVE: Mostrar alert() ou executar JavaScript
✅ DEVE: Tratar como entrada normal
✅ Mensagem: "Usuário ou senha incorretos"
```

### Porque funciona?
```javascript
// auth-v2.js usa:
// 1. DOM methods (não innerHTML)
// 2. Validação de entrada
// 3. Escape automático
const username = document.getElementById('username').value;
// Value é sempre string limpa (não HTML)
```

---

## 6️⃣ TESTE: CSRF Protection

### O que testar?
Verificar que requisições maliciosas de outros sites são bloqueadas.

### Como testar?

**Com auth-v2.js (Frontend only):**
```
Proteção automática:
- Token em sessionStorage (não cookie)
- Validação de origem
- Mesmo site apenas
```

**Com Backend (Ideal):**
```javascript
// Backend valida:
1. Origin header
2. Referer header
3. CORS policy
4. Same-site cookies

// Exemplo Node.js:
app.use(cors({
  origin: 'https://seu-site.com',  // Apenas seu domínio
  credentials: true
}));
```

### Resultado esperado ✅
```
✅ requisição de seu-site.com: ACEITA
❌ requisição de malicioso.com: BLOQUEIA
   Erro: "Cross-origin request blocked"
```

---

## 7️⃣ TESTE: Validação Contínua

### O que testar?
Verificar que sessão é validada a cada 60 segundos.

### Como testar?

```javascript
// 1. Fazer login
AUTH.login('proprietario', 'senha123');

// 2. Abrir DevTools → Console
// 3. Executar:

// Verificar se há validação
setInterval(() => {
  console.log('Validando sessão...');
  AUTH.validateSession();
}, 1000);

// 4. Aguardar 60 segundos e observar logs

// 5. Verificar localStorage:
console.log(sessionStorage.getItem('auth_token'));
console.log(sessionStorage.getItem('auth_logado'));
```

### Resultado esperado ✅
```
✅ A cada 60 segundos: validação automática
✅ Token válido: continua autenticado
✅ Token expirado: faz logout
✅ Logs registram validações
```

---

## 8️⃣ TESTE: Auto Refresh de Token

### O que testar?
Verificar que token é automaticamente renovado 5 minutos antes de expirar.

### Como testar?

```javascript
// 1. Fazer login
AUTH.login('proprietario', 'senha123');

// 2. Verificar token inicial
const token1 = sessionStorage.getItem('auth_token');
console.log('Token 1:', token1);

// 3. Aguardar 25 minutos (ou simular)
// setTimeout(() => {

// 4. Verificar token renovado
const token2 = sessionStorage.getItem('auth_token');
console.log('Token 2:', token2);

// 5. Comparar
console.log('Token renovado?', token1 !== token2);
// true = Token foi renovado (segurança!)
```

### Resultado esperado ✅
```
✅ Primeira vez: Token ABC123...
⏱️ Aguarda 25 minutos
✅ Renovação: Token DEF456...
   (Diferente! Token novo foi gerado)
✅ Permanece autenticado
✅ Não precisa fazer login novamente
```

---

## 📊 TABELA DE VALIDAÇÃO

| Teste | Esperado | Status | Notas |
|-------|----------|--------|-------|
| Acesso Direto | ❌ Bloqueado | ? | Essencial |
| Rate Limiting | 🔒 Bloqueio após 5 | ? | Crítico |
| Expiração | ⏰ 30 min logout | ? | Importante |
| Sync Tabs | 🔄 Sincroniza | ? | Bom ter |
| XSS Protection | ❌ Scripts bloqueados | ? | Crítico |
| CSRF | ❌ Requisições bloqueadas | ? | Crítico |
| Validação | ✅ A cada 60s | ? | Importante |
| Auto Refresh | 🔄 a cada 25 min | ? | Bom ter |

---

## 🐛 Debugging

### Ativar logs detalhados
```javascript
// No console:
AUTH.STATE.debug = true;

// Agora todos os eventos são logados:
AUTH.securityLog('DEBUG_ENABLED');
AUTH.login('test', 'test');
AUTH.logout();
```

### Ver todos os logs armazenados
```javascript
// Ver logs de segurança
console.table(AUTH.STATE.securityLogs);

// Ver eventos em tempo real
AUTH.STATE.securityLogs.forEach(log => {
  console.log(`[${log.timestamp}] ${log.event}:`, log.data);
});
```

### Resetar estado completamente
```javascript
// Limpar tudo
sessionStorage.clear();
localStorage.clear();
AUTH.STATE = {};
location.href = '/login';
```

---

## ✅ Checklist Final

Após completar todos os testes, marque:

- [ ] Acesso direto bloqueado ✅
- [ ] Rate limiting funciona ✅
- [ ] Token expira em 30 min ✅
- [ ] Sincronização entre abas ✅
- [ ] XSS bloqueado ✅
- [ ] CSRF protegido ✅
- [ ] Validação contínua ✅
- [ ] Auto refresh funciona ✅
- [ ] Logs registram eventos ✅
- [ ] Logout limpa dados ✅
- [ ] UI mostra mensagens claras ✅
- [ ] Sem erros no console ✅

---

## 🚀 Próximos Passos

Após passar em TODOS os testes:

1. ✅ Fazer commit e push
2. ✅ Deploy automático Netlify
3. ✅ Testar em produção
4. 🔜 Implementar backend (JWT assinado)
5. 🔜 Adicionar 2FA
6. 🔜 Logs centralizados

---

**Versão**: 1.0  
**Última atualização**: 2024  
**Status**: Pronto para testes ✅
