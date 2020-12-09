#!/bin/bash
set -e

./scripts/cypress/utils/delete_reran_spec.h

yarn --silent mochawesome-merge \"$DIR_JSON/generated_specs*.json\" > "$DIR_JSON/merged_specs.json" 
cp "$DIR_JSON/merged_specs.json" cypress/cache/merged_specs.json

export CYPRESS_INTEGRATION_FOLDER="cypress/requirements/generatorSpec"
export CYPRESS_SCREENSHOT_OF_RUN_FAILURE="false"
export CYPRESS_TAKE_SCREENSHOT_AFTER_EACH="false"
export REPORT_TITLE="generated_requirements"

./scripts/cypress/utils/run_node_pipeline.sh 2>/dev/null || true
