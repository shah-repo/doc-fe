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

#Move videos so they don't get zipped
mv $DIR_VIDEOS_REPORT ./ 

#ZIP TEST REPORT
DATE=$(date "+%Y-%m-%dT%H-%M-%S%z")
TEST_RUN_BUCKET_PATH=930729cd-675b-4151-ba0a-6ab97547b0f7/cypress-reports-pipeline/$DATE
ZIP_FILE_NAME=REPORT_$DATE.zip
ZIP_FILE_NAME_PATH="./zipped-test-results/$ZIP_FILE_NAME"
ZIPPED_REPORT_S3=$TEST_RUN_BUCKET_PATH/$ZIP_FILE_NAME
mkdir -p "./zipped-test-results"
echo ""
echo "--| Creating zip file $ZIP_FILE_NAME_PATH"
zip -r $ZIP_FILE_NAME_PATH $DIR_REPORTS
echo "Zipped"

#UPLOAD ZIPPED REPORT TO S3
S3_BUCKET="doc-be-dev"
S3_BUCKET_PATH=s3://$S3_BUCKET
echo ""
echo "--| Uploading to S3 $ZIP_FILE_NAME_PATH"
aws s3 cp ./$ZIP_FILE_NAME_PATH $S3_BUCKET_PATH/$ZIPPED_REPORT_S3 --acl public-read
OBJECT_URL=https://$S3_BUCKET.s3-us-west-2.amazonaws.com/$ZIPPED_REPORT_S3
echo $OBJECT_URL

#UPLOAD TEST VIDEOS TO S3
TEST_VIDEOS_PATH="./videos"
echo "--| Uploading to S3 $TEST_VIDEOS_PATH"
aws s3 cp --recursive $TEST_VIDEOS_PATH $S3_BUCKET_PATH/$TEST_RUN_BUCKET_PATH/videos --acl public-read
echo "Uploaded"

#GENERATE ATTACHMENTS FOR ENLIL DOCUMENT
declare -a ATTACHMENTS_FOR_DOCUMENT
ZIPPED_REPORT_ATTACHMENT=$(curl -X POST "https://api.dev.enlil.io/api/v1/attachments/external" -H "accept: application/json" -H "Authorization: apitoken 5db418b5-1599-4533-b677-25abfd2956a0:92662461-e204-4ad2-ba02-ccc6daf1fc13" -H "Content-Type: application/json" -d "
{
   \"name\": \"test report\",
   \"type\": \"zip\",
   \"s3link\": \"$ZIPPED_REPORT_S3\",
   \"description\": \"test report\",
   \"isCleanCopyRequired\": false,
   \"lineType\": \"CLEAN_COPY\"
}")
ATTACHMENTS_FOR_DOCUMENT+=$ZIPPED_REPORT_ATTACHMENT,
VIDEOS=$(find videos -type f)

filterNameFromPath () {
  FILE_NAME=null
  while IFS='/' read -ra ADDR; do
    for i in "${ADDR[@]}"; do
        FILE_NAME=$i
    done
  done <<< "$1"
}

for VIDEO in ${VIDEOS[@]}
do
  FILE_NAME=null
  filterNameFromPath $VIDEO
  ENLIL_ATTACHMENT=$(curl -X POST "https://api.dev.enlil.io/api/v1/attachments/external" -H "accept: application/json" -H "Authorization: apitoken 5db418b5-1599-4533-b677-25abfd2956a0:92662461-e204-4ad2-ba02-ccc6daf1fc13" -H "Content-Type: application/json" -d "
  { \"name\": \"$FILE_NAME\",
    \"type\": \"mp4\",
    \"s3link\": \"/$TEST_RUN_BUCKET_PATH/$VIDEO\",
    \"description\": \"test report\",
    \"isCleanCopyRequired\": false,
    \"lineType\": \"CLEAN_COPY\"
  }")
  ATTACHMENTS_FOR_DOCUMENT+=$ENLIL_ATTACHMENT,
  echo $TEST_RUN_BUCKET_PATH/$VIDEO
done

#CREATE DOCUMENT WITH ATTACHMENT
echo "
{ 
  \"description\": \"<p>Cypress test report test</p>\",
  \"name\": \"Cypress test report\",
  \"attachments\": [ ${ATTACHMENTS_FOR_DOCUMENT%?} ],
  \"referenceTo\": [],
  \"revisionStage\": 1,
  \"revisionChangeType\": \"NEXT_REVISION\",
  \"retrain\": false,
  \"document\": { 
    \"docId\": \"CTR00013\",
    \"securityList\": 
    { 
      \"securityEmployees\": [],
      \"securityGroups\": [ 
        { 
        \"id\": \"4414cdad-8763-4da1-b6a1-6cebb674259e\"
        } ], 
        \"operators\": [] 
    }, 
    \"documentType\": 
    { 
      \"id\": \"57e1a2a8-025f-4955-aee1-4d8e30907d34\"
    } 
  }
}"

curl -X POST "https://api.dev.enlil.io/api/v1/document_revisions/external" -H "accept: application/json" -H "Authorization: apitoken 5db418b5-1599-4533-b677-25abfd2956a0:92662461-e204-4ad2-ba02-ccc6daf1fc13" -H "Content-Type: application/json" -d "
{ 
  \"description\": \"<p>Cypress test report test</p>\",
  \"name\": \"Cypress test report\",
  \"attachments\": [ ${ATTACHMENTS_FOR_DOCUMENT%?} ],
  \"referenceTo\": [],
  \"revisionStage\": 1,
  \"revisionChangeType\": \"NEXT_REVISION\",
  \"retrain\": false,
  \"document\": { 
    \"docId\": \"CTR00013\",
    \"securityList\": 
    { 
      \"securityEmployees\": [],
      \"securityGroups\": [ 
        { 
        \"id\": \"4414cdad-8763-4da1-b6a1-6cebb674259e\"
        } ], 
        \"operators\": [] 
    }, 
    \"documentType\": 
    { 
      \"id\": \"57e1a2a8-025f-4955-aee1-4d8e30907d34\"
    } 
  }
}"
echo "Done"