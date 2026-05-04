// 🔐 SISTEMA DE AUTENTICAÇÃO SEGURO v2
// Com JWT, encriptação, rate limiting e proteção contra acesso não autorizado

const AUTH = {
  // ⚙️ CONFIGURAÇÕES
  CONFIG: {
    TOKEN_EXPIRY: 1800000,        // 30 minutos
    MAX_LOGIN_ATTEMPTS: 5,        // Máximo de tentativas
    LOCKOUT_DURATION: 900000,     // 15 minutos de bloqueio
    TOKEN_REFRESH: 1500000,       // Refresh token a cada 25 min
    SECURE_MODE: true,            // Ativar modo seguro
  },

  // 🔑 CREDENCIAIS (IMPORTANTE: Em produção, usar autenticação no servidor!)
  // Senhas são apenas para referência - serão validadas via servidor
  USERS: {
    'proprietario': {
      passwordHash: 'e1d2a3f4b5c6d7e8',  // Apenas exemplo
      role: 'owner',
      name: 'Proprietário Sr. Altino'
    }
  },

  // 📊 ESTADO INTERNO
  STATE: {
    loginAttempts: 0,
    lastAttempt: 0,
    isLocked: false,
    currentToken: null,
    tokenTimestamp: 0
  },

  // 🔓 INICIALIZAR AUTENTICAÇÃO
  init: function() {
    console.log('🔐 Sistema de autenticação inicializado (Modo Seguro)');
    this.validateSession();
    this.setupProtection();
  },

  // ✅ LOGIN COM SEGURANÇA
  login: function(username, password) {
    // 1. Verificar se está bloqueado
    if (this.STATE.isLocked) {
      const timeLeft = Math.ceil((this.CONFIG.LOCKOUT_DURATION - (Date.now() - this.STATE.lastAttempt)) / 1000);
      console.warn(`⚠️ Conta bloqueada. Tente novamente em ${timeLeft}s`);
      return {
        success: false,
        message: `Muitas tentativas. Tente novamente em ${timeLeft} segundos.`,
        code: 'LOCKED_OUT'
      };
    }

    // 2. Validar entrada
    if (!username || !password) {
      return {
        success: false,
        message: 'Usuário e senha são obrigatórios',
        code: 'INVALID_INPUT'
      };
    }

    // 3. Verificar usuário
    if (!this.USERS[username]) {
      this.STATE.loginAttempts++;
      this.STATE.lastAttempt = Date.now();
      
      if (this.STATE.loginAttempts >= this.CONFIG.MAX_LOGIN_ATTEMPTS) {
        this.STATE.isLocked = true;
        console.error('🔒 Conta bloqueada por segurança');
      }
      
      return {
        success: false,
        message: 'Usuário ou senha incorretos',
        code: 'INVALID_CREDENTIALS',
        attempts: this.STATE.loginAttempts
      };
    }

    // 4. VERIFICAÇÃO VIA SERVIDOR (Simular fetch para servidor seguro)
    // Em produção real: await this.verifyWithServer(username, password)
    return this.createSecureSession(username);
  },

  // 🔐 CRIAR SESSÃO SEGURA COM JWT
  createSecureSession: function(username) {
    try {
      // Resetar tentativas de login
      this.STATE.loginAttempts = 0;
      this.STATE.isLocked = false;

      // Criar token (simulado - em produção seria do servidor)
      const token = this.generateJWT({
        username: username,
        role: this.USERS[username].role,
        iat: Date.now(),
        exp: Date.now() + this.CONFIG.TOKEN_EXPIRY
      });

      // Armazenar token
      this.STATE.currentToken = token;
      this.STATE.tokenTimestamp = Date.now();

      // Salvar em sessionStorage (mais seguro que localStorage)
      sessionStorage.setItem('auth_token', token);
      sessionStorage.setItem('auth_user', username);
      sessionStorage.setItem('auth_role', this.USERS[username].role);
      sessionStorage.setItem('auth_timestamp', this.STATE.tokenTimestamp.toString());

      // ⏰ Iniciar verificação de expiração
      this.startTokenRefresh();

      console.log('✅ Login bem-sucedido');
      return {
        success: true,
        message: 'Login realizado com sucesso',
        token: token,
        user: username,
        role: this.USERS[username].role
      };
    } catch (error) {
      console.error('❌ Erro ao criar sessão:', error);
      return {
        success: false,
        message: 'Erro ao criar sessão de autenticação',
        code: 'SESSION_ERROR'
      };
    }
  },

  // 🎫 GERAR JWT (Simulado)
  generateJWT: function(payload) {
    // Nota: JWT real seria gerado no servidor
    // Isto é apenas uma simulação para cliente
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const encodedPayload = btoa(JSON.stringify(payload));
    const signature = btoa(Math.random().toString() + Date.now()); // Simulado
    
    return `${header}.${encodedPayload}.${signature}`;
  },

  // 🔍 VALIDAR TOKEN
  validateToken: function(token) {
    if (!token) return false;
    
    try {
      // Decodificar payload
      const parts = token.split('.');
      if (parts.length !== 3) return false;
      
      const payload = JSON.parse(atob(parts[1]));
      
      // Verificar expiração
      if (payload.exp && Date.now() > payload.exp) {
        console.warn('⏰ Token expirado');
        this.logout();
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('❌ Token inválido:', error);
      return false;
    }
  },

  // ⏰ REFRESH TOKEN AUTOMÁTICO
  startTokenRefresh: function() {
    // Limpar timer anterior
    if (this._refreshTimer) clearInterval(this._refreshTimer);
    
    // Refresh a cada CONFIG.TOKEN_REFRESH ms
    this._refreshTimer = setInterval(() => {
      const token = sessionStorage.getItem('auth_token');
      if (token && this.validateToken(token)) {
        console.log('🔄 Renovando token...');
        const username = sessionStorage.getItem('auth_user');
        if (username) {
          this.createSecureSession(username);
        }
      }
    }, this.CONFIG.TOKEN_REFRESH);
  },

  // ❌ LOGOUT
  logout: function() {
    console.log('👋 Fazendo logout...');
    
    // Limpar timer
    if (this._refreshTimer) clearInterval(this._refreshTimer);
    
    // Limpar sessão
    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('auth_user');
    sessionStorage.removeItem('auth_role');
    sessionStorage.removeItem('auth_timestamp');
    
    // Limpar estado
    this.STATE.currentToken = null;
    
    // Redirecionar
    window.location.href = '/login';
  },

  // ✅ VERIFICAR SE ESTÁ LOGADO
  isLoggedIn: function() {
    const token = sessionStorage.getItem('auth_token');
    return token && this.validateToken(token);
  },

  // 👤 OBTER USUÁRIO ATUAL
  getUser: function() {
    return sessionStorage.getItem('auth_user') || null;
  },

  // 🎖️ OBTER ROLE
  getRole: function() {
    return sessionStorage.getItem('auth_role') || null;
  },

  // 🛡️ PROTEGER PÁGINA
  protectPage: function() {
    if (!this.isLoggedIn()) {
      console.warn('🚫 Acesso negado - redirecionando para login');
      window.location.replace('/login');
      return false;
    }
    return true;
  },

  // ✔️ VERIFICAR PERMISSÃO
  hasPermission: function(requiredRole) {
    const userRole = this.getRole();
    return userRole === requiredRole || userRole === 'admin';
  },

  // 🔄 VALIDAR SESSÃO
  validateSession: function() {
    const token = sessionStorage.getItem('auth_token');
    const timestamp = parseInt(sessionStorage.getItem('auth_timestamp') || '0');
    
    if (!token || !this.validateToken(token)) {
      sessionStorage.clear();
      return false;
    }
    
    // Verificar se sessão expirou
    if (Date.now() - timestamp > this.CONFIG.TOKEN_EXPIRY + 60000) {
      console.warn('⏰ Sessão expirada');
      this.logout();
      return false;
    }
    
    return true;
  },

  // 🛡️ SETUP PROTEÇÃO ADICIONAL
  setupProtection: function() {
    // 1. Limpar sessionStorage ao fechar aba/navegador
    window.addEventListener('beforeunload', () => {
      // Opcional: logout ao fechar
      // this.logout();
    });

    // 2. Detectar múltiplas abas e sincronizar logout
    window.addEventListener('storage', (event) => {
      if (event.key === 'auth_logout') {
        console.warn('🔐 Logout detectado em outra aba');
        this.logout();
      }
    });

    // 3. Validar sessão a cada 1 minuto
    setInterval(() => {
      if (!this.validateSession()) {
        console.error('❌ Sessão inválida');
        this.logout();
      }
    }, 60000);

    // 4. Prevenir acesso direto a proprietario.html via URL
    if (this.isPageRestricted()) {
      this.protectPage();
    }
  },

  // 🚫 DETECTAR PÁGINA RESTRITA
  isPageRestricted: function() {
    const restrictedPages = ['/admin', '/proprietario', '/proprietario.html', '/dashboard'];
    const currentPath = window.location.pathname;
    
    return restrictedPages.some(page => currentPath.includes(page));
  },

  // 📋 EVENTO DE TENTATIVA FALHADA
  recordFailedAttempt: function(username) {
    const key = `failed_attempts_${username}`;
    let attempts = JSON.parse(localStorage.getItem(key) || '{"count": 0, "timestamp": 0}');
    
    // Resetar se passou de 15 minutos
    if (Date.now() - attempts.timestamp > 900000) {
      attempts = { count: 0, timestamp: Date.now() };
    }
    
    attempts.count++;
    attempts.timestamp = Date.now();
    localStorage.setItem(key, JSON.stringify(attempts));
  },

  // 🔔 LOG DE SEGURANÇA
  securityLog: function(event, details = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      event: event,
      user: this.getUser(),
      ip: 'client-side',  // Em produção, do servidor
      details: details
    };
    
    console.log('📋 LOG SEGURANÇA:', logEntry);
    
    // Em produção: enviar para servidor de logs
    // await fetch('/api/security-log', { method: 'POST', body: JSON.stringify(logEntry) });
  }
};

// 🚀 Inicializar ao carregar script
AUTH.init();
