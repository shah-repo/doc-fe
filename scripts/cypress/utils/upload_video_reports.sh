#!/bin/bash
set -e

if [[ -z "${DIR_REPORTS}" ]]; then
  echo "DIR_REPORTS not set, exiting"
  exit 1
fi

DATE=$(date "+%Y-%m-%dT%H:%M:%S%z")
ZIP_FILE_NAME=21.4_$DATE.zip
ZIP_FILE_NAME_PATH="zipped-test-results/$ZIP_FILE_NAME"

mkdir -p "zipped-test-results"

zip -r $ZIP_FILE_NAME_PATH $DIR_REPORTS

echo "Zipped"