#!/bin/bash
set -e

if [[ -z "${DIR_REPORTS}" ]]; then
  echo "DIR_REPORTS not set, exiting"
  exit 1
fi

DATE=$(date "+%Y-%m-%dT%H:%M:%S%z")
ZIP_FILE_NAME=21.4_$DATE.zip
ZIP_FILE_NAME_PATH="./zipped-test-results/$ZIP_FILE_NAME"

mkdir -p "./zipped-test-results"

echo ""
echo "--| Creating zip file $ZIP_FILE_NAME_PATH"
zip -r $ZIP_FILE_NAME_PATH $DIR_REPORTS
echo "Zipped"

S3_BUCKET="doc-be-dev-public"
S3_BUCKET_FOLDER=s3://$S3_BUCKET/cypress-reports-pipeline

echo ""
echo "--| Uploading to S3 $ZIP_FILE_NAME_PATH"
aws s3 cp ./$ZIP_FILE_NAME_PATH $S3_BUCKET_FOLDER/$ZIP_FILE_NAME --acl public-read
OBJECT_URL=https://$S3_BUCKET.s3-us-west-2.amazonaws.com/cypress-reports-pipeline/$ZIP_FILE_NAME
echo $OBJECT_URL