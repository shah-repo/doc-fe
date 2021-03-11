#!/bin/bash
set -e

TEST_RESULTS_DIR="${BITBUCKET_CLONE_DIR}/eslint-results"

# Executing Test
echo "-------- Executing Lint Tests --------"

mkdir -p ${TEST_RESULTS_DIR}
CI=true yarn lint --format codeframe -o ${TEST_RESULTS_DIR}/eslint-results.txt
