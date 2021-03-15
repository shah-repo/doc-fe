#!/bin/bash
set -e

export CI_BUILD_ID="some_ci_build_id"
export NODE_ENV="development"
export CYPRESS_KONFIG_ENV="development"
export CYPRESS_BROWSER="chrome"
export NUMBER_OF_WORKERS="3"
export REPORT_TITLE="generated_specs"
export CYPRESS_INTEGRATION_FOLDER="cypress/integration"
export CYPRESS_SKIP_ON_RUN_FAILURE="true"
export CYPRESS_TAKE_SCREENSHOT_AFTER_EACH="false"
export CYPRESS_SCREENSHOT_OF_RUN_FAILURE="true"
export CYPRESS_VIDEO="false"
export CYPRESS_ARROW_DURATION=40

export DIR_JSON="test-results/$CI_BUILD_ID/json"
export DIR_JUNIT="test-results/$CI_BUILD_ID/junit"
export DIR_REPORTS="test-results/$CI_BUILD_ID/reports"
export DIR_SCREENSHOTS_REPORT="test-results/$CI_BUILD_ID/reports/screenshots"
export DIR_VIDEOS_REPORT="test-results/$CI_BUILD_ID/reports/videos"

export CYPRESS_VIDEOS_FOLDER=$DIR_VIDEOS_REPORT
export CYPRESS_SCREENSHOTS_FOLDER=$DIR_SCREENSHOTS_REPORT
export CYPRESS_SCREENSHOTS_DIR=$DIR_SCREENSHOTS_REPORT
export CYPRESS_RUN_ENVIRONMENT="PIPELINE"
export CYPRESS_JSON_REPORTS_FOLDER=$DIR_JSON

export CYPRESS_TEST_EMAIL="enlil.testmail@gmail.com"
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
