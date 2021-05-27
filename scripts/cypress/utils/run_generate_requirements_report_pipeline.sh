#!/bin/bash
set -e

if [[ $(ls $DIR_JSON | wc -l) -gt 0 ]]
then
  yarn --silent mochawesome-merge \"$DIR_JSON/generated_specs*.json\" > "$DIR_JSON/merged_specs.json" 
  cp "$DIR_JSON/merged_specs.json" cypress/cache/merged_specs.json

  CYPRESS_INTEGRATION_FOLDER="cypress/requirements/generatorSpec"
  CYPRESS_SCREENSHOT_OF_RUN_FAILURE="false"
  CYPRESS_TAKE_SCREENSHOT_AFTER_EACH="false"
  REPORT_TITLE="generated_requirements"

  CI_BUILD_ID="requirements_$CI_BUILD_ID" 
  LIST_OF_SPECS_SERIALIZED=cypress/requirements/generatorSpec/generatorSpec.spec.ts 
  
  $(xvfb-run -a yarn cypress run \
  --parallel --record --key 9e6e4a3d-c43a-4e60-8984-fa2ae0a90a76 \
  --reporter mochawesome --reporter-options "reportDir=$DIR_JSON,overwrite=false,html=false,json=true,reportFilename=$REPORT_TITLE" \
  --browser $CYPRESS_BROWSER \
  --headless \
  --spec $LIST_OF_SPECS_SERIALIZED \
  --ci-build-id "$CI_BUILD_ID") 2>/dev/null || true
fi