#!/bin/bash

STATE=$1
GH_OWNER=$2
GH_REPO=$3
GH_TOKEN=$4
COMMIT_HASH=$5
TARGET_URL=$6
JOB_ID=$7
STATE_STRING="success"

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

CMD="curl -X 'POST' 'https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/statuses/${COMMIT_HASH}' \
		  -H 'Authorization: token <token>' \
		  -H 'Content-Type: application/json' \
		  -d $'{ 
		    	\"target_url\": \"${TARGET_URL}\",
		    	\"state\": \"${STATE_STRING}\",
		  		\"description\": \"From ${GH_REPO} codepipeline on AWS\",
		  		\"context\": \"aws/codepipeline/${JOB_ID}\"
			  }'"
echo "$CMD"

RESPONSE=$(curl -X "POST" "https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/statuses/${COMMIT_HASH}" \
		  		-H "Authorization: token ${GH_TOKEN}" \
		  		-H "Content-Type: application/json" \
		  		-d $"{ 
		    			\"target_url\": \"${TARGET_URL}\",
		    			\"state\": \"${STATE_STRING}\",
		  				\"description\": \"From ${GH_REPO} codepipeline on AWS\",
		  				\"context\": \"aws/codepipeline/${JOB_ID}\"
			  		}")
echo "$RESPONSE"