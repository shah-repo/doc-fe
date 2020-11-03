#!/bin/bash

if [[ -z "${ENLIL_COMPOSE_PORT_RANGE_START}" ]]; then
  echo "ENLIL_COMPOSE_PORT_RANGE_START not set, exiting"
  exit 1
fi

if [[ -z "${CI_BUILD_ID}" ]]; then
  echo "CI_BUILD_ID not set, exiting"
  exit 1
fi

if [[ -z "${DIR_JSON}" ]]; then
  echo "DIR_JSON not set, exiting"
  exit 1
fi

if [[ -z "${REPORT_TITLE}" ]]; then
  echo "REPORT_TITLE not set, exiting"
  exit 1
fi

if [[ -z "${CYPRESS_FE_URL}" ]]; then
  echo "CYPRESS_FE_URL not set, exiting"
  exit 1
fi

if [[ -z "${CYPRESS_BE_URL}" ]]; then
  echo "CYPRESS_BE_URL not set, exiting"
  exit 1
fi

export CYPRESS_BASE_URL=$CYPRESS_FE_URL

export CYPRESS_KONFIG_ENV="development"
export CYPRESS_BROWSER=${CYPRESS_BROWSER:-chrome}

./scripts/cypress/wait.sh

yarn cypress run \
  --parallel --record --key 9e6e4a3d-c43a-4e60-8984-fa2ae0a90a76 \
  --reporter mochawesome --reporter-options "reportDir=$DIR_JSON,overwrite=false,html=false,json=true,reportFilename=$REPORT_TITLE" \
  --browser $CYPRESS_BROWSER \
  --headless \
  --ci-build-id "$CI_BUILD_ID"
