# Script de controle Docker para Showzap - Windows PowerShell

# Função para imprimir com cor
function Print-Info {
    Write-Host "ℹ️  $args" -ForegroundColor Blue
}

function Print-Success {
    Write-Host "✅ $args" -ForegroundColor Green
}

function Print-Error {
    Write-Host "❌ $args" -ForegroundColor Red
}

function Print-Warning {
    Write-Host "⚠️  $args" -ForegroundColor Yellow
}

# Menu
function Show-Menu {
    Clear-Host
    Write-Host ""
    Write-Host "╔════════════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "║          🐳 SHOWZAP - Docker Control              ║" -ForegroundColor Cyan
    Write-Host "╠════════════════════════════════════════════════════╣" -ForegroundColor Cyan
    Write-Host "║ 1) Build - Construir imagem Docker                ║" -ForegroundColor White
    Write-Host "║ 2) Up - Iniciar containers                        ║" -ForegroundColor White
    Write-Host "║ 3) Down - Parar containers                        ║" -ForegroundColor White
    Write-Host "║ 4) Restart - Reiniciar containers                ║" -ForegroundColor White
    Write-Host "║ 5) Logs - Ver logs em tempo real                  ║" -ForegroundColor White
    Write-Host "║ 6) Status - Ver status dos containers             ║" -ForegroundColor White
    Write-Host "║ 7) Clean - Remover containers e volumes           ║" -ForegroundColor White
    Write-Host "║ 8) Test - Testar saúde da app                     ║" -ForegroundColor White
    Write-Host "║ 9) Shell - Acessar shell do container             ║" -ForegroundColor White
    Write-Host "║ 10) All - Build + Up (completo)                   ║" -ForegroundColor White
    Write-Host "║ 0) Exit - Sair                                    ║" -ForegroundColor White
    Write-Host "╚════════════════════════════════════════════════════╝" -ForegroundColor Cyan
    Write-Host ""
}

# Funções de ação
function Build-Image {
    Print-Info "Construindo imagem Docker..."
    docker-compose build
    Print-Success "Build concluído!"
}

function Up-Containers {
    Print-Info "Iniciando containers..."
    docker-compose up -d
    Print-Success "Containers iniciados!"
    Print-Info "App disponível em: http://localhost"
}

function Down-Containers {
    Print-Warning "Parando containers..."
    docker-compose down
    Print-Success "Containers parados!"
}

function Restart-Containers {
    Print-Warning "Reiniciando containers..."
    docker-compose restart
    Print-Success "Containers reiniciados!"
}

function Show-Logs {
    Print-Info "Mostrando logs (Ctrl+C para sair)..."
    docker-compose logs -f showzap-app
}

function Show-Status {
    Print-Info "Status dos containers:"
    docker-compose ps
}

function Clean-All {
    Print-Warning "LIMPEZA: Removendo containers, volumes e dados..."
    $confirm = Read-Host "Tem certeza? (s/n)"
    if ($confirm -eq "s" -or $confirm -eq "S") {
        docker-compose down -v
        Print-Success "Limpeza concluída!"
    } else {
        Print-Info "Operação cancelada."
    }
}

function Test-Health {
    Print-Info "Testando saúde da app..."
    Start-Sleep -Seconds 2
    
    try {
        $response = Invoke-WebRequest -Uri "http://localhost/health" -ErrorAction SilentlyContinue
        if ($response.Content -match "OK") {
            Print-Success "App está saudável! ✨"
            Print-Info "Acessar em: http://localhost"
        } else {
            Print-Error "App não está respondendo corretamente"
        }
    } catch {
        Print-Error "App não está respondendo"
        Print-Info "Verifique os logs: .\docker.ps1 logs"
    }
}

function Access-Shell {
    Print-Info "Acessando shell do container..."
    docker exec -it showzap-app sh
}

function Full-Setup {
    Print-Info "Executando setup completo (build + up)..."
    Build-Image
    Write-Host ""
    Up-Containers
    Write-Host ""
    Start-Sleep -Seconds 3
    Test-Health
}

# Menu principal
function Main {
    if ($args.Count -eq 0) {
        # Modo interativo
        while ($true) {
            Show-Menu
            $choice = Read-Host "Escolha uma opção (0-10)"
            
            switch ($choice) {
                "1" { Build-Image }
                "2" { Up-Containers }
                "3" { Down-Containers }
                "4" { Restart-Containers }
                "5" { Show-Logs }
                "6" { Show-Status }
                "7" { Clean-All }
                "8" { Test-Health }
                "9" { Access-Shell }
                "10" { Full-Setup }
                "0" {
                    Print-Info "Saindo..."
                    exit 0
                }
                default {
                    Print-Error "Opção inválida!"
                }
            }
            
            Write-Host ""
            Read-Host "Pressione ENTER para continuar"
        }
    } else {
        # Modo comando direto
        switch ($args[0]) {
            "build" { Build-Image }
            "up" { Up-Containers }
            "down" { Down-Containers }
            "restart" { Restart-Containers }
            "logs" { Show-Logs }
            "status" { Show-Status }
            "clean" { Clean-All }
            "test" { Test-Health }
            "shell" { Access-Shell }
            "all" { Full-Setup }
            default {
                Print-Error "Comando desconhecido: $($args[0])"
                Write-Host "Comandos disponíveis: build, up, down, restart, logs, status, clean, test, shell, all"
                exit 1
            }
        }
    }
}

Main @args
