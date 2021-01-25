#!/bin/bash
set -e

export DEBUG=cypress:server:util:process_profiler

xvfb-run -a yarn cypress run \
  --parallel --record --key 9e6e4a3d-c43a-4e60-8984-fa2ae0a90a76 \
  --reporter cypress-multi-reporters --reporter-options configFile=cypress-reporter-config.json \
  --browser $CYPRESS_BROWSER \
  --headless \
  --spec $LIST_OF_SPECS_SERIALIZED \
  --ci-build-id "$CI_BUILD_ID"
