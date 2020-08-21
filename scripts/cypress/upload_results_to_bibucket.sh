#!/bin/bash
CREDENTIALS_JSON=$(aws sts get-session-token --profile $1 --serial-number $2 --token-code $3)
NAME="Luka Stosic"
BB_USER="stosicluka"
BE_REPO_NAME="doc-be" 

export AWS_ACCESS_KEY_ID=$(echo $CREDENTIALS_JSON | jq '.Credentials.AccessKeyId' | sed -e 's/^"//' -e 's/"$//')
export AWS_SECRET_ACCESS_KEY=$(echo $CREDENTIALS_JSON | jq '.Credentials.SecretAccessKey' | sed -e 's/^"//' -e 's/"$//')
export AWS_SESSION_TOKEN=$(echo $CREDENTIALS_JSON | jq '.Credentials.SessionToken' | sed -e 's/^"//' -e 's/"$//')

BE_REPO_LOCAL="/home/luka/be_project/doc-be"
FE_REPO_LOCAL="/home/luka/be_project/doc-fe"
VALIDATORS_REPO_LOCAL="/home/luka/be_project/remote-js-validators"

export BE_GIT_COMMIT_HASH=$(cd $BE_REPO_LOCAL;git rev-parse HEAD | cut -c1-8)
export FE_GIT_COMMIT_HASH=$(cd $FE_REPO_LOCAL;git rev-parse HEAD | cut -c1-8)
export VALIDATORS_GIT_COMMIT_HASH=$(cd $VALIDATORS_REPO_LOCAL;git rev-parse HEAD | cut -c1-8)

# Read Password
echo "AWS PROFILE $1"
echo "AWS SERIAL NUMBER $2"
echo "NAME: $NAME"
echo "BB_USER: $BB_USER"
echo "REPO_NAME: $BE_REPO_NAME"
echo "BE_REPO COMMIT: $BE_GIT_COMMIT_HASH"
echo "FE_REPO COMMIT: $FE_GIT_COMMIT_HASH"
echo "REMOTE_JS_VALIDATOR_REPO COMMIT: $VALIDATORS_GIT_COMMIT_HASH"
echo -n Password: 
read -s password
echo ""

LATEST_REPORT_FOLDER=$(ls -t ./results/ | head -1)
ZIP_FILE=./results/$(date +%F).zip
zip -r $ZIP_FILE ./results/$LATEST_REPORT_FOLDER
S3_BUCKET_LINK=s3://doc-be-dev-public/$(uuidgen)/$LATEST_REPORT_FOLDER 
aws s3 cp $ZIP_FILE $S3_BUCKET_LINK --acl public-read

curl --request PUT https://api.bitbucket.org/2.0/repositories/shifamed/$BE_REPO_NAME/commit/$BE_GIT_COMMIT_HASH/reports/cypress_resultsLuka \
  -u $BB_USER:$password \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "title": "Cypress results ",
    "details": "Uploaded by: '"$NAME"'",
    "report_type": "TEST",
    "reporter": "'"$NAME"'",
    "link": '"$S3_BUCKET_LINK"',
    "result": "FAILED"
  }'