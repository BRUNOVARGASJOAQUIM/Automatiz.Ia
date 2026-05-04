# 🔧 GUIA: IMPLEMENTAR AUTENTICAÇÃO NO BACKEND

## 🎯 OBJETIVO
Mover autenticação do frontend para backend seguro (Servidor Node.js/Python/Java)

---

## 📊 ARQUITETURA

```
Frontend (Netlify)          Backend (Servidor)
════════════════════════════════════════════════
  Login Form    ────────→   POST /api/auth/login
     ↓                            ↓
  auth-v2.js   ←─────────   JWT Token Assinado
     ↓                            ↓
  Bearer Token  ────────→   GET /api/proprietario
     ↓                        (Valida token)
  Dashboard                      ↓
                          Retorna dados seguros
```

---

## 🔑 BACKEND COM NODE.JS (RECOMENDADO)

### Instalação
```bash
npm init -y
npm install express bcryptjs jsonwebtoken dotenv cors
npm install --save-dev nodemon
```

### .env (Configurações)
```env
JWT_SECRET=sua_chave_super_secreta_aqui_minimo_32_caracteres
JWT_EXPIRY=30m
BCRYPT_ROUNDS=10
PORT=3000
FRONTEND_URL=https://automatiz-showzap-sr-altino.netlify.app
```

### server.js (Exemplo Básico)
```javascript
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 🔒 MIDDLEWARES
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ['POST', 'GET', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 📊 USUÁRIOS (Em produção: banco de dados)
const USERS = {
  'proprietario': {
    passwordHash: '$2a$10$...',  // bcrypt hash de 'senha123'
    role: 'owner',
    name: 'Proprietário Sr. Altino'
  }
};

// 🔑 GERAR HASH DE SENHA
async function hashPassword(password) {
  return await bcrypt.hash(password, parseInt(process.env.BCRYPT_ROUNDS));
}

// ✅ VERIFICAR HASH
async function verifyPassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

// 🎫 GERAR JWT
function generateToken(user) {
  return jwt.sign(
    { 
      username: user.username,
      role: user.role,
      name: user.name
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRY }
  );
}

// 🛡️ MIDDLEWARE: VALIDAR TOKEN
function validateToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido ou expirado' });
  }
}

// 🔓 ROTA: LOGIN
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Validar entrada
    if (!username || !password) {
      return res.status(400).json({ 
        error: 'Usuário e senha são obrigatórios' 
      });
    }
    
    // Buscar usuário
    const user = USERS[username];
    if (!user) {
      return res.status(401).json({ 
        error: 'Usuário ou senha incorretos',
        code: 'INVALID_CREDENTIALS'
      });
    }
    
    // Verificar senha
    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ 
        error: 'Usuário ou senha incorretos',
        code: 'INVALID_CREDENTIALS'
      });
    }
    
    // Gerar token
    const token = generateToken({
      username,
      role: user.role,
      name: user.name
    });
    
    // Log de segurança
    console.log(`✅ Login bem-sucedido: ${username}`);
    
    res.json({
      success: true,
      token: token,
      user: {
        username: username,
        role: user.role,
        name: user.name
      }
    });
    
  } catch (error) {
    console.error('❌ Erro no login:', error);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
});

// 📊 ROTA: OBTER DASHBOARD (Protegida)
app.get('/api/proprietario/dashboard', validateToken, (req, res) => {
  // Apenas se token válido
  res.json({
    message: `Bem-vindo, ${req.user.name}!`,
    user: req.user,
    data: {
      sales: 15400,
      customers: 324,
      growth: 28.5
    }
  });
});

// 👤 ROTA: OBTER PERFIL (Protegida)
app.get('/api/proprietario/profile', validateToken, (req, res) => {
  res.json({
    user: req.user,
    role: req.user.role,
    lastLogin: new Date()
  });
});

// ❌ ROTA: LOGOUT
app.post('/api/auth/logout', validateToken, (req, res) => {
  // Token é removido no frontend
  console.log(`👋 Logout: ${req.user.username}`);
  res.json({ message: 'Logout bem-sucedido' });
});

// 🚀 INICIAR SERVIDOR
app.listen(process.env.PORT, () => {
  console.log(`🚀 Servidor rodando em :${process.env.PORT}`);
});
```

---

## 🔐 FRONTEND: USAR BACKEND

