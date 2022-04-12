#!/bin/bash

if [[ -z "${CYPRESS_BE_URL}" ]]; then
  echo "CYPRESS_BE_URL not set, exiting"
  exit 1
fi

if [[ -z "${CYPRESS_FE_URL}" ]]; then
  echo "CYPRESS_FE_URL not set, exiting"
  exit 1
fi

echo "CYPRESS_FE_URL $CYPRESS_FE_URL"
echo "CYPRESS_BE_URL $CYPRESS_BE_URL"

echo 'Waiting for frontend .'
until $(curl --output /dev/null --silent --head --fail $CYPRESS_FE_URL); do
    echo 'Waiting for frontend .'
    sleep 2
done

echo 'Waiting for backend .'
until [ $(curl -o /dev/null -s -w %{http_code} $CYPRESS_BE_URL/api/v1/healthcheck/) = 200 ]; do
    echo 'Waiting for backend .'
    docker ps
    sleep 2
done
echo ""

echo ""
