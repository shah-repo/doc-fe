#!/bin/bash
set -e

if [[ -z "${CI_BUILD_ID}" ]]; then
  echo "CI_BUILD_ID not set, exiting"
  exit 1
fi
# make folders for results
source ./scripts/cypress/utils/make_results_dir.sh

export ENLIL_WORKER_LOG_FILE="$DIR_REPORTS/worker.log"

tail -f $DIR_REPORTS/worker.log | grep "Worker $WORKER_NUMBER"
