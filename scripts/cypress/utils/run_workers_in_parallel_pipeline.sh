#!/bin/bash
set -e

yarn ts-node -O '{"module": "commonjs"}' cypress/support/organizeReports/copyToGeneratedJson.ts

./scripts/cypress/utils/generate_testmail_credentials.sh

export LIST_OF_SPECS_SERIALIZED=$(find $CYPRESS_INTEGRATION_FOLDER -type f -name "*.ts" | sort | sed -n "$PIPELINE_STEP_NUMBER~""$PIPELINE_TOTAL_NUMBER_OF_STEPS""p" | sed -n -e 'H;${x;s/\n/,/g;s/^,//;p;}')

export ENLIL_WORKER_LOG_FILE="$DIR_REPORTS/worker.log"


function prepend() { while read line; do echo "Worker ${1} | $(date --iso-8601=seconds) | ${line}"; done; }
function runNode() { 
  ./scripts/cypress/utils/run_node_pipeline.sh 2>/dev/null | prepend "${1}" | tee -a $ENLIL_WORKER_LOG_FILE 2>/dev/null || true
 }

for((i=1; i <= $NUMBER_OF_WORKERS; i+=1))
do
  echo "Started worker: $i"
  sleep 10
  runNode $i &
  pids[${i}]=$!
done

for pid in ${pids[*]}; do
    wait $pid
done

echo "Workers finished"
