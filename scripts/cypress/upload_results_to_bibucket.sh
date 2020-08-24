#!/bin/bash
CREDENTIALS_JSON=$(aws sts get-session-token --profile $1 --serial-number $2 --token-code $3)
NAME="Luka Stosic"
BB_USER="stosicluka"
BE_REPO_NAME="doc-be"
S3_BUCKET="doc-be-dev-public"

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

LATEST_REPORT_FOLDER=$(ls -dt -- ./results/*/ | head -n1)
ZIP_FILE_NAME=$(date +%F).zip
GENERATED_UUID=$(uuidgen)
S3_BUCKET_LINK=s3://$S3_BUCKET/$GENERATED_UUID/$LATEST_REPORT_FOLDER 

zip -r ./results/$ZIP_FILE_NAME $LATEST_REPORT_FOLDER

aws s3 cp ./results/$ZIP_FILE_NAME $S3_BUCKET_LINK --acl public-read
OBJECT_URL=https://$S3_BUCKET.s3-us-west-2.amazonaws.com/$GENERATED_UUID/$ZIP_FILE_NAME

# parse merged specs to check result status
if [ ! -f $LATEST_REPORT_FOLDER/json/merged.json ]; then
    return "NOT FOUND merged.json file in last report folder!"
fi

MERGED_JSON_FAILURES=$(jq '.stats.failures' $LATEST_REPORT_FOLDER/json/merged.json)
# MERGED_JSON_PENDING=$(jq '.stats.pending' $LATEST_REPORT_FOLDER/json/merged.json)
if [ "$MERGED_JSON_FAILURES" != "0" ]; then
  RESULT="FAILED"
# elif [ "$MERGED_JSON_PENDING" != "0" ]; then 
#   RESULT="PENDING"
else
  RESULT="PASSED"
fi

echo $RESULT

COMMIT_HASH=( $BE_GIT_COMMIT_HASH $FE_GIT_COMMIT_HASH $VALIDATORS_GIT_COMMIT_HASH )

for COMMIT_HASH_BRANCH in "${COMMIT_HASH[@]}"
do
  curl -v --request PUT https://api.bitbucket.org/2.0/repositories/shifamed/$BE_REPO_NAME/commit/$COMMIT_HASH_BRANCH/reports/cypress_results \
    -u $BB_USER:$password \
    --header 'Content-Type: application/json' \
    --data-raw '{
      "title": "Cypress results",
      "details": "Uploaded by: '"$NAME"'",
      "report_type": "TEST",
      "reporter": "'"$NAME"'",
      "link": "'"$OBJECT_URL"'",
      "result": "'"$RESULT"'"
    }'  
done

rm ./results/$ZIP_FILE_NAME

