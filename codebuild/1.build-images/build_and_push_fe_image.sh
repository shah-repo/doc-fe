#!/bin/bash
set -e

./scripts/cypress_generate_server_info.sh

set -a
  export REACT_APP_REFRESH_TOKEN_VALIDITY_DAYS="30"
  export REACT_APP_AWS_COGNITO_CLIENT_ID="1ere7pgti58jked7s21god194v"
  export REACT_APP_FRONTEND_URL="http://frontend:$ENLIL_COMPOSE_EXPOSE_FE_PORT"
  export REACT_APP_SIGNUP_DOMAIN_URL="https://shifamed-doc-dev.auth.us-west-2.amazoncognito.com"
  export BROWSER="none"
  export PORT=${ENLIL_COMPOSE_EXPOSE_FE_PORT}
  export REACT_APP_THEME="DEV_THEME"
  export NODE_ENV="production"
  export REACT_APP_DATADOG_ENABLED="false"
  export REACT_APP_DATADOG_SAMPLE_RATE="0"
  export REACT_APP_DATADOG_APPLICATION_ID="fake"
  export REACT_APP_DATADOG_CLIENT_TOKEN="fake"
  export REACT_APP_CONSOLE_TOAST="false"
  export REACT_APP_PREVENT_DOC_TYPE_MANAGEMENT_EDIT="false"
set +a

IMAGE=fe_${FE_GIT_COMMIT_HASH}
DOCKER_IMAGE=817083319299.dkr.ecr.us-west-2.amazonaws.com/$ECR_REPO:$IMAGE

CACHE_IMAGE=817083319299.dkr.ecr.us-west-2.amazonaws.com/$ECR_REPO:fe_latest

docker pull $CACHE_IMAGE || true

docker build \
  --cache-from $CACHE_IMAGE \
  -f ./docker/cypress_web.Dockerfile \
  -t enlil_cypress_web:${FE_GIT_COMMIT_HASH} \
  --build-arg BUILDKIT_INLINE_CACHE=1 \
  --build-arg FE_GIT_COMMIT_HASH \
  --build-arg REACT_APP_API_ENDPOINT \
  --build-arg REACT_APP_WORKER_API_ENDPOINT \
  --build-arg REACT_APP_REFRESH_TOKEN_VALIDITY_DAYS \
  --build-arg REACT_APP_AWS_COGNITO_CLIENT_ID \
  --build-arg REACT_APP_FRONTEND_URL \
  --build-arg REACT_APP_SIGNUP_DOMAIN_URL \
  --build-arg BROWSER \
  --build-arg PORT \
  --build-arg REACT_APP_THEME \
  --build-arg NODE_ENV \
  --build-arg REACT_APP_DATADOG_ENABLED \
  --build-arg REACT_APP_DATADOG_APPLICATION_ID \
  --build-arg REACT_APP_DATADOG_CLIENT_TOKEN \
  --build-arg REACT_APP_DATADOG_SAMPLE_RATE \
  --build-arg REACT_APP_CONSOLE_TOAST \
  --build-arg REACT_APP_PREVENT_DOC_TYPE_MANAGEMENT_EDIT \
   .

docker rmi $CACHE_IMAGE || true
docker tag enlil_cypress_web:${FE_GIT_COMMIT_HASH} $CACHE_IMAGE
docker push $CACHE_IMAGE

docker tag enlil_cypress_web:${FE_GIT_COMMIT_HASH} $DOCKER_IMAGE
docker push $DOCKER_IMAGE
