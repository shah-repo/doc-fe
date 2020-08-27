#!/bin/bash
set -e

source ./scripts/cypress/platform_specific_variables.sh

if [[ -z "${ENLIL_COMPOSE_EXPOSE_DIRECTOR_PORT}" ]]; then
  echo "ENLIL_COMPOSE_EXPOSE_DIRECTOR_PORT not set, exiting"
  exit
fi

if [[ -z "${ENLIL_CYPRESS_CACHE_PATH}" ]]; then
  echo "ENLIL_CYPRESS_CACHE_PATH not defined, exiting"
  exit
fi

sed -i -e "s|api_url:.*$|api_url: \"http://localhost:$ENLIL_COMPOSE_EXPOSE_DIRECTOR_PORT\"|g" $ENLIL_CYPRESS_CACHE_PATH
