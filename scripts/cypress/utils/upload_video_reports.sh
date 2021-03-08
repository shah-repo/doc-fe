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

#COMPANY VARIABLES
COMPANY_ID="9ecbda7d-811a-435f-adf1-3515b19aca87"
USER_API_TOKEN="apitoken 1059b288-6f88-4ba0-a3a7-95f380513783:4dc019ef-e1cc-40cb-a39c-186b3bb88b40"
ID_OF_GROUP_EVERYONE="cf0ffbbe-1dff-4676-86d2-c54d9333dcc9"
ID_OF_CYPRESS_TEST_REPORT_DOCTYPE="cb8be6f4-9e09-4c9a-831e-43eda1007b2a"

#Move videos so they don't get zipped
mv $DIR_VIDEOS_REPORT ./ 

#ZIP TEST REPORT
DATE=$(date "+%Y-%m-%dT%H-%M-%S%z")
TEST_RUN_BUCKET_PATH=$COMPANY_ID/cypress-reports-pipeline/$DATE
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
ZIPPED_REPORT_ATTACHMENT=$(curl -X POST "https://api.dev.enlil.io/api/v1/attachments/external" -H "accept: application/json" -H "Authorization: $USER_API_TOKEN" -H "Content-Type: application/json" -d "
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
  ENLIL_ATTACHMENT=$(curl -X POST "https://api.dev.enlil.io/api/v1/attachments/external" -H "accept: application/json" -H "Authorization: $USER_API_TOKEN" -H "Content-Type: application/json" -d "
  { \"name\": \"$FILE_NAME\",
    \"type\": \"mp4\",
    \"s3link\": \"$TEST_RUN_BUCKET_PATH/$VIDEO\",
    \"description\": \"test report\",
    \"isCleanCopyRequired\": false,
    \"lineType\": \"CLEAN_COPY\"
  }")
  ATTACHMENTS_FOR_DOCUMENT+=$ENLIL_ATTACHMENT,
  echo $TEST_RUN_BUCKET_PATH/$VIDEO
done

#CREATE DOCUMENT WITH ATTACHMENT
curl -X POST "https://api.dev.enlil.io/api/v1/document_revisions/external" -H "accept: application/json" -H "Authorization: $USER_API_TOKEN" -H "Content-Type: application/json" -d "
{ 
  \"description\": \"<p>Cypress test report test</p>\",
  \"name\": \"Cypress test report\",
  \"attachments\": [ ${ATTACHMENTS_FOR_DOCUMENT%?} ],
  \"referenceTo\": [],
  \"revisionStage\": 1,
  \"revisionChangeType\": \"NEXT_REVISION\",
  \"retrain\": false,
  \"document\": { 
    \"docId\": \"CTR-00001\",
    \"securityList\": 
    { 
      \"securityEmployees\": [],
      \"securityGroups\": [ 
        { 
        \"id\": \"$ID_OF_GROUP_EVERYONE\"
        } ], 
        \"operators\": [] 
    }, 
    \"documentType\": 
    { 
      \"id\": \"$ID_OF_CYPRESS_TEST_REPORT_DOCTYPE\"
    } 
  }
}"
echo "Done"