#!/bin/bash
set -e

TEST_RESULTS_DIR="${BITBUCKET_CLONE_DIR}/eslint-results"

# Executing Test
echo "-------- Executing Lint Tests --------"

mkdir -p ${TEST_RESULTS_DIR}

pids=()
CI=true yarn lint --format codeframe -o ${TEST_RESULTS_DIR}/eslint-results.txt & pids+=($!)
CI=true yarn lint_cypress --format codeframe -o ${TEST_RESULTS_DIR}/eslint-results-cypress.txt & pids+=($!)

error=false
for pid in ${pids[*]}; do
    if ! wait $pid; then
        error=true
    fi
done

if $error; 
then 
  exit 1
fi
