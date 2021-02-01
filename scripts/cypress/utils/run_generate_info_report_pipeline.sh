#!/bin/bash
set -e

export CYPRESS_INTEGRATION_FOLDER="cypress/info"
# export CYPRESS_SCREENSHOTS_FOLDER=$DIR_SCREENSHOTS_REPORT
export CYPRESS_VIDEOS_FOLDER=$DIR_VIDEOS_REPORT
export CYPRESS_SCREENSHOT_OF_RUN_FAILURE="false"
export CYPRESS_TAKE_SCREENSHOT_AFTER_EACH="false"
export REPORT_TITLE="generated_info"
export CYPRESS_VIDEO="false"

<<<<<<< HEAD
CI_BUILD_ID="info_$CI_BUILD_ID" LIST_OF_SPECS_SERIALIZED=dist/cypress/info/info.spec.js ./scripts/cypress/utils/run_node_pipeline.sh 2>/dev/null || true
=======
CI_BUILD_ID="info_$CI_BUILD_ID" LIST_OF_SPECS_SERIALIZED=cypress/info/info.spec.ts ./scripts/cypress/utils/run_node_pipeline.sh 2>/dev/null || true
>>>>>>> parent of e45271f79... ENC-5912 Testing compiled cypress specs
