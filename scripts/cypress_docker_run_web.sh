#!/bin/bash
set -e

echo "Starting server..."
BIN_DIR=`dirname $0`
PROJECT_ROOT=`readlink -f "${BIN_DIR}/.."`
echo "Project root is $PROJECT_ROOT"
cd $PROJECT_ROOT

yarn serve -s build -p $PORT
