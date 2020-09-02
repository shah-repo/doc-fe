#!/bin/bash
set -e

printf 'Waiting for backend .'
until $(curl --output /dev/null --silent --head --fail http://localhost:5601/api/v1/healthcheck); do
    printf '.'
    sleep 2
done
echo ""

printf 'Waiting for frontend .'
until $(curl --output /dev/null --silent --head --fail http://localhost:5602); do
    printf '.'
    sleep 2
done

echo ""
