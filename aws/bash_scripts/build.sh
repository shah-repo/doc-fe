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
[[ -f "${ENVIRONMENT_DIR}/${ENV}.env" ]] && source "${ENVIRONMENT_DIR}/${ENV}.env"
set +o allexport

export CI=false # had to do this to make the build process not treat warnings as errors

# Generating Build Info
echo "-------- Generating Build Info --------"

"${BASH_SCRIPTS_DIR}/status.sh"

# Building
echo "-------- Building Application --------"

# https://classic.yarnpkg.com/en/docs/installing-dependencies/#toc-installing-options
# we need dependencies and devDependencies so NODE_ENV should NOT be production
NODE_ENV=development yarn install --frozen-lockfile

yarn build

rm -rf compiled compiled.tar.gz
mkdir compiled
cp -R "build" "compiled/"
tar -czvf compiled.tar.gz compiled
