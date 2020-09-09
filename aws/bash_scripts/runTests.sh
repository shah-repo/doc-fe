#!/bin/bash
set -e

BASE_DIR="${BITBUCKET_CLONE_DIR}"
AWS_DIR="${BASE_DIR}/aws"
ENVIRONMENT_DIR="${AWS_DIR}/environments"
PYTHON_SCRIPTS_DIR="${AWS_DIR}/python_scripts"
TEST_RESULTS_DIR="${BASE_DIR}/test-results"
JEST_CONFIG_LOG_DIR="${BASE_DIR}/jest-config"
MAX_WORKERS="6"

# Install Dependencies
echo "-------- Installing Dependencies --------"

# Exporting required variables
SCRIPT="${PYTHON_SCRIPTS_DIR}/getEnvValue.py"
export REACT_APP_API_ENDPOINT=$(python3 $SCRIPT $ENV $ENVIRONMENT_DIR REACT_APP_API_ENDPOINT 2>&1) 
export REACT_APP_AWS_COGNITO_CLIENT_ID=$(python3 $SCRIPT $ENV $ENVIRONMENT_DIR REACT_APP_AWS_COGNITO_CLIENT_ID 2>&1) 
export REACT_APP_FRONTEND_URL=$(python3 $SCRIPT $ENV $ENVIRONMENT_DIR REACT_APP_FRONTEND_URL 2>&1) 
export REACT_APP_SIGNUP_DOMAIN_URL=$(python3 $SCRIPT $ENV $ENVIRONMENT_DIR REACT_APP_SIGNUP_DOMAIN_URL 2>&1) 
export REACT_APP_THEME=$(python3 $SCRIPT $ENV $ENVIRONMENT_DIR REACT_APP_THEME 2>&1) 
export REACT_APP_HELLOSIGN_TEST_MODE=$(python3 $SCRIPT $ENV $ENVIRONMENT_DIR REACT_APP_HELLOSIGN_TEST_MODE 2>&1)
export REACT_APP_HELLOSIGN_CLIENT_ID=$(python3 $SCRIPT $ENV $ENVIRONMENT_DIR REACT_APP_HELLOSIGN_CLIENT_ID 2>&1)

yarn install --frozen-lockfile

echo "-------- Generate fake server info -------"
cat >> "${BITBUCKET_CLONE_DIR}/src/data/buildInfo.json" <<EOF 
{
"Repository": "sample",
"Branch": "sample",
"Tag": "sample",
"Commit Hash": "sample",
"Build Number": "sample",
"ECR Image": "sample",
"Date": "sample"
}
EOF

# Executing Test
echo "-------- Executing Tests --------"

mkdir -p "${TEST_RESULTS_DIR}"
mkdir -p "${JEST_CONFIG_LOG_DIR}"
export JEST_JUNIT_OUTPUT_DIR="${TEST_RESULTS_DIR}"

yarn test \
  --reporters="default" \
  --reporters="jest-junit" \
  --silent \
  --maxWorkers="${MAX_WORKERS}" \
  --forceExit \
  --showConfig \
  > "${JEST_CONFIG_LOG_DIR}/config.txt"

yarn test \
  --reporters="default" \
  --reporters="jest-junit" \
  --silent \
  --maxWorkers="${MAX_WORKERS}" \
  --forceExit
