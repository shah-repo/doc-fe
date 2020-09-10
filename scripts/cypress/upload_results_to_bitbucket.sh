#!/bin/bash

source ./scripts/cypress/env_vars_for_compose.sh
source ./scripts/cypress/make_results_dir.sh
source ./scripts/cypress/platform_specific_variables.sh

if [[ -z "${CI_BUILD_ID}" ]]; then
  echo "CI_BUILD_ID not set, exiting"
  exit 1
fi

if [[ -z "${DIR_REPORTS}" ]]; then
  echo "DIR_REPORTS not set, exiting"
  exit 1
fi

if [[ -z "${BE_REPO}" ]]; then
  echo "BE_REPO not set, exiting"
  exit 1
fi

if [[ -z "${FE_REPO}" ]]; then
  echo "FE_REPO not set, exiting"
  exit 1
fi

if [[ -z "${VALIDATORS_REPO}" ]]; then
  echo "VALIDATORS_REPO not set, exiting"
  exit 1
fi

if [[ -z "${NAME}" ]]; then
  echo "NAME not set, exiting"
  exit 1
fi

if [[ -z "${BB_USER}" ]]; then
  echo "BB_USER not set, exiting"
  exit 1
fi

if [[ -z "${BE_REPO_NAME}" ]]; then
  echo "BE_REPO_NAME not set, exiting"
  exit 1
fi

if [[ -z "${FE_REPO_NAME}" ]]; then
  echo "FE_REPO_NAME not set, exiting"
  exit 1
fi

if [[ -z "${VALIDATORS_REPO_NAME}" ]]; then
  echo "VALIDATORS_REPO_NAME not set, exiting"
  exit 1
fi

if [[ -z "${S3_BUCKET}" ]]; then
  echo "S3_BUCKET not set, exiting"
  exit 1
fi

if [[ -z "${DATE_ISO_DEFAULT}" ]]; then
  echo "DATE_ISO_DEFAULT not set, exiting"
  exit 1
fi

if [[ -z "${AWS_ACCESS_KEY_ID}" ]]; then
  echo "AWS_ACCESS_KEY_ID not set, exiting"
  echo "Use ./scripts/export_aws_credentials.sh"
  exit
fi

if [[ -z "${AWS_SECRET_ACCESS_KEY}" ]]; then
  echo "AWS_SECRET_ACCESS_KEY not set, exiting"
  echo "Use ./scripts/export_aws_credentials.sh"
  exit
fi

if [[ -z "${AWS_SESSION_TOKEN}" ]]; then
  echo "AWS_SESSION_TOKEN not set, exiting"
  echo "Use ./scripts/export_aws_credentials.sh"
  exit
fi

export BE_GIT_COMMIT_HASH=$(cd $BE_REPO;git rev-parse HEAD)
export FE_GIT_COMMIT_HASH=$(cd $FE_REPO;git rev-parse HEAD)
export VALIDATORS_GIT_COMMIT_HASH=$(cd $VALIDATORS_REPO;git rev-parse HEAD)

export BE_GIT_BRANCH_NAME=$(cd $BE_REPO;git branch 2> /dev/null | sed -e '/^[^*]/d' -e 's/* \(.*\)/ \1/')
export FE_GIT_BRANCH_NAME=$(cd $FE_REPO;git branch 2> /dev/null | sed -e '/^[^*]/d' -e 's/* \(.*\)/ \1/')
export VALIDATORS_GIT_BRANCH_NAME=$(cd $VALIDATORS_REPO;git branch 2> /dev/null | sed -e '/^[^*]/d' -e 's/* \(.*\)/ \1/')

echo "--| NAME: $NAME"
echo "--| BB_USER: $BB_USER"
echo "--| Backend $BE_GIT_BRANCH_NAME $BE_GIT_COMMIT_HASH"
echo "--| Frontend $FE_GIT_BRANCH_NAME $FE_GIT_COMMIT_HASH"
echo "--| RemoteJS $VALIDATORS_GIT_BRANCH_NAME $VALIDATORS_GIT_COMMIT_HASH"
echo "--| CI_BUILD_ID $CI_BUILD_ID"
echo ""
echo -n BitBucket Password: 
read -s password
echo ""

# parse merged specs to check result status
if [ ! -f $DIR_JSON/merged.json ]; then
    return "NOT FOUND merged.json file in last report folder!"
fi

