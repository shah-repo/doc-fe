#!/bin/bash
set -e

export ENLIL_COMPOSE_PORT_RANGE_START=${ENLIL_COMPOSE_PORT_RANGE_START:-5600}
export ENLIL_COMPOSE_EXPOSE_DIRECTOR_PORT="$((ENLIL_COMPOSE_PORT_RANGE_START+6))"
export CYPRESS_SCREENSHOT_OF_RUN_FAILURE=${CYPRESS_SCREENSHOT_OF_RUN_FAILURE:-true}
export CYPRESS_BAIL_ON_FAILURE=${CYPRESS_BAIL_ON_FAILURE:-true}

# calculate CI build number, has to be unique
# export CI_BUILD_ID=$(date -R)
if [[ -z "${CI_BUILD_ID}" ]]; then
  echo "CI_BUILD_ID not set, exiting"
  exit
fi

if [[ -z "${NUMBER_OF_WORKERS}" ]]; then
  echo "NUMBER_OF_WORKERS not set, exiting"
  exit
fi

# make folders for results
source ./scripts/cypress/make_results_dir.sh

if [[ -z "${DIR_REPORTS}" ]]; then
  echo "DIR_REPORTS not set, exiting"
  exit
fi

export ENLIL_WORKER_LOG_FILE="$DIR_REPORTS/worker.log"

./scripts/cypress/patch_director_port_in_cache.sh
./scripts/cypress/generate_requirements_json_file.sh

echo "NUMBER_OF_WORKERS: $NUMBER_OF_WORKERS"
echo "ENLIL_COMPOSE_PORT_RANGE_START: $ENLIL_COMPOSE_PORT_RANGE_START"
echo "CI_BUILD_ID: $CI_BUILD_ID"
echo " "

for((i=1; i <= $NUMBER_OF_WORKERS; i+=1))
do
  echo "Started worker: $i"
  # ./scripts/cypress/run_node.sh  2>/dev/null || true  &
  ./scripts/cypress/run_node.sh 2>/dev/null | xargs -I {} echo "Worker $i | " {} | tee -a $ENLIL_WORKER_LOG_FILE || true  &
  pids[${i}]=$!
done

for pid in ${pids[*]}; do
    wait $pid
done
