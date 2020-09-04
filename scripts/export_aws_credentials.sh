#!/bin/bash

CREDENTIALS_JSON=$(aws sts get-session-token --profile $1 --serial-number $2 --token-code $3)

export AWS_ACCESS_KEY_ID=$(echo $CREDENTIALS_JSON | jq '.Credentials.AccessKeyId' | sed -e 's/^"//' -e 's/"$//')
export AWS_SECRET_ACCESS_KEY=$(echo $CREDENTIALS_JSON | jq '.Credentials.SecretAccessKey' | sed -e 's/^"//' -e 's/"$//')
export AWS_SESSION_TOKEN=$(echo $CREDENTIALS_JSON | jq '.Credentials.SessionToken' | sed -e 's/^"//' -e 's/"$//')
