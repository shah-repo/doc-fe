#!/bin/bash
set -e

ENV=$1

case "$ENV" in

"DEV")  
  export CYPRESS_BE_URL="https://api.dev.enlil.io"
  export CYPRESS_FE_URL="https://dev.enlil.io"
  export CYPRESS_SUPERADMIN_EMAIL="zoran.kovacevic+admin@codecons.com"
  export CYPRESS_SUPERADMIN_PASSWORD="Tester1!"
  ;;
"DEMO")  
  export CYPRESS_BE_URL="https://api.demo.enlil.io"
  export CYPRESS_FE_URL="https://demo.enlil.io"
  export CYPRESS_SUPERADMIN_EMAIL="zoran.kovacevic+admin@codecons.com"
  export CYPRESS_SUPERADMIN_PASSWORD="Tester1!"
  ;;
"SANDBOX")  
  export CYPRESS_BE_URL="https://api.sandbox.enlil.io"
  export CYPRESS_FE_URL="https://sandbox.enlil.io"
  export CYPRESS_SUPERADMIN_EMAIL="zoran.kovacevic+admin@codecons.com"
  export CYPRESS_SUPERADMIN_PASSWORD="Tester123!sandbox"
  ;;
"PROD") 
  export CYPRESS_BE_URL="https://api.enlil.io"
  export CYPRESS_FE_URL="https://enlil.io"
  export CYPRESS_SUPERADMIN_EMAIL="zoran.kovacevic+admin@codecons.com"
  export CYPRESS_SUPERADMIN_PASSWORD=$CY_SUPERADMIN_PASSWORD_PROD
  ;;
"PROD2")  
  export CYPRESS_BE_URL="https://api.prod2.enlil.io"
  export CYPRESS_FE_URL="https://prod2.enlil.io"
  export CYPRESS_SUPERADMIN_EMAIL="zoran.kovacevic+admin@codecons.com"
  export CYPRESS_SUPERADMIN_PASSWORD="Tester1!"
  ;;
"CODEBUILD")  
  export CYPRESS_BE_URL="http://backend:80"
  export CYPRESS_FE_URL="http://frontend:5602"
  export CYPRESS_SUPERADMIN_EMAIL="zoran.kovacevic+admin@codecons.com"
  export CYPRESS_SUPERADMIN_PASSWORD="Tester1!"
  ;;
*) 
  echo "unknwon environment, exiting"
  exit 1;
  ;;
esac

export CI_BUILD_ID="some_ci_build_id"
export CYPRESS_KONFIG_ENV="development"
export NODE_ENV="development"
export CYPRESS_BROWSER="chrome"
export NUMBER_OF_WORKERS="3"
export CYPRESS_INTEGRATION_FOLDER="cypress/integration"
export CYPRESS_SKIP_ON_RUN_FAILURE="true"
export CYPRESS_TAKE_SCREENSHOT_AFTER_EACH="false"
export CYPRESS_SCREENSHOT_OF_RUN_FAILURE="true"
export CYPRESS_VIDEO=${CYPRESS_VIDEO:-"false"}
export PIPELINE_STEP_NUMBER=${BITBUCKET_PARALLEL_STEP:-1}
export PIPELINE_TOTAL_NUMBER_OF_STEPS=${BITBUCKET_PARALLEL_STEP_COUNT:-1}
export REPORT_TITLE="generated_specs${PIPELINE_STEP_NUMBER}"
export CYPRESS_ARROW_DURATION=40

export DIR_JSON="test-results/$CI_BUILD_ID/json"
export DIR_JUNIT="test-results/$CI_BUILD_ID/junit"
export DIR_REPORTS="test-results/$CI_BUILD_ID/reports"
export DIR_SCREENSHOTS_REPORT="test-results/$CI_BUILD_ID/reports/screenshots"
export DIR_VIDEOS_REPORT="test-results/$CI_BUILD_ID/reports/videos"

export CYPRESS_VIDEOS_FOLDER=$DIR_VIDEOS_REPORT
export CYPRESS_SCREENSHOTS_FOLDER=$DIR_SCREENSHOTS_REPORT
export CYPRESS_SCREENSHOTS_DIR=$DIR_SCREENSHOTS_REPORT
export CYPRESS_RUN_ENVIRONMENT="SCHEDULEDPIPELINE"
export CYPRESS_JSON_REPORTS_FOLDER=$DIR_JSON

export CYPRESS_TEST_EMAIL="enlil.testmail@gmail.com"
export CYPRESS_TEST_EMAIL_PASSWORD="shifamed123"
export CYPRESS_BASE_URL=$CYPRESS_FE_URL

cat <<EOF > ./cypress-reporter-config.json
{
  "reporterEnabled": "mochawesome, mocha-junit-reporter",
  "mochaJunitReporterReporterOptions": {
    "mochaFile": "test-results/$CI_BUILD_ID/json/junit/results-[hash].xml",
    "testsuitesTitle": true,
    "jenkinsMode": true,
    "useFullSuiteTitle": true
  },
  "mochawesomeReporterOptions": {
    "reportDir": "$DIR_JSON",
    "overwrite": false,
    "html": false,
    "json": true,
    "reportFilename": "$REPORT_TITLE"
  }
}
EOF

cat <<EOF > ./cypress/cache/merged_specs.json
{
  "results": []
}
EOF
