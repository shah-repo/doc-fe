#!/bin/bash
set -e

DEBUG=cypress:* xvfb-run -a yarn cypress run \
  --parallel --record --key 9e6e4a3d-c43a-4e60-8984-fa2ae0a90a76 \
  --reporter cypress-multi-reporters --reporter-options configFile=cypress-reporter-config.json \
  --browser $CYPRESS_BROWSER \
  --headless \
  --ci-build-id "$CI_BUILD_ID"