### Atualizar auth-v2.js
```javascript
// Adicionar método para autenticar com servidor
AUTH.loginWithServer = async function(username, password) {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',  // Enviar cookies se necessário
      body: JSON.stringify({ username, password })
    });
    
    if (!response.ok) {
      throw new Error('Login falhou');
    }
    
    const data = await response.json();
    
    // Armazenar token
    sessionStorage.setItem('auth_token', data.token);
    sessionStorage.setItem('auth_user', data.user.username);
    
    return { success: true, token: data.token };
    
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Adicionar método para requisições protegidas
AUTH.fetchProtected = async function(url, options = {}) {
  const token = sessionStorage.getItem('auth_token');
  
  if (!token) {
    this.logout();
    return null;
  }
  
  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${token}`
  };
  
  try {
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include'
    });
    
    if (response.status === 401) {
      // Token expirado
      this.logout();
      return null;
    }
    
    return response;
    
  } catch (error) {
    console.error('Erro na requisição:', error);
    return null;
  }
};
```

### Atualizar login.html
```javascript
// Usar backend ao invés de frontend
const result = await AUTH.loginWithServer(username, password);

if (result.success) {
  window.location.href = 'proprietario.html';
} else {
  // Mostrar erro
}
```

---

## 🐍 BACKEND COM PYTHON (FLASK)

```python
from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import timedelta
import os

app = Flask(__name__)

# 🔒 CONFIGURAÇÕES
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(minutes=30)

jwt = JWTManager(app)
CORS(app, origins=[os.getenv('FRONTEND_URL')], supports_credentials=True)

# 📊 USUÁRIOS
USERS = {
    'proprietario': {
        'password_hash': generate_password_hash('senha123'),
        'role': 'owner',
        'name': 'Proprietário Sr. Altino'
    }
}

# 🔓 ROTA: LOGIN
@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return {'error': 'Usuário e senha obrigatórios'}, 400
    
    user = USERS.get(username)
    if not user or not check_password_hash(user['password_hash'], password):
        return {'error': 'Usuário ou senha incorretos'}, 401
    
    # Gerar token
    access_token = create_access_token(identity=username)
    
    return {
        'success': True,
        'token': access_token,
        'user': {
            'username': username,
            'role': user['role'],
            'name': user['name']
        }
    }, 200

# 📊 ROTA: DASHBOARD (Protegida)
@app.route('/api/proprietario/dashboard', methods=['GET'])
@jwt_required()
def dashboard():
    username = get_jwt_identity()
    user = USERS.get(username)
    
    return {
        'message': f"Bem-vindo, {user['name']}!",
        'data': {
            'sales': 15400,
            'customers': 324,
            'growth': 28.5
        }
    }, 200

if __name__ == '__main__':
    app.run(debug=False, port=3000)
```

---

## 🎯 DEPLOY DO BACKEND

### Opção 1: Heroku (Gratuito com limitações)
```bash
heroku login
heroku create seu-app-nome
git push heroku main
```

### Opção 2: Railway
```bash
# Conectar GitHub, Railway faz deploy automático
```

### Opção 3: Seu próprio servidor
```bash
ssh user@seu-servidor.com
# Instalar Node.js
# npm install && npm start
```

---

## ✅ CHECKLIST DE SEGURANÇA

- [ ] JWT com chave secreta forte (32+ caracteres)
- [ ] Senhas criptografadas com bcrypt/argon2
- [ ] CORS configurado (apenas seu domínio)
- [ ] HTTPS em produção
- [ ] Rate limiting implementado
- [ ] Logs de segurança centralizados
- [ ] Validação de entrada (sanitizar)
- [ ] CSRF token se usar cookies
- [ ] Senha não exposta em logs
- [ ] Tokens armazenados em sessionStorage
- [ ] Token refresh automático
- [ ] Logout apaga token

---

## 🧪 TESTAR API

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"proprietario","password":"senha123"}'

# Resposta:
{
  "success": true,
  "token": "eyJhbGc...",
  "user": {...}
}

# Usar token
curl -X GET http://localhost:3000/api/proprietario/dashboard \
  -H "Authorization: Bearer eyJhbGc..."

# Resposta:
{
  "message": "Bem-vindo, Proprietário Sr. Altino!",
  "data": {...}
}
```

---

## 🚀 PRÓXIMOS PASSOS

1. ✅ Usar backend (Node/Python/Java)
2. ✅ Implementar JWT assinado pelo servidor
3. ✅ Criptografar senhas com bcrypt
4. ✅ Configurar CORS
5. ✅ Implementar rate limiting
6. ✅ Adicionar logs centralizados
7. ✅ Usar HTTPS em produção
8. ✅ Considerar 2FA (Google Authenticator)

---

**Segurança: 8/10 → 10/10 com backend! 🔐**
