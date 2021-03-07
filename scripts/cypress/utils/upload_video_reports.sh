#!/bin/bash
set -e

if [[ -z "${DIR_REPORTS}" ]]; then
  echo "DIR_REPORTS not set, exiting"
  exit 1
fi

DATE=$(date "+%Y-%m-%dT%H-%M-%S%z")
ZIP_FILE_NAME=21.4_$DATE.zip
ZIP_FILE_NAME_PATH="./zipped-test-results/$ZIP_FILE_NAME"
ATTACHMENT_S3=930729cd-675b-4151-ba0a-6ab97547b0f7/cypress-reports-pipeline/$ZIP_FILE_NAME

mkdir -p "./zipped-test-results"

echo ""
echo "--| Creating zip file $ZIP_FILE_NAME_PATH"
zip -r $ZIP_FILE_NAME_PATH $DIR_REPORTS
echo "Zipped"

S3_BUCKET="doc-be-dev"
S3_BUCKET_PATH=s3://$S3_BUCKET/$ATTACHMENT_S3

echo ""
echo "--| Uploading to S3 $ZIP_FILE_NAME_PATH"

aws s3 cp ./$ZIP_FILE_NAME_PATH $S3_BUCKET_PATH --acl public-read
OBJECT_URL=https://$S3_BUCKET.s3-us-west-2.amazonaws.com/$ATTACHMENT_S3
echo $OBJECT_URL

ENLIL_ATTACHMENT=$(curl -X POST "https://api.dev.enlil.io/api/v1/attachments/external" -H "accept: application/json" -H "Authorization: apitoken 5db418b5-1599-4533-b677-25abfd2956a0:92662461-e204-4ad2-ba02-ccc6daf1fc13" -H "Content-Type: application/json" -d "{ \"name\": \"test report\", \"type\": \"zip\", \"s3link\": \"$ATTACHMENT_S3\", \"description\": \"test report\", \"isCleanCopyRequired\": false, \"lineType\": \"CLEAN_COPY\"}")

curl -X POST "https://api.dev.enlil.io/api/v1/document_revisions/external" -H "accept: application/json" -H "Authorization: apitoken 5db418b5-1599-4533-b677-25abfd2956a0:92662461-e204-4ad2-ba02-ccc6daf1fc13" -H "Content-Type: application/json" -d "{ \"description\": \"<p>Cypress test report test</p>\", \"name\": \"Cypress test report\", \"attachments\": [ $ENLIL_ATTACHMENT ], \"referenceTo\": [], \"revisionStage\": 1, \"revisionChangeType\": \"NEXT_REVISION\", \"retrain\": false, \"document\": { \"docId\": \"CTR00012\", \"securityList\": { \"securityEmployees\": [], \"securityGroups\": [ { \"id\": \"4414cdad-8763-4da1-b6a1-6cebb674259e\" } ], \"operators\": [] }, \"documentType\": { \"id\": \"57e1a2a8-025f-4955-aee1-4d8e30907d34\" } }}"

echo "Done"