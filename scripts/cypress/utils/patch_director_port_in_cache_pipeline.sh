#!/bin/bash

export ENLIL_CYPRESS_CACHE_PATH="cypress/cache/cypressLib/*/Cypress/resources/app/packages/server/config/app.yml"
 
sed -i -e "s|api_url:.*$|api_url: \"http://sorry-cypress-director:1234\"|g" $ENLIL_CYPRESS_CACHE_PATH
