#!/bin/bash
set -e

./scripts/cypress/utils/generate_testmail_credentials.sh

export CYPRESS_ARROW_DURATION=${CYPRESS_ARROW_DURATION:-40}
export ENLIL_COMPOSE_PORT_RANGE_START=${ENLIL_COMPOSE_PORT_RANGE_START:-5600}
export ENLIL_COMPOSE_EXPOSE_DIRECTOR_PORT="$((ENLIL_COMPOSE_PORT_RANGE_START+6))"

if [[ -z "${ENLIL_COMPOSE_PORT_RANGE_START}" ]]; then
  echo "ENLIL_COMPOSE_PORT_RANGE_START not set, exiting"
  exit 1
fi

export ENLIL_COMPOSE_EXPOSE_BE_PORT="$((ENLIL_COMPOSE_PORT_RANGE_START+1))"
export ENLIL_COMPOSE_EXPOSE_FE_PORT="$((ENLIL_COMPOSE_PORT_RANGE_START+2))"
export CYPRESS_BE_URL=${CYPRESS_BE_URL:-"http://localhost:$ENLIL_COMPOSE_EXPOSE_BE_PORT"}
export CYPRESS_FE_URL=${CYPRESS_FE_URL:-"http://localhost:$ENLIL_COMPOSE_EXPOSE_FE_PORT"}
export CYPRESS_BASE_URL=$CYPRESS_FE_URL
export CYPRESS_KONFIG_ENV="development"
export CYPRESS_SCREENSHOT_OF_RUN_FAILURE=${CYPRESS_SCREENSHOT_OF_RUN_FAILURE:-false}
export CYPRESS_SKIP_ON_RUN_FAILURE=${CYPRESS_SKIP_ON_RUN_FAILURE:-false}
export CYPRESS_TAKE_SCREENSHOT_AFTER_EACH=${CYPRESS_TAKE_SCREENSHOT_AFTER_EACH:-false}
export CYPRESS_SCREENSHOTS_FOLDER="cypress/cache/testRunner/screenshots"
export CYPRESS_VIDEOS_FOLDER="cypress/cache/testRunner/videos"
export CYPRESS_SUPERADMIN_EMAIL=${CYPRESS_SUPERADMIN_EMAIL:-"zoran.kovacevic+admin@codecons.com"}
export CYPRESS_SUPERADMIN_PASSWORD=${CYPRESS_SUPERADMIN_PASSWORD:-"Tester1!"}
export CYPRESS_RUN_ENVIRONMENT=${CYPRESS_RUN_ENVIRONMENT:-"LOCALDEV"}
export CYPRESS_TEST_EMAIL="enlil.testmail@gmail.com"

mkdir -p $CYPRESS_SCREENSHOTS_FOLDER
mkdir -p $CYPRESS_VIDEOS_FOLDER

export CYPRESS_CACHE_FOLDER="cypress/cache/cypressLib"
mkdir -p $CYPRESS_CACHE_FOLDER
yarn install --frozen-lockfile
yarn cypress install
yarn cypress verify

./scripts/cypress/utils/delete_cache.sh
./scripts/cypress/utils/patch_director_port_in_cache.sh
./scripts/cypress/utils/generate_requirements_json_file.sh

yarn cypress open
