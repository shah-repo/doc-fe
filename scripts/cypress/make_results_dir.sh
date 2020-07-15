#!/bin/bash
set -e

if [[ -z "${CI_BUILD_ID}" ]]; then
  echo "CI_BUILD_ID not set, exiting"
  exit
fi

export DIR_JSON="results/$CI_BUILD_ID/json"
export DIR_REPORTS="results/$CI_BUILD_ID/reports"
mkdir -p $DIR_JSON
mkdir -p $DIR_REPORTS
