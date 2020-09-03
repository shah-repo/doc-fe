#!/bin/bash
set -e

if [[ -z "${CI_BUILD_ID}" ]]; then
  echo "CI_BUILD_ID not set, exiting"
  exit 1
fi

export DIR_JSON="results/$CI_BUILD_ID/json"
export DIR_REPORTS="results/$CI_BUILD_ID/reports"
export DIR_SCREENSHOTS="$DIR_REPORTS/screenshots"
export DIR_SCREENSHOTS_REPORT="$DIR_REPORTS/screenshots"

mkdir -p $DIR_JSON
mkdir -p $DIR_REPORTS
mkdir -p $DIR_SCREENSHOTS_REPORT
