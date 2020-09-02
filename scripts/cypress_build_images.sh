#!/bin/bash
set -e
export FE_GIT_COMMIT_HASH=$(git rev-parse HEAD |  cut -c1-8)

./scripts/cypress_generate_server_info.sh

if [[ -z "${ENLIL_COMPOSE_PORT_RANGE_START}" ]]; then
  echo "ENLIL_COMPOSE_PORT_RANGE_START not set, exiting"
  exit
fi

export ENLIL_COMPOSE_EXPOSE_BE_PORT="$((ENLIL_COMPOSE_PORT_RANGE_START+1))"
export ENLIL_COMPOSE_EXPOSE_FE_PORT="$((ENLIL_COMPOSE_PORT_RANGE_START+2))"
export ENLIL_COMPOSE_EXPOSE_BE_WORKER_PORT="$((ENLIL_COMPOSE_PORT_RANGE_START+9))"

export REACT_APP_API_ENDPOINT="http://localhost:$ENLIL_COMPOSE_EXPOSE_BE_PORT/api"
export REACT_APP_WORKER_API_ENDPOINT="http://localhost:$ENLIL_COMPOSE_EXPOSE_BE_WORKER_PORT/api"
export REACT_APP_REFRESH_TOKEN_VALIDITY_DAYS="30"
export REACT_APP_AWS_COGNITO_CLIENT_ID="5ts2oghmmo5bv2hik76b9rt8of"
export REACT_APP_FRONTEND_URL="http://localhost:$ENLIL_COMPOSE_EXPOSE_FE_PORT"
export REACT_APP_SIGNUP_DOMAIN_URL="https://shifamed-doc-develop.auth.us-west-2.amazoncognito.com"
export BROWSER="none"
export PORT="4212"
export REACT_APP_THEME="DEV_THEME"
export NODE_ENV="production"
export REACT_APP_DATADOG_APPLICATION_ID="fake"
export REACT_APP_DATADOG_CLIENT_TOKEN="fake"

docker build \
  -f docker/cypress_web.Dockerfile \
  -t enlil/cypress_web:${FE_GIT_COMMIT_HASH}_${ENLIL_COMPOSE_PORT_RANGE_START} \
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
  --build-arg REACT_APP_DATADOG_APPLICATION_ID \
  --build-arg REACT_APP_DATADOG_CLIENT_TOKEN \
   .
