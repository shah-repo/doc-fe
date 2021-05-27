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

#COMMIT HASHES FROM TEST
CONTEXT=$(jq '.results[0].suites[0].tests[0].context' ./$DIR_JSON/generated_specs0.json)
declare -a ARRAY_OF_CONTEXT_ITEMS
i=0
for value in $CONTEXT
do
  if [[ $i == 11 ]]; then
    FE_COMMIT=$value
  fi
  if [[ $i == 17 ]]; then
    BE_COMMIT=$value
  fi
  if [[ $i == 23 ]]; then
    REMOTE_JS_COMMIT=$value
  fi
  if [[ $i == 29 ]]; then
    FE_BRANCH=$value
  fi
  if [[ $i == 35 ]]; then
    BE_BRANCH=$value
  fi
  if [[ $i == 41 ]]; then
    REMOTE_JS_BRANCH=$value
  fi
  if [[ $i == 47 || $i == 48 || $i == 49 || $i == 50 ]]; then
    FE_DATE+=$value
  fi
  if [[ $i == 56 || $i == 57 || $i == 58 || $i == 59 ]]; then
    BE_DATE+=$value
  fi
  if [[ $i == 65 || $i == 66 || $i == 67 || $i == 68 ]]; then
    REMOTE_JS_DATE+=$value
  fi
  ((i+=1))
done
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

#UPLOAD REPROT TO SLACK AND GET LINK TO IT
UPLOADED_REPORT_LINK=$(curl \
  -X POST "https://slack.com/api/files.upload" \
  -H "content: multipart/form-data" \
  -H "Authorization: Bearer $SLACK_TOKEN" \
  -F "filename=test_report" \
  -F file=@$ZIP_FILE_NAME_PATH | jq '.file.permalink' | tr -d '"')

#POST MESSAGE TO SLACK
curl \
  -X POST "https://slack.com/api/chat.postMessage" \
  -H 'Content-type: application/json' \
  -H "Authorization: Bearer $SLACK_TOKEN" \
  --data '{
    "channel": "'"$CHANNEL"'",
    "text": "'"<$UPLOADED_REPORT_LINK| >"'",
    	"blocks": [
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "'"*CYPRESS TEST REPORT FROM PIPELINE*"'"
			}
		},
		{
			"type": "divider"
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "'"
        *ENVIRONMENT*\n
          • *FE_BRANCH:* ${FE_BRANCH%?}\n
          • *FE_COMMIT:* $FE_COMMIT\n
          • *FE_DATE:* $FE_DATE\n\n
          • *BE_BRANCH:* ${BE_BRANCH%?}\n
          • *BE_COMMIT:* $BE_COMMIT\n
          • *BE_DATE:* $BE_DATE\n\n
          • *REMOTE_JS_BRANCH:* ${REMOTE_JS_BRANCH%?}\n
          • *REMOTE_JS_COMMIT:* $REMOTE_JS_COMMIT\n
          • *REMOTE_JS_DATE:* $REMOTE_JS_DATE\n"'"
			}
		},
    {
			"type": "divider",
		},
    {
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "'"
        *<$BITBUCKET_PIPELINE_LINK|PIPELINE>*\n
          • *BUILD_NUMBER:* $BITBUCKET_BUILD_NUMBER\n
          • *START_TIMESTAMP:* $START_TIMESTAMP\n
          • *END_TIMESTAMP:* $END_TIMESTAMP"'"
      }
		},
    {
			"type": "divider",
		},
    {
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "'"
        *TEST INFO*\n
          • *TEST_STATUS:* $NUMBER_OF_FAILS/$NUMBER_OF_SUITES\n"'"
      }
		},
	]
  }'