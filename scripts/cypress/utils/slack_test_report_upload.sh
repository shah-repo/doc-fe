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

#SLACK_INFO
CHANNEL=C022R2A0N5U

#BITBUCKET_INFO
BITBUCKET_PIPELINE_LINK="https://bitbucket.org/shifamed/doc-fe/addon/pipelines/home#!/results/$BITBUCKET_BUILD_NUMBER"
START_TIMESTAMP=$(jq '.startTime' $DIR_REPORTS/start_time.json | tr -d '"')
echo $START_TIMESTAMP

#TEST_REPORT_INFO
NUMBER_OF_FAILS=$(jq '.stats.failures' ./$DIR_REPORTS/result.json)
NUMBER_OF_SUITES=$(jq '.stats.suites' ./$DIR_REPORTS/result.json)

#ENV INFO
ENV=$(jq '.env' ./$DIR_JSON/envInfo.json)

FE_COMMIT=$(jq '.feCommit' ./$DIR_JSON/envInfo.json)
FE_BRANCH=$(jq '.feBranch' ./$DIR_JSON/envInfo.json)
FE_DATE=$(jq '.feDate' ./$DIR_JSON/envInfo.json | tr -d '"' | tr -d ' ')

BE_COMMIT=$(jq '.beCommit' ./$DIR_JSON/envInfo.json)
BE_BRANCH=$(jq '.beBranch' ./$DIR_JSON/envInfo.json)
BE_DATE=$(jq '.beDate' ./$DIR_JSON/envInfo.json | tr -d '"' | tr -d ' ')

REMOTE_JS_COMMIT=$(jq '.remoteJSCommit' ./$DIR_JSON/envInfo.json)
REMOTE_JS_BRANCH=$(jq '.remoteJSBranch' ./$DIR_JSON/envInfo.json)
REMOTE_JS_DATE=$(jq '.remoteJSDate' ./$DIR_JSON/envInfo.json | tr -d '"' | tr -d ' ')

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

#UPLOAD REPROT TO SLACK AND POST IT
UPLOADED_REPORT_LINK=$(curl \
  -X POST "https://slack.com/api/files.upload" \
  -H "content: multipart/form-data" \
  -H "Authorization: Bearer $SLACK_TOKEN" \
  -F "filename=test_report" \
  -F 'initial_comment=
      *CYPRESS TEST REPORT FROM PIPELINE*
          *ENVIRONMENT* '${ENV}'
            • *FE_BRANCH:* '${FE_BRANCH}'
            • *FE_COMMIT:* '$FE_COMMIT'
            • *FE_DATE:* '${FE_DATE}'

            • *BE_BRANCH:* '${BE_BRANCH}'
            • *BE_COMMIT:* '$BE_COMMIT'
            • *BE_DATE:* '$BE_DATE'

            • *REMOTE_JS_BRANCH:* '${REMOTE_JS_BRANCH}'
            • *REMOTE_JS_COMMIT:* '$REMOTE_JS_COMMIT'
            • *REMOTE_JS_DATE:* '$REMOTE_JS_DATE'
            
          *<'$BITBUCKET_PIPELINE_LINK'|PIPELINE>*
            • *BUILD_NUMBER:* '$BITBUCKET_BUILD_NUMBER'
            • *START_TIMESTAMP:* '$START_TIMESTAMP'
            • *END_TIMESTAMP:* '$(date "+%Y-%m-%dT%H:%M:%S%z")'
            
          *TEST INFO*
            • *TEST_NUMBER:* '$NUMBER_OF_SUITES'
            • *PASSED_TEST_NUMBER:* '$(($NUMBER_OF_SUITES-$NUMBER_OF_FAILS))'
            • *FAILED_TEST_NUMBER:* '$NUMBER_OF_FAILS'' \
  -F "channels=$CHANNEL" \
  -F file=@$ZIP_FILE_NAME_PATH | jq '.file.permalink' | tr -d '"')