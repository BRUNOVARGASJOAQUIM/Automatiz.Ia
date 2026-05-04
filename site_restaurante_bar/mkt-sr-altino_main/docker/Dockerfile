# Multi-stage build para otimizar tamanho da imagem
FROM nginx:alpine

# Metadados
LABEL maintainer="showzap@example.com"
LABEL version="1.0"
LABEL description="Showzap - Sr. Altino Bar Management Platform"

# Definir timezone
ENV TZ=America/Sao_Paulo

# Instalar ferramentas úteis
RUN apk add --no-cache \
    curl \
    wget \
    ca-certificates

# Copiar arquivos da app para dentro do container
COPY index.html /usr/share/nginx/html/
COPY login.html /usr/share/nginx/html/
COPY proprietario.html /usr/share/nginx/html/
COPY qr.html /usr/share/nginx/html/
COPY auth.js /usr/share/nginx/html/
COPY style.css /usr/share/nginx/html/
COPY README-INSTALACAO.txt /usr/share/nginx/html/

# Copiar configuração customizada do nginx
COPY nginx.conf /etc/nginx/nginx.conf
COPY nginx-site.conf /etc/nginx/conf.d/default.conf

# Criar diretórios para logs
RUN mkdir -p /var/log/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /usr/share/nginx/html

# Definir permissões
RUN chmod -R 755 /usr/share/nginx/html

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/index.html || exit 1

# Expor porta
EXPOSE 80

# Comando padrão (nginx já roda como CMD padrão no alpine)
CMD ["nginx", "-g", "daemon off;"]
