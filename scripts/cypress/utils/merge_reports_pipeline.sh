#!/bin/bash
set -e

if [[ -f $DIR_JSON/generated_specs.json ]]
then
  yarn --silent mochawesome-merge \"$DIR_JSON/generated*.json\" > "$DIR_JSON/merged.json" 
  # TODO parse merged.json, get report form 
  jq '.results|=sort_by(.fullFile)' "$DIR_JSON/merged.json"  > "$DIR_REPORTS/result.json" 
  yarn marge "$DIR_REPORTS/result.json"  \
    --assetsDir "$DIR_REPORTS/assets" \
    --reportDir "$DIR_REPORTS" \
    --cdn
fi

