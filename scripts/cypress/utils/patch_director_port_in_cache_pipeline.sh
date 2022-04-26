#!/bin/bash
set -e

export ENLIL_DIRECTOR_HOST=${ENLIL_DIRECTOR_HOST:-"localhost"}
export ENLIL_CYPRESS_CACHE_PATH="/opt/app/cypress/cache/cypressLib/*/Cypress/resources/app/packages/server/config/app.yml"
export ENLIL_CYPRESS_CSS_FIX_PATH="/opt/app/cypress/cache/cypressLib/*/Cypress/resources/app/packages/runner/dist/cypress_runner.js"

sed -i -e "s|api_url:.*$|api_url: \"http://$ENLIL_DIRECTOR_HOST:1234\"|g" $ENLIL_CYPRESS_CACHE_PATH
sed -i -e "s|  const removeScrollBehaviorFix = addScrollBehaviorFix();|  // const removeScrollBehaviorFix = addScrollBehaviorFix();|g" $ENLIL_CYPRESS_CSS_FIX_PATH
sed -i -e "s|  removeScrollBehaviorFix();|  // removeScrollBehaviorFix();|g" $ENLIL_CYPRESS_CSS_FIX_PATH
