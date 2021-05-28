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
CHANNEL=C022K3F7CAK

#BITBUCKET_INFO
BITBUCKET_PIPELINE_LINK="https://bitbucket.org/shifamed/doc-fe/addon/pipelines/home#!/results/$BITBUCKET_BUILD_NUMBER"
START_TIMESTAMP=$(jq '.startTime' $DIR_REPORTS/start_time.json | tr -d '"')
echo $START_TIMESTAMP

#TEST_REPORT_INFO
NUMBER_OF_FAILS=$(jq '.stats.failures' ./$DIR_REPORTS/result.json)
NUMBER_OF_SUITES=$(jq '.stats.suites' ./$DIR_REPORTS/result.json)

#COMMIT HASHES FROM TEST
CONTEXT=$(jq '.results[0].suites[0].tests[0].context' ./$DIR_JSON/generated_info.json)
i=0
for value in $CONTEXT
do
  if [[ $i == 5 ]]; then
    ENV=$value
  fi
  if [[ $i == 17 ]]; then
    FE_COMMIT=$value
  fi
  if [[ $i == 23 ]]; then
    BE_COMMIT=$value
  fi
  if [[ $i == 29 ]]; then
    REMOTE_JS_COMMIT=$value
  fi
  if [[ $i == 35 ]]; then
    FE_BRANCH=$value
  fi
  if [[ $i == 41 ]]; then
    BE_BRANCH=$value
  fi
  if [[ $i == 47 ]]; then
    REMOTE_JS_BRANCH=$value
  fi
  if [[ $i == 53 || $i == 54 || $i == 55 || $i == 56 ]]; then
    FE_DATE+=$value
  fi
  if [[ $i == 62 || $i == 63 || $i == 64 || $i == 65 ]]; then
    BE_DATE+=$value
  fi
  if [[ $i == 71 || $i == 72 || $i == 73 || $i == 74 ]]; then
    REMOTE_JS_DATE+=$value
  fi
  ((i+=1))
done

ENV=$(echo $ENV | cut -d'"' -f 2 )

FE_COMMIT=$(echo $FE_COMMIT | cut -c3-42)
FE_BRANCH=$(echo $FE_BRANCH | cut -d'"' -f 2 )
FE_DATE=$(echo $FE_DATE | cut -c3-28)

BE_COMMIT=$(echo $BE_COMMIT | cut -c3-42)
BE_BRANCH=$(echo $BE_BRANCH | cut -d'"' -f 2 )
BE_DATE=$(echo $BE_DATE | cut -c3-28)

REMOTE_JS_COMMIT=$(echo $REMOTE_JS_COMMIT | cut -c3-42)
REMOTE_JS_BRANCH=$(echo $REMOTE_JS_BRANCH | cut -d'"' -f 2 )
REMOTE_JS_DATE=$(echo $REMOTE_JS_DATE | cut -c3-28)

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
          *ENVIRONMENT* '${ENV%?}'
            • *FE_BRANCH:* '${FE_BRANCH%?}'
            • *FE_COMMIT:* '$FE_COMMIT'
            • *FE_DATE:* '$FE_DATE'

            • *BE_BRANCH:* '${BE_BRANCH%?}'
            • *BE_COMMIT:* '$BE_COMMIT'
            • *BE_DATE:* '$BE_DATE'

            • *REMOTE_JS_BRANCH:* '${REMOTE_JS_BRANCH%?}'
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