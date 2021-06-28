#!/bin/bash
set -e

yarn install --frozen-lockfile

./scripts/cypress_generate_server_info.sh

export ENLIL_COMPOSE_PORT_RANGE_START=${ENLIL_COMPOSE_PORT_RANGE_START:-5600}

export ENLIL_COMPOSE_EXPOSE_BE_PORT="80"
export ENLIL_COMPOSE_EXPOSE_FE_PORT="$((ENLIL_COMPOSE_PORT_RANGE_START+2))"
export ENLIL_COMPOSE_EXPOSE_BE_WORKER_PORT="4219"

export REACT_APP_API_ENDPOINT="http://backend:$ENLIL_COMPOSE_EXPOSE_BE_PORT/api"
export REACT_APP_WORKER_API_ENDPOINT="http://worker:$ENLIL_COMPOSE_EXPOSE_BE_WORKER_PORT/api"
export REACT_APP_REFRESH_TOKEN_VALIDITY_DAYS="30"
export REACT_APP_AWS_COGNITO_CLIENT_ID="5ts2oghmmo5bv2hik76b9rt8of"
export REACT_APP_FRONTEND_URL="http://localhost:$ENLIL_COMPOSE_EXPOSE_FE_PORT"
export REACT_APP_SIGNUP_DOMAIN_URL="https://shifamed-doc-develop.auth.us-west-2.amazoncognito.com"
export BROWSER="none"
export PORT=$ENLIL_COMPOSE_EXPOSE_FE_PORT
export REACT_APP_THEME="DEV_THEME"
export NODE_ENV="production"
export REACT_APP_DATADOG_APPLICATION_ID="fake"
export REACT_APP_DATADOG_CLIENT_TOKEN="fake"

yarn start
