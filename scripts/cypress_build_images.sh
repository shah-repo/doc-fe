#!/bin/bash
set -e
export FE_GIT_COMMIT_HASH=$(git rev-parse HEAD 2> /dev/null |  cut -c1-8)

export REACT_APP_API_ENDPOINT="http://localhost:4211/api"
export REACT_APP_REFRESH_TOKEN_VALIDITY_DAYS="30"
export REACT_APP_AWS_COGNITO_CLIENT_ID="5ts2oghmmo5bv2hik76b9rt8of"
export REACT_APP_FRONTEND_URL="http://localhost:4212"
export REACT_APP_SIGNUP_DOMAIN_URL="https://shifamed-doc-develop.auth.us-west-2.amazoncognito.com"
export BROWSER="none"
export PORT="4212"
export REACT_APP_THEME="DEV_THEME"
export NODE_ENV="production"

docker build \
  -f docker/cypress_web.Dockerfile \
  -t enlil/cypress_web:$FE_GIT_COMMIT_HASH \
  --build-arg REACT_APP_API_ENDPOINT \
  --build-arg REACT_APP_REFRESH_TOKEN_VALIDITY_DAYS \
  --build-arg REACT_APP_AWS_COGNITO_CLIENT_ID \
  --build-arg REACT_APP_FRONTEND_URL \
  --build-arg REACT_APP_SIGNUP_DOMAIN_URL \
  --build-arg BROWSER \
  --build-arg PORT \
  --build-arg REACT_APP_THEME \
  --build-arg NODE_ENV \
   .
