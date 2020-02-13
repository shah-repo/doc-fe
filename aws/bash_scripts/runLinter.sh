#!/bin/bash
set -e

TEST_RESULTS_DIR="${BITBUCKET_CLONE_DIR}/test-results"

# Install Dependencies
echo "-------- Installing Dependencies --------"

yarn global add node-gyp@5.0.5
yarn install --pure-lockfile

# Executing Test
echo "-------- Executing Lint Tests --------"

mkdir -p ${TEST_RESULTS_DIR}
yarn tslint -p tsconfig.json -c tslint.json --formatters-dir ${BITBUCKET_CLONE_DIR}/node_modules/tslint-junit-formatter-forked/formatters --format customJunit --out ${TEST_RESULTS_DIR}/tslint-results.xml
