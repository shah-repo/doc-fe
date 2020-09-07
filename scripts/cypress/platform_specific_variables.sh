#!/bin/bash
set -e

if [ "$(uname)" == "Darwin" ]; then
    # Mac OS X platform
    export DATE_ISO_DEFAULT=$(date -u +"%Y-%m-%dT%H:%M:%SZ")   
    export ENLIL_CYPRESS_CACHE_PATH="cypress/cache/cypressLib/*/Cypress.app/Contents/Resources/app/packages/server/config/app.yml"   
    # export ENLIL_CYPRESS_CACHE_PATH="/Users/$USER/Library/Caches/Cypress/*/Cypress.app/Contents/Resources/app/packages/server/config/app.yml" 
elif [ "$(expr substr $(uname -s) 1 5)" == "Linux" ]; then
    # GNU/Linux platform
    export DATE_ISO_DEFAULT=$(date --iso-8601=seconds)
    export ENLIL_CYPRESS_CACHE_PATH="cypress/cache/cypressLib/*/Cypress/resources/app/packages/server/config/app.yml"
    # export ENLIL_CYPRESS_CACHE_PATH="/home/$USER/.cache/Cypress/*/Cypress/resources/app/packages/server/config/app.yml"
elif [ "$(expr substr $(uname -s) 1 10)" == "MINGW32_NT" ]; then
    # 32 bits Windows NT platform
    echo "Windows not supported"
    exit 1
elif [ "$(expr substr $(uname -s) 1 10)" == "MINGW64_NT" ]; then
    # 64 bits Windows NT platform
    echo "Windows not supported"
    exit 1
fi

