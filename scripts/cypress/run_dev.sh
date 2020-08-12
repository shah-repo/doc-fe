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
export CYPRESS_SCREENSHOT_OF_RUN_FAILURE=${CYPRESS_SCREENSHOT_OF_RUN_FAILURE:-false}
export CYPRESS_SCREENSHOTS_FOLDER="cypress/cache/testRunner/screenshots"


mkdir -p $CYPRESS_SCREENSHOTS_FOLDER

yarn install --frozen-lockfile

./scripts/cypress/delete_cache.sh
./scripts/cypress/patch_director_port_in_cache.sh
./scripts/cypress/generate_requirements_json_file.sh

yarn cypress open
