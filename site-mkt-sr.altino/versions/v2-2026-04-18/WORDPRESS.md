# 🔗 Integração com WordPress

Guia completo de como integrar o Showzap com um site WordPress existente.

---

## 📊 3 Opções de Integração

### Opção 1️⃣: IFRAME (Mais Simples) ⭐ RECOMENDADO
**Prós:**
- Sem modificar WordPress
- Deploy independente
- Fácil de atualizar

**Contras:**
- Isolado (não acessa dados WP)
- Scroll dentro do iframe

**Implementação:**
```php
<!-- Template WordPress (page.php ou custom) -->

<h1><?php the_title(); ?></h1>
<div class="showzap-container">
  <iframe 
    id="showzap-frame"
    src="http://seu-docker-url:80/"
    style="width:100%; 
           height:800px; 
           border:none;
           border-radius:8px;">
  </iframe>
</div>

<style>
  .showzap-container {
    max-width: 1200px;
    margin: 20px auto;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    border-radius: 8px;
  }
</style>

<!-- Usar em página: crie page.php ou custom template -->
```

---

### Opção 2️⃣: PLUGIN WORDPRESS (Integrado)
**Prós:**
- Aparece como plugin WP
- Usa shortcode
- Acesso a dados WP

**Contras:**
- Requer desenvolvimento
- Mais complexo

**Estrutura:**
```
wp-content/plugins/showzap/
├── index.php                      ← Cabeçalho do plugin
├── showzap-loader.php             ← Carrega a app
├── showzap-app/
│   ├── index.html
│   ├── login.html
│   ├── proprietario.html
│   ├── auth.js
│   ├── style.css
│   └── ...
└── README.md
```

**index.php do plugin:**
```php
<?php
/**
 * Plugin Name: Showzap - Sr. Altino Bar Manager
 * Description: Plataforma completa de gerenciamento de bar
 * Version: 1.0
 * Author: Showzap
 * License: Proprietary
 */

// Segurança
if (!defined('ABSPATH')) {
    exit;
}

define('SHOWZAP_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('SHOWZAP_PLUGIN_URL', plugin_dir_url(__FILE__));

// Enqueue assets
add_action('wp_enqueue_scripts', function() {
    wp_enqueue_style(
        'showzap-style',
        SHOWZAP_PLUGIN_URL . 'showzap-app/style.css',
        array(),
        '1.0'
    );
    wp_enqueue_script(
        'showzap-auth',
        SHOWZAP_PLUGIN_URL . 'showzap-app/auth.js',
        array(),
        '1.0',
        true
    );
});

// Registrar shortcode
add_shortcode('showzap', function($atts) {
    ob_start();
    ?>
    <div id="showzap-app" class="showzap-container">
        <!-- App será carregada aqui -->
    </div>
    <script>
        // Carregar app dinamicamente
        document.getElementById('showzap-app').innerHTML = 
            '<iframe src="<?php echo SHOWZAP_PLUGIN_URL; ?>showzap-app/index.html" ' +
            'style="width:100%; height:100vh; border:none;"></iframe>';
    </script>
    <?php
    return ob_get_clean();
});

// Registrar admin menu
add_action('admin_menu', function() {
    add_menu_page(
        'Showzap',
        'Showzap',
        'manage_options',
        'showzap',
        function() {
            echo '<h1>Showzap - Configurações</h1>';
            echo '<p>Plataforma ativa em: <code>[showzap]</code></p>';
        },
        'dashicons-analytics'
    );
});
```

**Usar no WordPress:**
```
Criar uma página e adicionar:
[showzap]
```

---

### Opção 3️⃣: DOCKER COMPOSE (Completo)
**Prós:**
- 2 containers orquestrados
- Total controle
- Escalável

**Contras:**
- Mais complexo de setup
- Requer conhecimento Docker

**docker-compose.yml:**
```yaml
version: '3.9'

services:
  # WordPress
  wordpress:
    image: wordpress:6.4-php8.2
    ports:
      - "8080:80"
    environment:
      WORDPRESS_DB_HOST: mysql
      WORDPRESS_DB_NAME: wordpress
      WORDPRESS_DB_USER: wp_user
      WORDPRESS_DB_PASSWORD: ${DB_PASSWORD:-wp123456}
      WORDPRESS_DEBUG: false
    volumes:
      - wordpress_data:/var/www/html
      # Copiar plugin Showzap
      - ./showzap-plugin:/var/www/html/wp-content/plugins/showzap
    depends_on:
      - mysql
    networks:
      - showzap-network
    restart: unless-stopped

  # App Showzap (Docker)
  showzap-app:
    build: ./showzap-docker
    ports:
      - "3000:80"
    environment:
      - TZ=America/Sao_Paulo
    networks:
      - showzap-network
    restart: unless-stopped

  # Banco MySQL
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_ROOT_PASSWORD:-root123}
      MYSQL_DATABASE: wordpress
      MYSQL_USER: wp_user
      MYSQL_PASSWORD: ${DB_PASSWORD:-wp123456}
      TZ: America/Sao_Paulo
    volumes:
      - mysql_data:/var/lib/mysql
    networks:
      - showzap-network
    restart: unless-stopped

  # Nginx Reverse Proxy (Opcional)
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - wordpress
      - showzap-app
    networks:
      - showzap-network
    restart: unless-stopped

volumes:
  wordpress_data:
  mysql_data:

networks:
  showzap-network:
    driver: bridge
```

