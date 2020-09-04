#!/bin/bash
set -e

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

printf 'Waiting for backend .'
until $(curl --output /dev/null --silent --head --fail $CYPRESS_BE_URL/api/v1/healthcheck); do
    printf '.'
    sleep 2
done
echo ""

printf 'Waiting for frontend .'
until $(curl --output /dev/null --silent --head --fail $CYPRESS_FE_URL); do
    printf '.'
    sleep 2
done

echo ""
