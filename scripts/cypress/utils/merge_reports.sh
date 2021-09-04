#!/bin/bash

if [[ -z "${CI_BUILD_ID}" ]]; then
  echo "CI_BUILD_ID not set, exiting"
  exit 1
fi

source ./scripts/cypress/utils/make_results_dir.sh

if [[ $(ls $DIR_JSON | wc -l) -gt 0 ]]
then
  yarn --silent mochawesome-merge \"$DIR_JSON/generated*.json\" > "$DIR_JSON/merged.json" 
  # TODO parse merged.json, get report form 
  jq '.results|=sort_by(.fullFile)' "$DIR_JSON/merged.json"  > "$DIR_REPORTS/result.json" 
  yarn marge "$DIR_REPORTS/result.json"  \
    --assetsDir "$DIR_REPORTS/assets" \
    --reportDir "$DIR_REPORTS" \
    --cdn

  yarn ts-node -O '{"module": "commonjs"}' cypress/support/organizeReports/organizeHTMLs.ts
fi

