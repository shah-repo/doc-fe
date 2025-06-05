#!/bin/bash
set -e

BASE_DIR="${BITBUCKET_CLONE_DIR}"
AWS_DIR="${BASE_DIR}/aws"
BASH_SCRIPTS_DIR="${AWS_DIR}/bash_scripts"

. "${BASH_SCRIPTS_DIR}/configure.sh"

NODE_ENV=development yarn install --frozen-lockfile

yarn lint:tsc
