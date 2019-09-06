#!/bin/bash
set -e

BASE_DIR="${BITBUCKET_CLONE_DIR}"
AWS_DIR="${BASE_DIR}/aws"
ENVIRONMENT_DIR="${AWS_DIR}/environments"
TEST_RESULTS_DIR="${BASE_DIR}/test-results"

# Install Dependencies
echo "-------- Installing Dependencies --------"

# Exporting required variables
SCRIPT="${PYTHON_SCRIPTS_DIR}/getEnvValue.py"
export REACT_APP_API_ENDPOINT=$(python3 $SCRIPT $ENV $ENVIRONMENT_DIR REACT_APP_API_ENDPOINT 2>&1) 
export REACT_APP_AWS_COGNITO_CLIENT_ID=$(python3 $SCRIPT $ENV $ENVIRONMENT_DIR REACT_APP_AWS_COGNITO_CLIENT_ID 2>&1) 
export REACT_APP_FRONTEND_URL=$(python3 $SCRIPT $ENV $ENVIRONMENT_DIR REACT_APP_FRONTEND_URL 2>&1) 
export REACT_APP_SIGNUP_DOMAIN_URL=$(python3 $SCRIPT $ENV $ENVIRONMENT_DIR REACT_APP_SIGNUP_DOMAIN_URL 2>&1) 
export REACT_APP_THEME=$(python3 $SCRIPT $ENV $ENVIRONMENT_DIR REACT_APP_THEME 2>&1) 

yarn install
yarn add jest-junit

# execute tests
echo "-------- Executing Tests --------"

mkdir -p ${TEST_RESULTS_DIR}
export JEST_JUNIT_OUTPUT_DIR="${TEST_RESULTS_DIR}"

yarn test \
	--verbose \
	--no-watch \
	--reporters="default" \
	--reporters="jest-junit" \
	--forceExit