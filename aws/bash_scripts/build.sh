#!/bin/bash
set -e

ENV=$1

BASE_DIR="${BITBUCKET_CLONE_DIR}"
AWS_DIR="${BASE_DIR}/aws"
ENVIRONMENT_DIR="${AWS_DIR}/environments"
BASH_SCRIPTS_DIR="${AWS_DIR}/bash_scripts"
PYTHON_SCRIPTS_DIR="${AWS_DIR}/python_scripts"

set -o allexport
[[ -f "${ENVIRONMENT_DIR}/pipelines/${ENV}.env" ]] && source "${ENVIRONMENT_DIR}/pipelines/${ENV}.env"
set +o allexport

# Generating Build Info
echo "-------- Generating Build Info --------"

"${BASH_SCRIPTS_DIR}/status.sh"

# Building
echo "-------- Building Application --------"

# loading env variables that are required during 'yarn build'
SCRIPT="${PYTHON_SCRIPTS_DIR}/getEnvValue.py"
export REACT_APP_API_ENDPOINT=$(python3 $SCRIPT $ENV $ENVIRONMENT_DIR REACT_APP_API_ENDPOINT 2>&1)
export REACT_APP_AWS_COGNITO_CLIENT_ID=$(python3 $SCRIPT $ENV $ENVIRONMENT_DIR REACT_APP_AWS_COGNITO_CLIENT_ID 2>&1)
export REACT_APP_FRONTEND_URL=$(python3 $SCRIPT $ENV $ENVIRONMENT_DIR REACT_APP_FRONTEND_URL 2>&1)
export REACT_APP_SIGNUP_DOMAIN_URL=$(python3 $SCRIPT $ENV $ENVIRONMENT_DIR REACT_APP_SIGNUP_DOMAIN_URL 2>&1)
export REACT_APP_THEME=$(python3 $SCRIPT $ENV $ENVIRONMENT_DIR REACT_APP_THEME 2>&1)
export REACT_APP_HELLOSIGN_TEST_MODE=$(python3 $SCRIPT $ENV $ENVIRONMENT_DIR REACT_APP_HELLOSIGN_TEST_MODE 2>&1)
export REACT_APP_HELLOSIGN_CLIENT_ID=$(python3 $SCRIPT $ENV $ENVIRONMENT_DIR REACT_APP_HELLOSIGN_CLIENT_ID 2>&1)
export REACT_APP_DATADOG_APPLICATION_ID=$(python3 $SCRIPT $ENV $ENVIRONMENT_DIR REACT_APP_DATADOG_APPLICATION_ID 2>&1)
export REACT_APP_DATADOG_CLIENT_TOKEN=$(python3 $SCRIPT $ENV $ENVIRONMENT_DIR REACT_APP_DATADOG_CLIENT_TOKEN 2>&1)
export REACT_APP_CONSOLE_TOAST=$(python3 $SCRIPT $ENV $ENVIRONMENT_DIR REACT_APP_CONSOLE_TOAST 2>&1)
export NODE_ENV=$(python3 $SCRIPT $ENV $ENVIRONMENT_DIR NODE_ENV 2>&1)


export CI=false # had to do this to make the build process not treat warnings as errors

SCRIPT="${PYTHON_SCRIPTS_DIR}/setConfigValues.py"
python3 $SCRIPT "${ENV}"

yarn install --frozen-lockfile

echo "NODE_ENV $NODE_ENV"
yarn build

rm -rf compiled compiled.tar.gz
mkdir compiled
cp -R "build" "compiled/"
tar -czvf compiled.tar.gz compiled
