#!/bin/bash
set -e

CYPRESS_INTEGRATION_FOLDER="cypress/info"
CYPRESS_SCREENSHOT_OF_RUN_FAILURE="false"
CYPRESS_TAKE_SCREENSHOT_AFTER_EACH="false"
REPORT_TITLE="generated_info"
CYPRESS_VIDEO="false"
CI_BUILD_ID="info_$CI_BUILD_ID" 
LIST_OF_SPECS_SERIALIZED=cypress/info/info.spec.ts 
DEBUG=cypress:server:util:process_profiler

$(xvfb-run -a yarn cypress run \
  --parallel --record --key 9e6e4a3d-c43a-4e60-8984-fa2ae0a90a76 \
  --reporter mochawesome --reporter-options "reportDir=$DIR_JSON,overwrite=false,html=false,json=true,reportFilename=$REPORT_TITLE" \
  --browser $CYPRESS_BROWSER \
  --headless \
  --spec $LIST_OF_SPECS_SERIALIZED \
  --ci-build-id "$CI_BUILD_ID") 2>/dev/null || true