#!/bin/bash
set -e

source ./scripts/cypress/generate_ci_build_id.sh

export ENLIL_COMPOSE_PORT_RANGE_START=${ENLIL_COMPOSE_PORT_RANGE_START:-5600}
export ENLIL_COMPOSE_EXPOSE_DIRECTOR_PORT="$((ENLIL_COMPOSE_PORT_RANGE_START+6))"
export CYPRESS_INTEGRATION_FOLDER="cypress/test_company_replica/spec"
export CYPRESS_SCREENSHOTS_FOLDER=$DIR_SCREENSHOTS_REPORT
export CYPRESS_VIDEOS_FOLDER=$DIR_VIDEOS_REPORT
export CYPRESS_SCREENSHOT_OF_RUN_FAILURE="false"
export CYPRESS_TAKE_SCREENSHOT_AFTER_EACH="false"
export REPORT_TITLE="test_company_replica"
export CYPRESS_VIDEO="false"
export CYPRESS_SKIP_ON_RUN_FAILURE=${CYPRESS_SKIP_ON_RUN_FAILURE:-true}
export CYPRESS_ARROW_DURATION=40

export CYPRESS_SUPERADMIN_EMAIL=${CYPRESS_SUPERADMIN_EMAIL:-"zoran.kovacevic+admin@codecons.com"}
export CYPRESS_SUPERADMIN_PASSWORD=${CYPRESS_SUPERADMIN_PASSWORD:-"Tester1!"}
export COMPOSE_PROJECT_NAME="enlil_$ENLIL_COMPOSE_PORT_RANGE_START"
export ENLIL_COMPOSE_EXPOSE_BE_PORT="$((ENLIL_COMPOSE_PORT_RANGE_START+1))"
export ENLIL_COMPOSE_EXPOSE_FE_PORT="$((ENLIL_COMPOSE_PORT_RANGE_START+2))"
export CYPRESS_KONFIG_ENV="development"
export CYPRESS_BROWSER=${CYPRESS_BROWSER:-chrome}
export CYPRESS_CACHE_FOLDER="cypress/cache/cypressLib"

export CYPRESS_TEST_COMPANY_REPLICA_NAME=${CYPRESS_TEST_COMPANY_REPLICA_NAME:-"Test Company Replica "$((1 + RANDOM % 100000))}

echo $CYPRESS_TEST_COMPANY_REPLICA_NAME

PS3='Please select the environment where you want your company:'
options=("LOCAL" "DEV" "DEMO" "Quit")
select opt in "${options[@]}"
do
    echo "Selected $opt"
    case $opt in
        "LOCAL")
            echo "Creating replica on $opt"
            export CYPRESS_BE_URL=${CYPRESS_BE_URL:-"http://localhost:$ENLIL_COMPOSE_EXPOSE_BE_PORT"}
            export CYPRESS_FE_URL=${CYPRESS_FE_URL:-"http://localhost:$ENLIL_COMPOSE_EXPOSE_FE_PORT"}
            break
            ;;
        "DEV")
            echo "Creating replica on $opt"
            export CYPRESS_BE_URL="https://api.dev.enlil.io"
            export CYPRESS_FE_URL="https://dev.enlil.io"
            break
            ;;
        "DEMO")
            echo "Creating replica on $opt"
            export CYPRESS_BE_URL="https://api.demo.enlil.io"
            export CYPRESS_FE_URL="https://demo.enlil.io"
            break
            ;;
        "Quit")
            echo "Exiting"
            break
            ;;
        *) echo "invalid option $REPLY";;
    esac
done

mkdir -p $CYPRESS_CACHE_FOLDER
yarn install --frozen-lockfile
yarn cypress install
yarn cypress verify

./scripts/cypress/wait.sh

yarn cypress run \
  --parallel --record --key 9e6e4a3d-c43a-4e60-8984-fa2ae0a90a76 \
  --browser $CYPRESS_BROWSER \
  --headless \
  --ci-build-id "$CI_BUILD_ID"
 
echo "Test company replica name is: '$CYPRESS_TEST_COMPANY_REPLICA_NAME'"