#!/bin/bash

if [[ -z "${CI_BUILD_ID}" ]]; then
  echo "CI_BUILD_ID not set, exiting"
  exit 1
fi

# make folders for results
source ./scripts/cypress/utils/make_results_dir.sh

export ENLIL_COMPOSE_PORT_RANGE_START=${ENLIL_COMPOSE_PORT_RANGE_START:-5600}
export ENLIL_COMPOSE_EXPOSE_DIRECTOR_PORT="$((ENLIL_COMPOSE_PORT_RANGE_START+6))"
export CYPRESS_INTEGRATION_FOLDER="cypress/info"
export CYPRESS_SCREENSHOTS_FOLDER=$DIR_SCREENSHOTS_REPORT
export CYPRESS_VIDEOS_FOLDER=$DIR_VIDEOS_REPORT
export CYPRESS_SCREENSHOT_OF_RUN_FAILURE="false"
export CYPRESS_TAKE_SCREENSHOT_AFTER_EACH="false"
export REPORT_TITLE="generated_info"
export CYPRESS_VIDEO="false"

./scripts/cypress/utils/delete_failed_specs.sh
CI_BUILD_ID="info_$CI_BUILD_ID" ./scripts/cypress/utils/run_node.sh 2>/dev/null || true
