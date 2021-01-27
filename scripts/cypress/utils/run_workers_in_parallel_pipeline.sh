#!/bin/bash
set -e

PIPELINE_TOTAL_NUMBER_OF_STEPS=${BITBUCKET_PARALLEL_STEP_COUNT:-1}
PIPELINE_STEP_NUMBER=${BITBUCKET_PARALLEL_STEP:-1}

export LIST_OF_SPECS_SERIALIZED=$(find dist/cypress/integration -type f -name "*.js" | sort | sed -n "$PIPELINE_STEP_NUMBER~""$PIPELINE_TOTAL_NUMBER_OF_STEPS""p" | sed -n -e 'H;${x;s/\n/,/g;s/^,//;p;}')
# export LIST_OF_SPECS_SERIALIZED=$(printf ",%s" "${LIST_OF_SPECS[@]}")

export ENLIL_WORKER_LOG_FILE="$DIR_REPORTS/worker.log"

# ./scripts/cypress/utils/generate_requirements_json_file.sh

function prepend() { while read line; do echo "${1}${line}"; done; }
function runNode() { 
  ./scripts/cypress/utils/run_node_pipeline.sh 2>/dev/null | prepend "Worker ${1} | " | tee -a $ENLIL_WORKER_LOG_FILE 2>/dev/null || true
 }

for((i=1; i <= $NUMBER_OF_WORKERS; i+=1))
do
  echo "Started worker: $i"
  # ./scripts/cypress/utils/run_node.sh  2>/dev/null || true  &
  runNode $i &
  pids[${i}]=$!
done

for pid in ${pids[*]}; do
    wait $pid
done

echo "Workers finished"
