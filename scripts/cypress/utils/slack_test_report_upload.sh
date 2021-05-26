#!/bin/bash
set -e

if [[ -z "${DIR_REPORTS}" ]]; then
  echo "DIR_REPORTS not set, exiting"
  exit 1
fi

if [[ -z "${DIR_VIDEOS_REPORT}" ]]; then
  echo "DIR_VIDEOS_REPORT not set, exiting"
  exit 1
fi

NUMBER_OF_FAILS=$(jq '.stats.failures' ./$DIR_REPORTS/result.json)
NUMBER_OF_SUITES=$(jq '.stats.suites' ./$DIR_REPORTS/result.json)

#ZIP TEST REPORT
DATE=$(date "+%Y-%m-%dT%H-%M-%S%z")
ZIP_FILE_NAME=REPORT_$DATE.zip
ZIP_FILE_NAME_PATH="./zipped-test-results/$ZIP_FILE_NAME"
ZIPPED_REPORT_S3=$TEST_RUN_BUCKET_PATH/$ZIP_FILE_NAME
mkdir -p "./zipped-test-results"
echo ""
echo "--| Creating zip file $ZIP_FILE_NAME_PATH"
zip -r $ZIP_FILE_NAME_PATH $DIR_REPORTS
echo "Zipped"

curl \
  -X POST "https://slack.com/api/files.upload" \
  -H "content: multipart/form-data" \
  -H "Authorization: Bearer $SLACK_TOKEN" \
  -F channels=C022K3F7CAK \
  -F "initial_comment=Cypress test report from pipeline $BITBUCKET_BUILD_NUMBER. Number of failed test *$NUMBER_OF_FAILS/$NUMBER_OF_SUITES*" \
  -F file=@$ZIP_FILE_NAME_PATH

START_TIMESTAMP=$(jq '.stats.suites' $DIR_REPORTS/start_time.json)
echo $START_TIMESTAMP