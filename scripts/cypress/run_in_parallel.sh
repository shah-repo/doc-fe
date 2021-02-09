#!/bin/bash

set -e

secs_to_human() {
    if [[ -z ${1} || ${1} -lt 60 ]] ;then
        min=0 ; secs="${1}"
    else
        time_mins=$(echo "scale=2; ${1}/60" | bc)
        min=$(echo ${time_mins} | cut -d'.' -f1)
        secs="0.$(echo ${time_mins} | cut -d'.' -f2)"
        secs=$(echo ${secs}*60|bc|awk '{print int($1+0.5)}')
    fi
    echo "Time Elapsed : ${min} minutes and ${secs} seconds."
}
start=$(date +%s)

if [[ -z "${CI_BUILD_ID}" ]]; then
  echo "CI_BUILD_ID not set, exiting"
  exit 1
fi

export ENLIL_COMPOSE_PORT_RANGE_START=${ENLIL_COMPOSE_PORT_RANGE_START:-5600}
export ENLIL_COMPOSE_EXPOSE_BE_PORT="$((ENLIL_COMPOSE_PORT_RANGE_START+1))"
export ENLIL_COMPOSE_EXPOSE_FE_PORT="$((ENLIL_COMPOSE_PORT_RANGE_START+2))"
export ENLIL_COMPOSE_EXPOSE_DIRECTOR_PORT="$((ENLIL_COMPOSE_PORT_RANGE_START+6))"
export REPORT_TITLE=${REPORT_TITLE:-generated_specs}
export CYPRESS_INTEGRATION_FOLDER=${CYPRESS_INTEGRATION_FOLDER:-"cypress/integration"}
export CYPRESS_SKIP_ON_RUN_FAILURE=${CYPRESS_SKIP_ON_RUN_FAILURE:-true}
export CYPRESS_TAKE_SCREENSHOT_AFTER_EACH=${CYPRESS_TAKE_SCREENSHOT_AFTER_EACH:-false}
export CYPRESS_SUPERADMIN_EMAIL=${CYPRESS_SUPERADMIN_EMAIL:-"zoran.kovacevic+admin@codecons.com"}
export CYPRESS_SUPERADMIN_PASSWORD=${CYPRESS_SUPERADMIN_PASSWORD:-"Tester1!"}
export CYPRESS_VIDEO=${CYPRESS_VIDEO:-false}
export CYPRESS_BE_URL=${CYPRESS_BE_URL:-"http://localhost:$ENLIL_COMPOSE_EXPOSE_BE_PORT"}
export CYPRESS_FE_URL=${CYPRESS_FE_URL:-"http://localhost:$ENLIL_COMPOSE_EXPOSE_FE_PORT"}
export CYPRESS_TEST_EMAIL=${CYPRESS_TEST_EMAIL:-"enlil.testmail@gmail.com"}
export CYPRESS_TEST_EMAIL_PASSWORD=${CYPRESS_TEST_EMAIL_PASSWORD:-"shifamed123"}
export CYPRESS_RUN_ENVIRONMENT=${CYPRESS_RUN_ENVIRONMENT:-"LOCALPARALLEL"}

export COMPOSE_PROJECT_NAME="enlil_$ENLIL_COMPOSE_PORT_RANGE_START"

export CYPRESS_CACHE_FOLDER="cypress/cache/cypressLib"
mkdir -p $CYPRESS_CACHE_FOLDER
yarn install --frozen-lockfile
yarn cypress install
yarn cypress verify

source ./scripts/cypress/utils/make_results_dir.sh

./scripts/cypress/utils/patch_director_port_in_cache.sh
./scripts/cypress/utils/generate_requirements_json_file.sh

./scripts/cypress/utils/delete_cache.sh

./scripts/cypress/utils/run_generate_info_report.sh

export CYPRESS_SCREENSHOTS_FOLDER=$DIR_SCREENSHOTS_REPORT
export CYPRESS_VIDEOS_FOLDER=$DIR_VIDEOS_REPORT

if [[ -z "${NUMBER_OF_WORKERS_PER_RUN}" ]]; then
  ./scripts/cypress/utils/delete_failed_specs.sh
  NUMBER_OF_WORKERS=${NUMBER_OF_WORKERS:-4} ./scripts/cypress/utils/run_workers_in_parallel.sh
else
  for i in $(echo $NUMBER_OF_WORKERS_PER_RUN | sed "s/,/ /g")
  do
    ./scripts/cypress/utils/delete_failed_specs.sh
    NUMBER_OF_WORKERS=$i ./scripts/cypress/utils/run_workers_in_parallel.sh
  done
fi

./scripts/cypress/utils/run_generate_requirements_report.sh
./scripts/cypress/utils/merge_reports.sh

echo "================="
echo "================="
secs_to_human "$(($(date +%s) - ${start}))"
