# 🐳 Guia Docker - Showzap Sr. Altino

## 📋 Índice
1. [Pré-requisitos](#pré-requisitos)
2. [Instalação](#instalação)
3. [Execução](#execução)
4. [Deployment](#deployment)
5. [Integração WordPress](#integração-wordpress)
6. [Troubleshooting](#troubleshooting)

---

## 🔧 Pré-requisitos

### Windows (WSL2 ou Docker Desktop)
```powershell
# Verificar instalação
docker --version
docker-compose --version

# Instalar do site
https://www.docker.com/products/docker-desktop
```

### Linux/Mac
```bash
# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

---

## 🚀 Instalação

### 1. Clonar/Baixar o projeto
```bash
cd ~/seu-projeto/showzap-sr-altino-theme
```

### 2. Criar arquivo .env (a partir de .env.example)
```bash
cp .env.example .env

# Editar conforme necessário (portas, credenciais, etc)
# Linux/Mac:
nano .env

# Windows:
notepad .env
```

### 3. Build da imagem Docker
```bash
# Build básico
docker-compose build

# Build sem cache (força rebuild)
docker-compose build --no-cache

# Build específico de um serviço
docker-compose build showzap-app
```

---

## ▶️ Execução

### Rodar Container (Produção)
```bash
# Iniciar containers em background
docker-compose up -d

# Ver logs em tempo real
docker-compose logs -f showzap-app

# Ver logs dos últimos 100 linhas
docker-compose logs --tail=100 showzap-app
```

### Rodar Container (Desenvolvimento)
```bash
# Com output no terminal (ver erros em tempo real)
docker-compose up

# Parar: Ctrl+C

# Com logs coloridos e detalhados
docker-compose up --verbose
```

### Gerenciar Containers
```bash
# Ver status
docker-compose ps

# Parar containers
docker-compose down

# Parar e remover volumes
docker-compose down -v

# Reiniciar
docker-compose restart

# Recriar
docker-compose up --force-recreate

# Executar comando dentro do container
docker exec -it showzap-app sh

# Ver recursos usados
docker stats showzap-app
```

---

## 🌐 Acessar a App

### URL Padrão
```
http://localhost/
http://localhost/index.html
http://localhost/login.html
http://localhost/proprietario.html
```

### Se mudar APP_PORT
```
Editar .env:
APP_PORT=8080

Acessar:
http://localhost:8080/
```

### Health Check
```bash
# Verificar se container está saudável
curl http://localhost/health

# Resposta esperada: OK
```

---

## 🚀 Deployment

### Deploy em VPS/Servidor Linux

#### 1. Transferir arquivos
```bash
scp -r showzap-sr-altino-theme/ usuario@seu-vps:/home/usuario/
```

#### 2. No VPS: Build e run
```bash
cd /home/usuario/showzap-sr-altino-theme

# Build
docker-compose build

# Run
docker-compose up -d

# Ver logs
docker-compose logs -f
```

#### 3. Configurar Nginx como Reverse Proxy (Recomendado)
```nginx
# /etc/nginx/sites-available/showzap
server {
    listen 443 ssl;
    server_name seu-dominio.com;

    ssl_certificate /caminho/para/cert.pem;
    ssl_certificate_key /caminho/para/key.pem;

    location / {
        proxy_pass http://localhost:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### 4. SSL com Certbot (Let's Encrypt)
```bash
sudo certbot certonly --standalone -d seu-dominio.com

# Auto-renew
sudo certbot renew --quiet
```

---

## 🔗 Integração WordPress

### Opção 1: Iframe (Simpler)
```php
<!-- No template WordPress -->
<iframe 
  src="http://seu-docker-url:80/" 
  style="width:100%; height:800px; border:none;">
</iframe>
```

### Opção 2: Como Plugin WordPress
```
wp-content/plugins/showzap/
├── index.php (cabeçalho do plugin)
├── showzap/
│   ├── index.html
│   ├── login.html
│   ├── proprietario.html
│   └── ...
└── enqueue.php (registrar assets)
```

**index.php do plugin:**
```php
<?php
/**
 * Plugin Name: Showzap
 * Description: Sr. Altino Bar Management Platform
 * Version: 1.0
 * Author: Showzap
 */

// Carregar assets
add_action('wp_enqueue_scripts', function() {
    wp_enqueue_style('showzap-style', plugin_dir_url(__FILE__) . 'showzap/style.css');
    wp_enqueue_script('showzap-auth', plugin_dir_url(__FILE__) . 'showzap/auth.js', array(), '1.0', true);
});

// Registrar shortcode
add_shortcode('showzap', function() {
    return '<iframe src="' . plugin_dir_url(__FILE__) . 'showzap/index.html" style="width:100%; height:100vh; border:none;"></iframe>';
});
```

**Usar no WordPress:**
```
[showzap]
```

### Opção 3: Dois Containers (Completo)
```yaml
# docker-compose.yml
version: '3.9'
services:
  wordpress:
    image: wordpress:latest
    ports:
      - "8080:80"
    environment:
      WORDPRESS_DB_HOST: mysql
      WORDPRESS_DB_NAME: wordpress
      WORDPRESS_DB_USER: wp_user
      WORDPRESS_DB_PASSWORD: senha123
    volumes:
      - wordpress_data:/var/www/html
    
  showzap-app:
    build: .
    ports:
      - "3000:80"
    networks:
      - default

  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: root123
      MYSQL_DATABASE: wordpress
      MYSQL_USER: wp_user
      MYSQL_PASSWORD: senha123
    volumes:
      - mysql_data:/var/lib/mysql

volumes:
  wordpress_data:
  mysql_data:
```

---

## 🆘 Troubleshooting

### Container não inicia
```bash
# Ver erro
docker-compose logs showzap-app

# Checker sintaxe do Dockerfile
docker build . --no-cache

# Remover container antigo e reconstruir
docker-compose rm -f showzap-app
docker-compose up -d
```

### Porta já está em uso
```bash
# Finder qual processo usa porta 80
lsof -i :80              # Mac/Linux
netstat -ano | findstr :80  # Windows

# Alterar no .env
APP_PORT=8080
docker-compose up -d
```

### Nginx retorna 502 Bad Gateway
```bash
# Ver se container está rodando
docker-compose ps

# Check logs
docker-compose logs showzap-app

# Reiniciar
docker-compose restart showzap-app
```

### Permissão negada ao acessar arquivos
```bash
# Fix permissões no container
docker exec -it showzap-app sh
chmod -R 755 /usr/share/nginx/html
exit
```

### Arquivo não encontrado (404)
```bash
# Verificar se arquivo está no container
docker exec -it showzap-app ls -la /usr/share/nginx/html/

# Se não estiver, copiar:
docker cp index.html showzap-app:/usr/share/nginx/html/
```

---

## 📊 Monitoramento

### Ver Recursos do Container
```bash
docker stats showzap-app

# Saída esperada:
# CONTAINER ID   NAME          CPU %   MEM USAGE
# abc123...      showzap-app   0.5%    45MB
```

### Ver Logs Estruturados
```bash
# Últimas 50 linhas
docker-compose logs --tail=50

# Segue logs (like tail -f)
docker-compose logs -f

# Logs de timestamp específico
docker-compose logs --since 2026-04-18T10:00:00
```

### Acessar Shell do Container
```bash
# Entrar no container
docker exec -it showzap-app sh

# Executar comandos
curl -I http://localhost/
ps aux
df -h

# Sair
exit
```

---

## 🔒 Segurança em Produção

### Checklist
- [ ] HTTPS/SSL ativado (Certbot)
- [ ] Reverse proxy Nginx em frente
- [ ] Firewall configurado
- [ ] Backups automáticos
- [ ] Monitoramento ativo
- [ ] Rate limiting ativado
- [ ] CORS restrito

### Exemplo Nginx Seguro
```nginx
server {
    listen 443 ssl http2;
    server_name seu-dominio.com;

    # SSL
    ssl_certificate /etc/letsencrypt/live/seu-dominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/seu-dominio.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Security
    add_header Strict-Transport-Security "max-age=31536000" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=general:10m rate=10r/s;
    limit_req zone=general burst=20;

    # Proxy
    location / {
        proxy_pass http://localhost:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

server {
    listen 80;
    server_name seu-dominio.com;
    return 301 https://$server_name$request_uri;
}
```

---

## 📚 Recursos Úteis

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Let's Encrypt](https://letsencrypt.org/)

---

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique os logs: `docker-compose logs -f`
2. Teste a saúde: `curl http://localhost/health`
3. Reconstrua se necessário: `docker-compose down && docker-compose up --build -d`

---

**Última atualização**: 18/04/2026
