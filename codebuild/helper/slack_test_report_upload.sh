#!/bin/bash
set -e

if [ "$SLACK_CHANNELS" == "none" ]; then
	exit 0
fi

START_TIMESTAMP=$(date --date="@${CODEBUILD_START_TIME::-3}" +%c)
END_TIMESTAMP=$(date +%c)

#TEST_REPORT_INFO
NUMBER_OF_FAILS=$(jq '.stats.failures' ./$DIR_REPORTS/result.json)
NUMBER_OF_SUITES=$(jq '.stats.suites' ./$DIR_REPORTS/result.json)
NUMBER_OF_SUCCESSES=$(expr $NUMBER_OF_SUITES - $NUMBER_OF_FAILS)

#ZIP TEST REPORT
DIR_ZIP=zipcontent
mkdir -p $DIR_ZIP
cp -r $DIR_REPORTS $DIR_ZIP
rm -rf "$DIR_ZIP/downloads"
rm -rf "$DIR_ZIP/videos"
DATE=$(date "+%Y-%m-%dT%H-%M-%S%z")
DATE_REPORT=$(date "+%Y-%m-%d")
ZIP_FILE_NAME=REPORT_$DATE.zip
ZIP_FILE_NAME_PATH="./$ZIP_FILE_NAME"

echo "--| Creating zip file $ZIP_FILE_NAME_PATH"
zip -r $ZIP_FILE_NAME_PATH $DIR_ZIP
echo "Zipped"

# Send to slack
curl --verbose \
  -X POST "https://slack.com/api/files.upload" \
  -H "content: multipart/form-data" \
  -H "Authorization: Bearer $SLACK_TOKEN" \
  -F "filename=report_$DATE_REPORT" \
  -F "initial_comment= ****************
      Pipeline Name: $CODEBUILD_INITIATOR

      Started: $START_TIMESTAMP
      Finished: $END_TIMESTAMP

      :checkboard4: Number of tests: *$NUMBER_OF_SUITES*
      :heavy_check_mark: Successes: *$NUMBER_OF_SUCCESSES*
      :x: Failures: *$NUMBER_OF_FAILS*

      _Code_:
      * doc-be: <https://bitbucket.org/shifamed/doc-be/commits/$BE_GIT_COMMIT_HASH|$BE_GIT_COMMIT_HASH>
      * doc-fe: <https://bitbucket.org/shifamed/doc-fe/commits/$FE_GIT_COMMIT_HASH|$FE_GIT_COMMIT_HASH>
      * doc-export: <https://bitbucket.org/shifamed/doc-export/commits/$EXPORT_GIT_COMMIT_HASH|$EXPORT_GIT_COMMIT_HASH>
      * docx-to-pdf: <https://bitbucket.org/shifamed/docx-to-pdf/commits/$DOCXTOPDF_GIT_COMMIT_HASH|$DOCXTOPDF_GIT_COMMIT_HASH>
      * word-service: <https://bitbucket.org/shifamed/word-service/commits/$WORDSERVICE_GIT_COMMIT_HASH|$WORDSERVICE_GIT_COMMIT_HASH>
      * remote-js-validators: <https://bitbucket.org/shifamed/remote-js-validators/commits/$VALIDATORS_GIT_COMMIT_HASH|$VALIDATORS_GIT_COMMIT_HASH>" \
  -F "channels=$SLACK_CHANNELS" \
  -F file=@$ZIP_FILE_NAME_PATH

echo "Uploaded to slack"
