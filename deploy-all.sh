#!/bin/bash

SERVICES=("eurekaserver" "gateway" "calendar" "registry" "document")
PORTS=(8761 8765 8081 8080 8082)

echo "➡️  Inizializzazione ambiente Copilot"
copilot app init eq || true
copilot env init --name prod --region eu-central-1 --default-config || true
copilot env deploy --name prod

for i in "${!SERVICES[@]}"; do
  NAME=${SERVICES[$i]}
  PORT=${PORTS[$i]}
  echo "🚀 Deploy microservizio: $NAME (porta $PORT)"
  
  # Inizializzazione servizio
  copilot svc init --name $NAME \
    --svc-type "Load Balanced Web Service" \
    --dockerfile $NAME/Dockerfile \
    --port $PORT || true

  # Deploy
  copilot deploy --name $NAME --env prod
done

echo "✅ Tutti i servizi sono stati deployati con successo su AWS 🎉"
