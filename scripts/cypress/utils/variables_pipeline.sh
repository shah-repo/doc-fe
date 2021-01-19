#!/bin/bash
set -e

export CI_BUILD_ID="some_ci_build_id"

export CYPRESS_KONFIG_ENV="development"
export CYPRESS_BROWSER="chrome"
export NUMBER_OF_WORKERS="6"
export REPORT_TITLE="generated_specs"
export CYPRESS_INTEGRATION_FOLDER="cypress/integration"
export CYPRESS_SKIP_ON_RUN_FAILURE="true"
export CYPRESS_TAKE_SCREENSHOT_AFTER_EACH="false"
export CYPRESS_SCREENSHOT_OF_RUN_FAILURE="true"
export CYPRESS_VIDEO="false"

export CYPRESS_SCREENSHOTS_FOLDER="test-results/$CI_BUILD_ID/reports/screenshots"
export DIR_JSON="test-results/$CI_BUILD_ID/json"
export DIR_REPORTS="test-results/$CI_BUILD_ID/reports"
export DIR_SCREENSHOTS="test-results/$CI_BUILD_ID/reports/screenshots"
export DIR_SCREENSHOTS_REPORT="test-results/$CI_BUILD_ID/reports/screenshots"
export DIR_VIDEOS_REPORT="test-results/$CI_BUILD_ID/reports/videos"
export CYPRESS_VIDEOS_FOLDER="test-results/$CI_BUILD_ID/reports/videos"
export CYPRESS_RUN_ENVIRONMENT="pipeline"
export CYPRESS_DIR_SCREENSHOTS="test-results/$CI_BUILD_ID/reports/screenshots"

export CYPRESS_TEST_EMAIL="enlil.testmail@gmail.com"
export CYPRESS_TEST_EMAIL_PASSWORD="shifamed123"

export CYPRESS_SUPERADMIN_EMAIL="zoran.kovacevic+admin@codecons.com"
export CYPRESS_SUPERADMIN_PASSWORD="Tester1!"

export CYPRESS_BE_URL="https://api.dev.enlil.io"
export CYPRESS_FE_URL="https://dev.enlil.io"
export CYPRESS_BASE_URL="https://dev.enlil.io"
