#!/bin/bash
set -e

BASE_DIR="${BITBUCKET_CLONE_DIR}"
AWS_DIR="${BASE_DIR}/aws"
ENVIRONMENT_DIR="${AWS_DIR}/environments"
BASH_SCRIPTS_DIR="${AWS_DIR}/bash_scripts"
PYTHON_SCRIPTS_DIR="${AWS_DIR}/python_scripts"

TEST_RESULTS_DIR="${BITBUCKET_CLONE_DIR}/test-results"

# Install Dependencies
echo "-------- Installing Dependencies --------"

# Exporting required variables
SCRIPT="${PYTHON_SCRIPTS_DIR}/getEnvValue.py"
export REACT_APP_API_ENDPOINT=$(python3 $SCRIPT $ENV $ENVIRONMENT_DIR REACT_APP_API_ENDPOINT 2>&1) 
export REACT_APP_AWS_COGNITO_CLIENT_ID=$(python3 $SCRIPT $ENV $ENVIRONMENT_DIR REACT_APP_AWS_COGNITO_CLIENT_ID 2>&1) 
export REACT_APP_FRONTEND_URL=$(python3 $SCRIPT $ENV $ENVIRONMENT_DIR REACT_APP_FRONTEND_URL 2>&1) 
export REACT_APP_SIGNUP_DOMAIN_URL=$(python3 $SCRIPT $ENV $ENVIRONMENT_DIR REACT_APP_SIGNUP_DOMAIN_URL 2>&1) 
export REACT_APP_THEME=$(python3 $SCRIPT $ENV $ENVIRONMENT_DIR REACT_APP_THEME 2>&1) 

# install dependencies 
echo "-------- Installing Dependencies --------"

yarn install
yarn add jest-junit

# execute tests
echo "-------- Executing Tests --------"


mkdir -p ${TEST_RESULTS_DIR}
export JEST_JUNIT_OUTPUT="${TEST_RESULTS_DIR}/jest-results.xml"

yarn test --watchAll=false --reporters="jest-junit" --forceExit --detectOpenHandles --ci

if [ -f "${BASE_DIR}/junit.xml" ]; then 
	mv "${BASE_DIR}/junit.xml" "${TEST_RESULTS_DIR}/junit.xml"
fi