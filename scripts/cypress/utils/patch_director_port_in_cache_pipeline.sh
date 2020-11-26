#!/bin/bash
set -e
export ENLIL_CYPRESS_CACHE_PATH="/opt/app/cypress/cache/cypressLib/*/Cypress/resources/app/packages/server/config/app.yml"
 
sed -i -e "s|api_url:.*$|api_url: \"http://localhost:1234\"|g" $ENLIL_CYPRESS_CACHE_PATH
