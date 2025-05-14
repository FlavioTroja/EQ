#!/bin/bash

# Funzione per il logging con timestamp
log() {
  echo "[$(date +"%Y-%m-%d %H:%M:%S")] $1"
}

# Array dei nomi delle cartelle dei microservizi
services=("registry" "gateway" "eurekaserver" "calendar" "document")

# Build microservizi Java
for service in "${services[@]}"; do
  if [ -d "$service" ]; then
    log "La cartella '$service' è presente. Avvio build..."
    cd "$service" || { log "Impossibile entrare nella cartella $service."; exit 1; }

    if [ -f "gradlew" ]; then
      sh gradlew bootJar
      if [ $? -eq 0 ]; then
        log "Build completata con successo per '$service'."
      else
        log "Errore durante la build per '$service'."
      fi
    else
      log "Il file 'gradlew' non è stato trovato in '$service'."
    fi
    cd ..
  else
    log "La cartella '$service' non è presente. Skip build."
  fi
done

# Build frontend Angular
if [ -d "frontend" ]; then
  log "La cartella 'frontend' è presente. Avvio build Angular..."
  cd frontend || { log "Impossibile entrare nella cartella frontend."; exit 1; }

  if [ -f "package.json" ]; then
    npm install --silent
    ng build --configuration production
    if [ $? -eq 0 ]; then
      log "Build Angular completata con successo."
    else
      log "Errore durante la build Angular."
    fi
  else
    log "File package.json non trovato nella cartella frontend."
  fi
  cd ..
else
  log "La cartella 'frontend' non è presente. Skip build."
fi

# Build Docker
log "Costruisco i container Docker..."
docker compose build
if [ $? -eq 0 ]; then
  log "Build dei container Docker completata con successo."
else
  log "Errore durante la build dei container Docker."
fi

# Avvio Docker
log "Avvio dei container Docker in modalità detached..."
docker compose up -d
if [ $? -eq 0 ]; then
  log "I container Docker sono stati avviati correttamente."
else
  log "Errore nell'avvio dei container Docker."
fi
