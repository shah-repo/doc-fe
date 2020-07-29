#!/bin/bash
set -e

if [[ -z "${CI_BUILD_ID}" ]]; then
  echo "CI_BUILD_ID not set, exiting"
  exit
fi
# make folders for results
source ./scripts/cypress/make_results_dir.sh

export ENLIL_WORKER_LOG_FILE="$DIR_REPORTS/worker.log"

tail -f $DIR_REPORTS/worker.log | grep "Worker $WORKER_NUMBER"
