#!/bin/bash
set -e

export ENLIL_DIRECTOR_HOST=${ENLIL_DIRECTOR_HOST:-"localhost"}
export ENLIL_CYPRESS_CACHE_PATH="/opt/app/cypress/cache/cypressLib/*/Cypress/resources/app/packages/server/config/app.yml"
 
sed -i -e "s|api_url:.*$|api_url: \"http://$ENLIL_DIRECTOR_HOST:1234\"|g" $ENLIL_CYPRESS_CACHE_PATH
