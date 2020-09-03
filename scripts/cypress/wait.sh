#!/bin/bash
set -e

until $(curl --output /dev/null --silent --head --fail http://localhost:5601/api/v1/healthcheck); do
    printf '.'
    sleep 5
done

until $(curl --output /dev/null --silent --head --fail http://localhost:5602); do
    printf '.'
    sleep 5
done

. ./scripts/cypress/generate_ci_build_id.sh

yarn install --frozen-lockfile 
./scripts/cypress/run_in_parallel.sh
./scripts/cypress/run_in_parallel.sh
./scripts/cypress/run_in_parallel.sh
./scripts/cypress/run_in_parallel.sh
firefox results/$CI_BUILD_ID/reports/result.html &
