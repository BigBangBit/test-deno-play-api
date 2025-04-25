#!/bin/bash

# Configuración
BACKUP_DIR="./backups"
MONGO_TOOLS=(mongodump mongorestore)

# Verificar herramientas de MongoDB
check_tools() {
    for tool in "${MONGO_TOOLS[@]}"; do
        if ! command -v $tool &> /dev/null; then
            echo "Error: $tool no está instalado o no está en el PATH"
            exit 1
        fi
    done
}

# Crear directorio de backups si no existe
mkdir -p $BACKUP_DIR

# Menú principal
echo "1) Backup"
echo "2) Restore"
read -p "Selecciona operación [1-2]: " OPERACION

# Validar entrada operación
if ! [[ $OPERACION =~ ^[1-2]$ ]]; then
    echo "Opción inválida"
    exit 1
fi

# Selección de base de datos
echo "1) cunix_api"
echo "2) rocketchat"
read -p "Selecciona base de datos [1-2]: " DB_OPCION

# Validar entrada DB y asignar nombre
case $DB_OPCION in
    1) DB_NAME="cunix_api";;
    2) DB_NAME="rocketchat";;
    *)
        echo "Opción inválida"
        exit 1
        ;;
esac

# Proceso de Backup
if [ $OPERACION -eq 1 ]; then
    check_tools
    FECHA=$(date +%Y-%m-%d)
    BACKUP_FILE="$BACKUP_DIR/${DB_NAME}-${FECHA}.gz"
    
    echo "Iniciando backup de $DB_NAME..."
    mongodump --db $DB_NAME --archive=$BACKUP_FILE --gzip
    
    if [ $? -eq 0 ]; then
        echo "Backup completado: $BACKUP_FILE"
    else
        echo "Error durante el backup"
        exit 1
    fi

# Proceso de Restore
else
    check_tools
    # Buscar último backup
    LATEST_BACKUP=$(ls -t $BACKUP_DIR/${DB_NAME}-*.gz 2> /dev/null | head -n 1)
    
    if [ -z "$LATEST_BACKUP" ]; then
        echo "No hay backups disponibles para $DB_NAME"
        exit 1
    fi
    
    echo "Último backup encontrado: $LATEST_BACKUP"
    read -p "¿Restaurar este backup? [y/N]: " CONFIRMAR
    
    if [[ ! $CONFIRMAR =~ ^[Yy]$ ]]; then
        echo "Restore cancelado"
        exit 0
    fi
    
    echo "Restaurando $DB_NAME..."
    mongorestore --db $DB_NAME --archive=$LATEST_BACKUP --gzip --drop
    
    if [ $? -eq 0 ]; then
        echo "Restore completado correctamente"
    else
        echo "Error durante el restore"
        exit 1
    fi
fi
