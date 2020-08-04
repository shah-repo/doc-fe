#!/bin/bash
set -e

if [[ -z "${CI_BUILD_ID}" ]]; then
  echo "CI_BUILD_ID not set, exiting"
  exit
fi

# make folders for results
source ./scripts/cypress/make_results_dir.sh

yarn --silent mochawesome-merge \"$DIR_JSON/generated_specs*.json\" > "$DIR_JSON/merged_specs.json" 
cp "$DIR_JSON/merged_specs.json" cypress/cache/merged_specs.json

export ENLIL_COMPOSE_PORT_RANGE_START=${ENLIL_COMPOSE_PORT_RANGE_START:-5600}
export ENLIL_COMPOSE_EXPOSE_DIRECTOR_PORT="$((ENLIL_COMPOSE_PORT_RANGE_START+6))"
export CYPRESS_INTEGRATION_FOLDER="cypress/requirements/generatorSpec"
export CYPRESS_SCREENSHOT_OF_RUN_FAILURE="false"
export REPORT_TITLE="generated_requirements"
export CYPRESS_BAIL_ON_FAILURE="false"

GENERATED_REQUIREMENTS="$DIR_JSON/$REPORT_TITLE.json"

if [ -f "$GENERATED_REQUIREMENTS" ]; then
    rm $GENERATED_REQUIREMENTS
    SCRIPT="
      var specFile = \"$CYPRESS_INTEGRATION_FOLDER/generatorSpec.spec.ts\";
      var ciBuildId = \"$CI_BUILD_ID\";
      db = new Mongo().getDB(\"sorry-cypress\");
      var run = db.getCollection('runs').find({\"meta.ciBuildId\": ciBuildId, \"specs.spec\": specFile}).limit(1).toArray();

      db.getCollection('runs').updateOne({\"meta.ciBuildId\": ciBuildId, \"specs.spec\": specFile}, {\$set: {\"specs.\$.claimed\": false}});
      db.getCollection('instances').deleteOne({runId: run[0].runId, spec: specFile});"

    echo $SCRIPT | docker exec -i enlil_cypress_dashboard_mongo bash -c mongo
fi

./scripts/cypress/run_node.sh 2>/dev/null || true
