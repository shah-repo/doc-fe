#!/bin/bash

CI_BUILD_ID=2021-02-04T11:35:00+01:00

if [[ -z "${CI_BUILD_ID}" ]]; then
  echo "CI_BUILD_ID not set, exiting"
  exit 1
fi

# make folders for results
# source ./scripts/cypress/utils/make_results_dir.sh

DIR_JSON=results/2021-02-04T11:35:00+01:00/json

if [[ $(ls $DIR_JSON | wc -l) -gt 0 ]]
then
 yarn ts-node -O '{"module": "commonjs"}' cypress/support/organizeReports/organizeReports.ts

  export ENLIL_COMPOSE_PORT_RANGE_START=${ENLIL_COMPOSE_PORT_RANGE_START:-5600}
  export ENLIL_COMPOSE_EXPOSE_DIRECTOR_PORT="$((ENLIL_COMPOSE_PORT_RANGE_START+6))"
  export CYPRESS_INTEGRATION_FOLDER="cypress/requirements/generatorSpec"
  export CYPRESS_SCREENSHOT_OF_RUN_FAILURE="false"
  export CYPRESS_TAKE_SCREENSHOT_AFTER_EACH="false"
  export REPORT_TITLE="generated_requirements"
  export CI_BUILD_ID="requirements_$CI_BUILD_ID"

  # ./scripts/cypress/utils/delete_failed_specs.sh
   ./scripts/cypress/utils/run_node.sh 2>/dev/null || true
fi
