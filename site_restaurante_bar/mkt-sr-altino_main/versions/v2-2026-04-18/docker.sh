#!/bin/bash
# Script de controle Docker para Showzap - Linux/Mac

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para imprimir com cor
print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Menu
show_menu() {
    echo ""
    echo "╔════════════════════════════════════════════════════╗"
    echo "║          🐳 SHOWZAP - Docker Control              ║"
    echo "╠════════════════════════════════════════════════════╣"
    echo "║ 1) Build - Construir imagem Docker                ║"
    echo "║ 2) Up - Iniciar containers                        ║"
    echo "║ 3) Down - Parar containers                        ║"
    echo "║ 4) Restart - Reiniciar containers                ║"
    echo "║ 5) Logs - Ver logs em tempo real                  ║"
    echo "║ 6) Status - Ver status dos containers             ║"
    echo "║ 7) Clean - Remover containers e volumes           ║"
    echo "║ 8) Test - Testar saúde da app                     ║"
    echo "║ 9) Shell - Acessar shell do container             ║"
    echo "║ 10) All - Build + Up (completo)                   ║"
    echo "║ 0) Exit - Sair                                    ║"
    echo "╚════════════════════════════════════════════════════╝"
    echo ""
}

# Funções de ação
build_image() {
    print_info "Construindo imagem Docker..."
    docker-compose build
    print_success "Build concluído!"
}

up_containers() {
    print_info "Iniciando containers..."
    docker-compose up -d
    print_success "Containers iniciados!"
    print_info "App disponível em: http://localhost"
}

down_containers() {
    print_warning "Parando containers..."
    docker-compose down
    print_success "Containers parados!"
}

restart_containers() {
    print_warning "Reiniciando containers..."
    docker-compose restart
    print_success "Containers reiniciados!"
}

show_logs() {
    print_info "Mostrando logs (Ctrl+C para sair)..."
    docker-compose logs -f showzap-app
}

show_status() {
    print_info "Status dos containers:"
    docker-compose ps
}

clean_all() {
    print_warning "LIMPEZA: Removendo containers, volumes e dados..."
    read -p "Tem certeza? (s/n): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Ss]$ ]]; then
        docker-compose down -v
        print_success "Limpeza concluída!"
    else
        print_info "Operação cancelada."
    fi
}

test_health() {
    print_info "Testando saúde da app..."
    sleep 2
    
    if curl -s http://localhost/health | grep -q "OK"; then
        print_success "App está saudável! ✨"
        print_info "Acessar em: http://localhost"
    else
        print_error "App não está respondendo"
        print_info "Verifique os logs: ./docker.sh logs"
    fi
}

access_shell() {
    print_info "Acessando shell do container..."
    docker exec -it showzap-app sh
}

full_setup() {
    print_info "Executando setup completo (build + up)..."
    build_image
    echo ""
    up_containers
    echo ""
    sleep 3
    test_health
}

# Menu principal
main() {
    if [ $# -eq 0 ]; then
        # Modo interativo
        while true; do
            show_menu
            read -p "Escolha uma opção (0-10): " choice
            
            case $choice in
                1) build_image ;;
                2) up_containers ;;
                3) down_containers ;;
                4) restart_containers ;;
                5) show_logs ;;
                6) show_status ;;
                7) clean_all ;;
                8) test_health ;;
                9) access_shell ;;
                10) full_setup ;;
                0) 
                    print_info "Saindo..."
                    exit 0
                    ;;
                *)
                    print_error "Opção inválida!"
                    ;;
            esac
        done
    else
        # Modo comando direto
        case $1 in
            build) build_image ;;
            up) up_containers ;;
            down) down_containers ;;
            restart) restart_containers ;;
            logs) show_logs ;;
            status) show_status ;;
            clean) clean_all ;;
            test) test_health ;;
            shell) access_shell ;;
            all) full_setup ;;
            *)
                print_error "Comando desconhecido: $1"
                echo "Comandos disponíveis: build, up, down, restart, logs, status, clean, test, shell, all"
                exit 1
                ;;
        esac
    fi
}

main "$@"
