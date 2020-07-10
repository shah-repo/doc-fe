#!/bin/bash
set -e

export ENLIL_COMPOSE_PORT_RANGE_START=${ENLIL_COMPOSE_PORT_RANGE_START:-5600}
export ENLIL_COMPOSE_EXPOSE_DIRECTOR_PORT="$((ENLIL_COMPOSE_PORT_RANGE_START+6))"

if [[ -z "${ENLIL_COMPOSE_PORT_RANGE_START}" ]]; then
  echo "ENLIL_COMPOSE_PORT_RANGE_START not set, exiting"
  exit
fi

export ENLIL_COMPOSE_EXPOSE_BE_PORT="$((ENLIL_COMPOSE_PORT_RANGE_START+1))"
export ENLIL_COMPOSE_EXPOSE_FE_PORT="$((ENLIL_COMPOSE_PORT_RANGE_START+2))"

export CYPRESS_BE_URL="http://localhost:$ENLIL_COMPOSE_EXPOSE_BE_PORT"
export CYPRESS_FE_URL="http://localhost:$ENLIL_COMPOSE_EXPOSE_FE_PORT"
export CYPRESS_KONFIG_ENV="development"

yarn install --frozen-lockfile


if [ "$(uname)" == "Darwin" ]; then
    # Mac OS X platform   
    ENLIL_CYPRESS_CACHE_PATH="~/Library/Caches/Cypress/*/Cypress.app/Contents/Resources/app/packages/server/config/app.yml"   
elif [ "$(expr substr $(uname -s) 1 5)" == "Linux" ]; then
    # GNU/Linux platform
    ENLIL_CYPRESS_CACHE_PATH="~/.cache/Cypress/*/Cypress/resources/app/packages/server/config/app.yml"
elif [ "$(expr substr $(uname -s) 1 10)" == "MINGW32_NT" ]; then
    # 32 bits Windows NT platform
elif [ "$(expr substr $(uname -s) 1 10)" == "MINGW64_NT" ]; then
    # 64 bits Windows NT platform
fi

if [[ -z "${ENLIL_CYPRESS_CACHE_PATH}" ]]; then
  echo "ENLIL_CYPRESS_CACHE_PATH not defined, exiting"
  exit
fi

sed -i -e "s|api_url:.*$|api_url: \"http://localhost:$ENLIL_COMPOSE_EXPOSE_DIRECTOR_PORT\"|g" $ENLIL_CYPRESS_CACHE_PATH

yarn cypress open
