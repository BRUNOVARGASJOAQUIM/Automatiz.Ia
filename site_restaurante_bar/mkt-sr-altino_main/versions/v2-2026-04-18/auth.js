// Sistema de autenticação simples para a Área do Proprietário
// Nota: Esta é uma solução básica para demonstração. Em produção, use autenticação segura no servidor.

const AUTH = {
  // Usuários de demo (em produção, isso seria validado no servidor)
  users: {
    'proprietario': 'senha123',
    'admin': 'admin456'
  },

  login: function(username, password) {
    if (this.users[username] && this.users[username] === password) {
      localStorage.setItem('proprietario_logado', 'true');
      localStorage.setItem('proprietario_user', username);
      return true;
    }
    return false;
  },

  logout: function() {
    localStorage.removeItem('proprietario_logado');
    localStorage.removeItem('proprietario_user');
    window.location.href = 'login.html';
  },

  isLoggedIn: function() {
    return localStorage.getItem('proprietario_logado') === 'true';
  },

  getUser: function() {
    return localStorage.getItem('proprietario_user') || 'Usuário';
  },

  protectPage: function() {
    if (!this.isLoggedIn()) {
      window.location.href = 'login.html';
    }
  }
};

// Protege a página se o usuário não estiver logado
if (window.location.pathname.includes('proprietario.html')) {
  AUTH.protectPage();
}
