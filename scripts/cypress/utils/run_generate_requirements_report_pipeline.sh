#!/bin/bash
set -e

yarn --silent mochawesome-merge \"$DIR_JSON/generated_specs*.json\" > "$DIR_JSON/merged_specs.json" 
cp "$DIR_JSON/merged_specs.json" cypress/cache/merged_specs.json

export CYPRESS_INTEGRATION_FOLDER="dist/cypress/requirements/generatorSpec"
export CYPRESS_SCREENSHOT_OF_RUN_FAILURE="false"
export CYPRESS_TAKE_SCREENSHOT_AFTER_EACH="false"
export REPORT_TITLE="generated_requirements"

LIST_OF_SPECS_SERIALIZED=dist/cypress/requirements/generatorSpec/generatorSpec.spec.js ./scripts/cypress/utils/run_node_pipeline.sh 2>/dev/null || true