MERGED_JSON_FAILURES=$(jq '.stats.failures' $DIR_JSON/merged.json)
MERGED_JSON_PASSES=$(jq '.stats.passes' $DIR_JSON/merged.json)
MERGED_JSON_PENDING=$(jq '.stats.pending' $DIR_JSON/merged.json)
MERGED_JSON_SKIPPED=$(jq '.stats.skipped' $DIR_JSON/merged.json)
MERGED_JSON_TOTAL=$(jq '.stats.tests' $DIR_JSON/merged.json)

if [ "$MERGED_JSON_FAILURES" != "0" ]; then
  RESULT="FAILED"
else
  RESULT="PASSED"
fi

GENERATED_UUID=$(uuidgen)
ZIP_FILE_NAME=Report_$CI_BUILD_ID_$GENERATED_UUID.zip
ZIP_FILE_NAME_PATH="results/$ZIP_FILE_NAME"
S3_BUCKET_FOLDER=s3://$S3_BUCKET/cypress-reports
echo ""
echo "--| Creating zip file $ZIP_FILE_NAME_PATH"
zip -r ./$ZIP_FILE_NAME_PATH $DIR_REPORTS

echo ""
echo "--| Uploading to S3 $ZIP_FILE_NAME_PATH"
aws s3 cp ./$ZIP_FILE_NAME_PATH $S3_BUCKET_FOLDER/$ZIP_FILE_NAME --acl public-read
OBJECT_URL=https://$S3_BUCKET.s3-us-west-2.amazonaws.com/cypress-reports/$ZIP_FILE_NAME

prepend() { while read line; do echo "${1}${line}"; done; }

attach_to_bitbucket() {
  echo ""
  echo "--| Attaching report in $1"
    curl \
    --request PUT https://api.bitbucket.org/2.0/repositories/shifamed/$1/commit/$2/reports/cypress-results-$BE_GIT_COMMIT_HASH-$FE_GIT_COMMIT_HASH-$VALIDATORS_GIT_COMMIT_HASH \
    --user $BB_USER:$password \
    --header 'Content-Type: application/json' \
    --data-raw '{
      "title": "Cypress results",
      "details": "Uploaded by: '"$NAME"'",
      "report_type": "TEST",
      "reporter": "'"$NAME"'",
      "link": "'"$OBJECT_URL"'",
      "result": "'"$RESULT"'",
      "data": [
        {
          "title": "Backend Branch",
          "type": "TEXT",
          "value": "'"$BE_GIT_BRANCH_NAME"'"
        },
        {
          "title": "Backend Commit",
          "type": "TEXT",
          "value": "'"$(echo $BE_GIT_COMMIT_HASH | cut -c1-8)"'"
        },
        {
          "title": "Frontend Branch",
          "type": "TEXT",
          "value": "'"$FE_GIT_BRANCH_NAME"'"
        },
        {
          "title": "Frontend Commit",
          "type": "TEXT",
          "value": "'"$(echo $FE_GIT_COMMIT_HASH | cut -c1-8)"'"
        },
        {
          "title": "Validators Branch",
          "type": "TEXT",
          "value": "'"$VALIDATORS_GIT_BRANCH_NAME"'"
        },
        {
          "title": "Validators Commit",
          "type": "TEXT",
          "value": "'"$(echo $VALIDATORS_GIT_COMMIT_HASH | cut -c1-8)"'"
        },
        {
          "title": "Number of test steps",
          "type": "TEXT",
          "value": "'"$MERGED_JSON_TOTAL"'"
        },
        {
          "title": "Passes",
          "type": "TEXT",
          "value": "'"$MERGED_JSON_PASSES"'"
        },
        {
          "title": "Failures",
          "type": "TEXT",
          "value": "'"$MERGED_JSON_FAILURES"'"
        },
        {
          "title": "Uploaded",
          "type": "TEXT",
          "value": "'"$DATE_ISO_DEFAULT"'"
        }
      ]
    }'

  echo ""
}

attach_to_bitbucket $BE_REPO_NAME $BE_GIT_COMMIT_HASH
attach_to_bitbucket $FE_REPO_NAME $FE_GIT_COMMIT_HASH
attach_to_bitbucket $VALIDATORS_REPO_NAME $VALIDATORS_GIT_COMMIT_HASH

rm ./$ZIP_FILE_NAME_PATH
echo ""
echo "--| DONE"
