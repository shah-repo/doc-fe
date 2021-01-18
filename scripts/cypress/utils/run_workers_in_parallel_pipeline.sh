#!/bin/bash
set -e

LIST_OF_SPECS=(
  'cypress/integration/approval.request/approval_request_list.spec.ts'
  'cypress/integration/auth/authentication.spec.ts'
  'cypress/integration/document.revision/document_creation_flow.spec.ts'
  'cypress/integration/document.revision/document_history.spec.ts'
  'cypress/integration/document.revision/document_non_qms.spec.ts'
  'cypress/integration/document.revision/document_revising_flow.spec.ts' 
  'cypress/integration/document.revision/document_sequential_numbering.spec.ts'
  'cypress/integration/document.revision/document_voiding.spec.ts'
)
LIST_OF_SPECS_SERIALIZED=$(printf ",%s" "${LIST_OF_SPECS[@]}")

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
