#!/bin/bash
set -e

ENV=$1

AWS_DIR="${BITBUCKET_CLONE_DIR}/aws"
ENVIRONMENT_DIR="${AWS_DIR}/environments"
BASH_SCRIPTS_DIR="${AWS_DIR}/bash_scripts"

set -o allexport
[[ -f "${ENVIRONMENT_DIR}/pipelines/${ENV}.env" ]] && source "${ENVIRONMENT_DIR}/pipelines/${ENV}.env"
set +o allexport

# Generating Build Info
echo "-------- Generating Build Info --------"

chmod a+x "${BASH_SCRIPTS_DIR}/status.sh"
"${BASH_SCRIPTS_DIR}/status.sh"

# Building
echo "-------- Building Application --------"

export CI=false # had to do this to make the build process not treat warnings as errors
yarn install --pure-lockfile
yarn build

mkdir compiled
rsync -avr \
--exclude="/aws" \
--exclude="/docker" \
--exclude="/compiled" \
--exclude="/bitbucket-pipelines.yml" \
--exclude="/test" \
--exclude="/test-results" \
* compiled/
tar -czvf compiled.tar.gz compiled