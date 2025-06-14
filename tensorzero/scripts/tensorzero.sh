#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

function show_help() {
    echo "TensorZero Management Script"
    echo ""
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  start         Start TensorZero Gateway and UI"
    echo "  stop          Stop TensorZero services"
    echo "  restart       Restart TensorZero services"
    echo "  logs          Show logs from TensorZero Gateway"
    echo "  logs-ui       Show logs from TensorZero UI"
    echo "  status        Show status of TensorZero services"
    echo "  health        Check health of TensorZero Gateway"
    echo "  setup         Initial setup and environment check"
    echo "  help          Show this help message"
}

function check_env() {
    echo "🔍 Verificando variáveis de ambiente..."
    
    local required_vars=(
        "TENSORZERO_CLICKHOUSE_URL"
        "OPENAI_API_KEY"
        "ANTHROPIC_API_KEY"
    )
    
    local missing_vars=()
    
    for var in "${required_vars[@]}"; do
        if [[ -z "${!var}" ]]; then
            missing_vars+=("$var")
        fi
    done
    
    if [[ ${#missing_vars[@]} -gt 0 ]]; then
        echo "❌ Variáveis de ambiente faltando:"
        for var in "${missing_vars[@]}"; do
            echo "   - $var"
        done
        echo ""
        echo "📝 Por favor, configure essas variáveis no seu arquivo .env"
        echo "   Você pode usar o arquivo env.example como referência."
        exit 1
    fi
    
    echo "✅ Todas as variáveis de ambiente estão configuradas"
}

function check_files() {
    echo "🔍 Verificando arquivos necessários..."
    
    local required_files=(
        "tensorzero.toml"
        "docker-compose.yml"
    )
    
    local missing_files=()
    
    for file in "${required_files[@]}"; do
        if [[ ! -f "$PROJECT_DIR/$file" ]]; then
            missing_files+=("$file")
        fi
    done
    
    if [[ ${#missing_files[@]} -gt 0 ]]; then
        echo "❌ Arquivos faltando:"
        for file in "${missing_files[@]}"; do
            echo "   - $file"
        done
        exit 1
    fi
    
    echo "✅ Todos os arquivos necessários estão presentes"
}

function start_services() {
    echo "🚀 Iniciando TensorZero Gateway..."
    cd "$PROJECT_DIR"
    docker-compose up -d tensorzero-gateway tensorzero-ui
    echo "✅ TensorZero iniciado com sucesso!"
    echo ""
    echo "🌐 Gateway disponível em: http://localhost:3001"
    echo "🎨 UI disponível em: http://localhost:4000"
}

function stop_services() {
    echo "🛑 Parando TensorZero..."
    cd "$PROJECT_DIR"
    docker-compose down
    echo "✅ TensorZero parado"
}

function restart_services() {
    echo "🔄 Reiniciando TensorZero..."
    stop_services
    sleep 2
    start_services
}

function show_logs() {
    cd "$PROJECT_DIR"
    docker-compose logs -f tensorzero-gateway
}

function show_logs_ui() {
    cd "$PROJECT_DIR"
    docker-compose logs -f tensorzero-ui
}

function show_status() {
    echo "📊 Status dos serviços TensorZero:"
    cd "$PROJECT_DIR"
    docker-compose ps
}

function check_health() {
    echo "🏥 Verificando saúde do TensorZero Gateway..."
    
    local health_url="http://localhost:3001/health"
    local max_attempts=5
    local attempt=1
    
    while [[ $attempt -le $max_attempts ]]; do
        echo "Tentativa $attempt/$max_attempts..."
        
        if curl -s -f "$health_url" > /dev/null 2>&1; then
            echo "✅ TensorZero Gateway está saudável!"
            return 0
        fi
        
        if [[ $attempt -lt $max_attempts ]]; then
            echo "⏳ Aguardando 5 segundos antes da próxima tentativa..."
            sleep 5
        fi
        
        ((attempt++))
    done
    
    echo "❌ TensorZero Gateway não está respondendo"
    return 1
}

function setup() {
    echo "🔧 Configuração inicial do TensorZero..."
    check_files
    check_env
    
    echo "🐳 Verificando Docker..."
    if ! command -v docker &> /dev/null; then
        echo "❌ Docker não encontrado. Por favor, instale o Docker primeiro."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        echo "❌ Docker Compose não encontrado. Por favor, instale o Docker Compose primeiro."
        exit 1
    fi
    
    echo "✅ Setup concluído com sucesso!"
    echo ""
    echo "🚀 Para iniciar o TensorZero, execute:"
    echo "   $0 start"
}

cd "$PROJECT_DIR"

case "${1:-help}" in
    start)
        check_env
        start_services
        ;;
    stop)
        stop_services
        ;;
    restart)
        check_env
        restart_services
        ;;
    logs)
        show_logs
        ;;
    logs-ui)
        show_logs_ui
        ;;
    status)
        show_status
        ;;
    health)
        check_health
        ;;
    setup)
        setup
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        echo "❌ Comando desconhecido: $1"
        echo ""
        show_help
        exit 1
        ;;
esac 