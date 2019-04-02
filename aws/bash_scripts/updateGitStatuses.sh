#!/bin/bash
set -e

STATE="$1"
GH_OWNER="${GH_OWNER}" 
GH_REPO="${GH_REPO}"
GH_TOKEN="${GH_TOKEN}"
COMMIT_HASH="${CODEBUILD_RESOLVED_SOURCE_VERSION}"
TARGET_URL="${TARGET_URL}"
JOB_ID="${CODEBUILD_BUILD_ID}"
STATE_STRING="success"
TEST_DESC="$2"

if [[ -z "$STATE" && -z "$GH_OWNER" && -z "$GH_REPO" && -z "$GH_TOKEN" && -z "$COMMIT_HASH" && -z "$TARGET_URL" && -z "$JOB_ID" ]]; then
	echo "Required variables are not set."
	exit 1
fi

echo "Job Id: ${JOB_ID}"
echo "State: ${STATE}"
echo "Owner: ${GH_OWNER}"
echo "Repo: ${GH_REPO}"
echo "Commit Hash: ${COMMIT_HASH}"
echo "Target URL: ${TARGET_URL}"

if [ "$STATE" = 0 ]; then
	STATE_STRING="failed"
else 
	STATE_STRING="success"
fi 

RESPONSE=$(curl -X "POST" "https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/statuses/${COMMIT_HASH}" \
		  		-H "Authorization: token ${GH_TOKEN}" \
		  		-H "Content-Type: application/json" \
		  		-d $"{ 
		    			\"target_url\": \"${TARGET_URL}\",
		    			\"state\": \"${STATE_STRING}\",
		  				\"description\": \"From ${GH_REPO} codepipeline on AWS - ${TEST_DESC}\",
		  				\"context\": \"${TEST_DESC}\"
			  		}")
echo "$RESPONSE"