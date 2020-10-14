#!/bin/bash

  PROFILE_NAME=shifamed-temp
  CREDENTIALS_JSON=$(aws sts get-session-token --profile $1 --serial-number $2 --token-code $3)
  AWS_ACCESS_KEY_ID=$(echo $CREDENTIALS_JSON | jq '.Credentials.AccessKeyId' | sed -e 's/^"//' -e 's/"$//')
  AWS_SECRET_ACCESS_KEY=$(echo $CREDENTIALS_JSON | jq '.Credentials.SecretAccessKey' | sed -e 's/^"//' -e 's/"$//')
  AWS_SESSION_TOKEN=$(echo $CREDENTIALS_JSON | jq '.Credentials.SessionToken' | sed -e 's/^"//' -e 's/"$//')

  aws configure set --profile $PROFILE_NAME aws_access_key_id $AWS_ACCESS_KEY_ID
  aws configure set --profile $PROFILE_NAME aws_secret_access_key $AWS_SECRET_ACCESS_KEY
  aws configure set --profile $PROFILE_NAME aws_session_token $AWS_SESSION_TOKEN
  aws configure set --profile $PROFILE_NAME region us-west-2


