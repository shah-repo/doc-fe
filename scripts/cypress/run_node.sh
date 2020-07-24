#!/bin/bash
set -e

if [[ -z "${ENLIL_COMPOSE_PORT_RANGE_START}" ]]; then
  echo "ENLIL_COMPOSE_PORT_RANGE_START not set, exiting"
  exit
fi

if [[ -z "${CI_BUILD_ID}" ]]; then
  echo "CI_BUILD_ID not set, exiting"
  exit
fi

if [[ -z "${DIR_JSON}" ]]; then
  echo "DIR_JSON not set, exiting"
  exit
fi

if [[ -z "${REPORT_TITLE}" ]]; then
  echo "REPORT_TITLE not set, exiting"
  exit
fi

export ENLIL_COMPOSE_EXPOSE_BE_PORT="$((ENLIL_COMPOSE_PORT_RANGE_START+1))"
export ENLIL_COMPOSE_EXPOSE_FE_PORT="$((ENLIL_COMPOSE_PORT_RANGE_START+2))"

export CYPRESS_BE_URL="http://localhost:$ENLIL_COMPOSE_EXPOSE_BE_PORT"
export CYPRESS_FE_URL="http://localhost:$ENLIL_COMPOSE_EXPOSE_FE_PORT"
export CYPRESS_KONFIG_ENV="development"
# screenshotOnRunFailure

yarn cypress run \
  --parallel --record --key 9e6e4a3d-c43a-4e60-8984-fa2ae0a90a76 \
  --reporter mochawesome --reporter-options "reportDir=$DIR_JSON,overwrite=false,html=false,json=true,reportFilename=$REPORT_TITLE" \
  --ci-build-id "$CI_BUILD_ID"
