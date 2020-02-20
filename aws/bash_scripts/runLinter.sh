#!/bin/bash
set -e

TEST_RESULTS_DIR="${BITBUCKET_CLONE_DIR}/test-results"

# Install Dependencies
echo "-------- Installing Dependencies --------"

yarn install --pure-lockfile

# Executing Test
echo "-------- Executing Lint Tests --------"

mkdir -p ${TEST_RESULTS_DIR}
yarn lint --format junit -o ${TEST_RESULTS_DIR}/eslint-results.xml
