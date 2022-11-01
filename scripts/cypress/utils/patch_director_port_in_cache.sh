#!/bin/bash

source ./scripts/cypress/utils/platform_specific_variables.sh

if [[ -z "${ENLIL_COMPOSE_EXPOSE_DIRECTOR_PORT}" ]]; then
  echo "ENLIL_COMPOSE_EXPOSE_DIRECTOR_PORT not set, exiting"
  exit 1
fi

if [[ -z "${ENLIL_CYPRESS_CACHE_PATH}" ]]; then
  echo "ENLIL_CYPRESS_CACHE_PATH not defined, exiting"
  exit 1
fi

if [[ -z "${ENLIL_CYPRESS_CSS_FIX_PATH}" ]]; then
  echo "ENLIL_CYPRESS_CSS_FIX_PATH not defined, exiting"
  exit 1
fi

sed -i -e "s|api_url:.*$|api_url: \"http://localhost:$ENLIL_COMPOSE_EXPOSE_DIRECTOR_PORT\"|g" $ENLIL_CYPRESS_CACHE_PATH

sed -i -e "s|  const removeScrollBehaviorFix = addScrollBehaviorFix();|  // const removeScrollBehaviorFix = addScrollBehaviorFix();|g" $ENLIL_CYPRESS_CSS_FIX_PATH
sed -i -e "s|  removeScrollBehaviorFix();|  // removeScrollBehaviorFix();|g" $ENLIL_CYPRESS_CSS_FIX_PATH
