#!/bin/bash
set -e

DEBUG=cypress:* yarn cypress run \
  --parallel --record --key 9e6e4a3d-c43a-4e60-8984-fa2ae0a90a76 \
  --reporter mochawesome --reporter-options "reportDir=$DIR_JSON,overwrite=false,html=false,json=true,reportFilename=$REPORT_TITLE" \
  --browser $CYPRESS_BROWSER \
  --headless \
  --ci-build-id "$CI_BUILD_ID"
