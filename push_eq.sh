#!/usr/bin/env bash
set -euo pipefail

# Configurazione
DOCKERHUB_USER="${DOCKERHUB_USER:-overzoom}"
TAG="${TAG:-latest}"
SERVICES=("registry" "gateway" "eurekaserver" "calendar" "document")
FRONTEND_DIR="frontend"
REFERENCE_BRANCH="origin/main"  # oppure HEAD~1 per confrontare con l'ultimo commit

# Funzione per log con timestamp
log() {
  echo "[$(date +"%Y-%m-%d %H:%M:%S")] $1"
}

# Docker login se disponibile il token
if [[ -n "${DOCKERHUB_TOKEN:-}" ]]; then
  log "🔑 Logging in to Docker Hub..."
  echo "$DOCKERHUB_TOKEN" | docker login --username "$DOCKERHUB_USER" --password-stdin
else
  log "🔔 DOCKERHUB_TOKEN non impostato, presumo sei già loggato."
fi

# Build e push per i microservizi Java
for service in "${SERVICES[@]}"; do
  if [ -d "$service" ]; then
    log "🔍 Controllo modifiche in $service..."

    if git diff --quiet "$REFERENCE_BRANCH" -- "$service"; then
      log "✅ Nessuna modifica in $service. Skip."
      continue
    fi

    log "➡️  Elaborazione microservizio modificato: $service"
    pushd "$service" > /dev/null || { log "❌ Errore nell'accesso a $service"; exit 1; }

    if [ -f "./gradlew" ]; then
      log "🛠️  Build del JAR..."
      ./gradlew clean bootJar --no-daemon
    else
      log "❌ gradlew non trovato in $service. Skip."
      popd > /dev/null
      continue
    fi

    JAR_FILE=$(find build/libs -name "*.jar" | head -n 1)
    if [[ ! -f "$JAR_FILE" ]]; then
      log "❌ JAR non trovato per $service"
      popd > /dev/null
      continue
    fi
    log "✅ Trovato JAR: $JAR_FILE"

    IMAGE_NAME="$DOCKERHUB_USER/eq_${service}:${TAG}"
    log "🐳 Build dell’immagine Docker: $IMAGE_NAME"
    docker build -t "$IMAGE_NAME" .

    log "🚀 Push su Docker Hub: $IMAGE_NAME"
    docker push "$IMAGE_NAME"

    popd > /dev/null
  else
    log "⚠️  Cartella $service non trovata. Skip."
  fi
done

# Build e push per il frontend Angular
if [ -d "$FRONTEND_DIR" ]; then
  log "🔍 Controllo modifiche in $FRONTEND_DIR..."

  if git diff --quiet "$REFERENCE_BRANCH" -- "$FRONTEND_DIR"; then
    log "✅ Nessuna modifica in $FRONTEND_DIR. Skip."
  else
    log "➡️  Elaborazione frontend Angular modificato"

    pushd "$FRONTEND_DIR" > /dev/null || { log "❌ Errore nell'accesso a $FRONTEND_DIR"; exit 1; }

    if [ -f "package.json" ]; then
      log "📦 Installazione dipendenze Node.js (npm install)..."
      npm install

      log "⚙️  Build Angular (npm run build -- --configuration production)..."
      npm run build -- --configuration production
    else
      log "❌ package.json non trovato. Skip frontend."
      popd > /dev/null
      exit 1
    fi

    if [[ ! -d "dist" ]]; then
      log "❌ Cartella 'dist' mancante dopo la build. Interruzione."
      popd > /dev/null
      exit 1
    fi

    IMAGE_NAME="$DOCKERHUB_USER/eq_frontend:${TAG}"
    log "🐳 Build dell’immagine Docker: $IMAGE_NAME"
    docker build -t "$IMAGE_NAME" .

    log "🚀 Push su Docker Hub: $IMAGE_NAME"
    docker push "$IMAGE_NAME"

    popd > /dev/null
  fi
else
  log "⚠️  Cartella frontend non trovata. Skip."
fi

log "🎉 Solo i servizi modificati sono stati buildati e pushati!"
