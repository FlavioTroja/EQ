#!/bin/bash

# ======= CARICA VARIABILI =======
if [ -f .env ]; then
  export $(cat .env | xargs)
else
  echo "❌ File .env non trovato. Crea un file .env con AWS_ACCOUNT_ID e AWS_REGION."
  exit 1
fi

# ====== LISTA MICROSERVIZI ======
REPOSITORIES=("eurekaserver" "gateway" "registry" "calendar" "document")

# ======= LOGIN ECR =======
echo "🔐 Login su ECR..."
aws ecr get-login-password --region "$AWS_REGION" | docker login --username AWS --password-stdin "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com"
# ======= BUILD E PUSH =======
for SERVICE in "${REPOSITORIES[@]}"; do
  FULL_NAME="eq/$SERVICE"
  echo "🚀 Build e push di $FULL_NAME..."

  # Build del JAR (entrando nella directory del servizio)
  echo "🔧 Compilazione JAR in $SERVICE..."
  (
    cd "$SERVICE" || exit 1
    ./gradlew bootJar
  )
  if [ $? -ne 0 ]; then
    echo "❌ Errore nella build del JAR per $SERVICE"
    exit 1
  fi

  # CREA IL REPO SE NON ESISTE
  aws ecr describe-repositories --repository-names "$FULL_NAME" --region "$AWS_REGION" > /dev/null 2>&1
  if [ $? -ne 0 ]; then
    echo "📁 Repository $FULL_NAME non trovato, lo creo..."
    aws ecr create-repository --repository-name "$FULL_NAME" --region "$AWS_REGION" > /dev/null
  else
    echo "📁 Repository $FULL_NAME già esistente"
  fi

  DOCKERFILE_PATH="$SERVICE/Dockerfile"
  IMAGE_URI="$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$FULL_NAME:latest"

  docker build -t $FULL_NAME:latest -f $DOCKERFILE_PATH $SERVICE
  docker tag $FULL_NAME:latest $IMAGE_URI
  docker push $IMAGE_URI

  echo "✅ $FULL_NAME pushato su $IMAGE_URI"
  echo "-----------------------------"
done

echo "🎉 Tutte le immagini sono state deployate con successo!"
