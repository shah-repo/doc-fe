#!/bin/bash
set -e

ENV=$1

AWS_DIR="${BITBUCKET_CLONE_DIR}/aws"
ENVIRONMENT_DIR="${AWS_DIR}/environments"
BASH_SCRIPTS_DIR="${AWS_DIR}/bash_scripts"

# Generating Build Info
echo "-------- Generating Build Info --------"

chmod a+x "${BASH_SCRIPTS_DIR}/status.sh"
"${BASH_SCRIPTS_DIR}/status.sh"

# Building
echo "-------- Building Application --------"

RUN yarn install --pure-lockfile
RUN yarn build

mkdir compiled
rsync -avr \
--exclude="aws" \
--exclude="docker" \
--exclude="compiled" \
--exclude="bitbucket-pipelines.yml" \
--exclude="docker*" \
* compiled/
tar -czvf compiled.tar.gz compiled