---

## 🔄 Fluxo de Dados: WordPress ↔ Showzap

### Cenário: Capturas de Lead
```
1. Cliente preenche form em Showzap
2. Dados salvos em localStorage
3. Webhook enviado para n8n
4. n8n envia para Twilio (WhatsApp)
5. (Opcional) Sincroniza com WordPress meta

Flow:
Showzap → n8n → Twilio → WhatsApp
    ↓
Sheety DB (persistência)
```

### Cenário: Campanhas
```
1. Proprietário cria campanha em Showzap
2. Clica "Enviar para Leads"
3. Webhook ativa workflow n8n
4. n8n busca leads do Sheety
5. Envia WhatsApp via Twilio
6. (Opcional) Log salvo em WordPress

Flow:
Showzap → n8n → Twilio → Múltiplos Clientes
    ↓
Relatório em WordPress (opcional)
```

---

## 🎯 Qual Opção Escolher?

### Escolha OPÇÃO 1 (iframe) se:
- ✅ Quer deploy rápido
- ✅ Não quer modificar WordPress
- ✅ Prefere simplificar
- ✅ Não precisa integração de dados

### Escolha OPÇÃO 2 (plugin) se:
- ✅ Quer pareça parte do WordPress
- ✅ Pode desenvolver PHP
- ✅ Precisa acesso a dados WP
- ✅ Quer controle maior

### Escolha OPÇÃO 3 (Docker Compose) se:
- ✅ Quer setup profissional
- ✅ Sabe Docker bem
- ✅ Precisa escalabilidade
- ✅ Quer múltiplos serviços

**RECOMENDAÇÃO**: Começar com **Opção 1** (iframe) e evoluir se necessário.

---

## 🚀 Setup Rápido (Opção 1)

### 1. Ter WordPress rodando
```bash
# Se usando Docker WordPress
docker-compose up -d wordpress
```

### 2. Ter Showzap rodando (Docker ou não)
```bash
# Docker
docker-compose up -d showzap-app

# Ou acesso remoto
https://seu-docker-vps.com:80
```

### 3. Adicionar iframe em página WordPress

**Via WordPress Editor:**
```
1. Ir para Pages > Novo
2. Adicionar HTML Custom:

<div style="width:100%; height:800px;">
  <iframe 
    src="http://seu-docker-url/" 
    style="width:100%; height:100%; border:none;">
  </iframe>
</div>

3. Publicar
```

**Via Template (functions.php):**
```php
// Adicionar ao tema functions.php
add_shortcode('showzap_app', function() {
    return '<iframe 
      src="http://seu-docker-url/" 
      style="width:100%; height:800px; border:none;"></iframe>';
});
```

**Usar:**
```
[showzap_app]
```

---

## 🔐 Segurança em Produção

### HTTPS Obrigatório
```nginx
server {
    listen 443 ssl http2;
    server_name seu-wordpress.com;
    
    ssl_certificate /etc/letsencrypt/live/seu-wordpress.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/seu-wordpress.com/privkey.pem;
}
```

### Validar CORS
```php
// Se usando plugin
add_filter('allowed_http_origins', function($origins) {
    $origins[] = 'https://seu-docker-url';
    $origins[] = 'https://seu-wordpress.com';
    return $origins;
});
```

### Rate Limiting (nginx)
```nginx
limit_req_zone $binary_remote_addr zone=showzap:10m rate=10r/s;

location /showzap {
    limit_req zone=showzap burst=20;
    proxy_pass http://showzap-app:80;
}
```

---

## 📚 Próximas Etapas

1. **Hoje**: Escolher opção (recomendado: Opção 1)
2. **Amanhã**: Setup do iframe ou plugin
3. **Próx. semana**: Testar fluxo completo
4. **Depois**: Integrar n8n + Twilio

---

## 📞 Suporte

Dúvidas?
1. Verificar DOCKER.md
2. Ver código de exemplo neste arquivo
3. Testar com curl primeiro
4. Verificar logs do navegador (F12)

---

**Última atualização**: 18/04/2026
