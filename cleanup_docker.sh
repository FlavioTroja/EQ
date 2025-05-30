#!/bin/bash

# Mappa container → immagine
declare -A service_map=(
  ["document"]="overzoom/eq_document:latest"
  ["calendar"]="overzoom/eq_calendar:latest"
  ["eurekaserver"]="overzoom/eq_eurekaserver:latest"
  ["registry"]="overzoom/eq_registry:latest"
  ["frontend"]="overzoom/eq_frontend:latest"
  ["gateway"]="overzoom/eq_gateway:latest"
)

# Se sono stati passati argomenti, usali come target. Altrimenti, usa tutti i servizi.
if [ "$#" -gt 0 ]; then
  targets=("$@")
else
  targets=("${!service_map[@]}")
fi

echo "Stopping containers..."
for service in "${targets[@]}"; do
  docker stop "$service" 2>/dev/null && echo "Stopped $service"
done

echo "Removing containers..."
for service in "${targets[@]}"; do
  docker rm "$service" 2>/dev/null && echo "Removed $service"
done

echo "Removing images..."
for service in "${targets[@]}"; do
  image="${service_map[$service]}"
  if [ -n "$image" ]; then
    docker rmi "$image" 2>/dev/null && echo "Removed image $image"
  else
    echo "Image not found for $service"
  fi
done

echo "Rebuilding services with Docker Compose..."
docker compose up -d "${targets[@]}"
echo "Done."
