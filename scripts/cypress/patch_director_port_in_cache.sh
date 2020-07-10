#!/bin/bash
set -e


if [[ -z "${ENLIL_COMPOSE_EXPOSE_DIRECTOR_PORT}" ]]; then
  echo "ENLIL_COMPOSE_EXPOSE_DIRECTOR_PORT not set, exiting"
  exit
fi

if [ "$(uname)" == "Darwin" ]; then
    # Mac OS X platform   
    ENLIL_CYPRESS_CACHE_PATH="/Users/$USER/Library/Caches/Cypress/*/Cypress.app/Contents/Resources/app/packages/server/config/app.yml"   
elif [ "$(expr substr $(uname -s) 1 5)" == "Linux" ]; then
    # GNU/Linux platform
    ENLIL_CYPRESS_CACHE_PATH="/home/$USER/.cache/Cypress/*/Cypress/resources/app/packages/server/config/app.yml"
elif [ "$(expr substr $(uname -s) 1 10)" == "MINGW32_NT" ]; then
    # 32 bits Windows NT platform
    echo 1
elif [ "$(expr substr $(uname -s) 1 10)" == "MINGW64_NT" ]; then
    # 64 bits Windows NT platform
    echo 2
fi

if [[ -z "${ENLIL_CYPRESS_CACHE_PATH}" ]]; then
  echo "ENLIL_CYPRESS_CACHE_PATH not defined, exiting"
  exit
fi

sed -i -e "s|api_url:.*$|api_url: \"http://localhost:$ENLIL_COMPOSE_EXPOSE_DIRECTOR_PORT\"|g" $ENLIL_CYPRESS_CACHE_PATH
