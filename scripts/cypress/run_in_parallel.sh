#!/bin/bash
set -e

secs_to_human() {
    if [[ -z ${1} || ${1} -lt 60 ]] ;then
        min=0 ; secs="${1}"
    else
        time_mins=$(echo "scale=2; ${1}/60" | bc)
        min=$(echo ${time_mins} | cut -d'.' -f1)
        secs="0.$(echo ${time_mins} | cut -d'.' -f2)"
        secs=$(echo ${secs}*60|bc|awk '{print int($1+0.5)}')
    fi
    echo "Time Elapsed : ${min} minutes and ${secs} seconds."
}
start=$(date +%s)

DATE_ISO_DEFAULT=$(date --iso-8601=seconds)
export CI_BUILD_ID="Test_report"
export NUMBER_OF_WORKERS=${NUMBER_OF_WORKERS:-4}
export REPORT_TITLE=${REPORT_TITLE:-generated_specs}

if [[ -z "${CI_BUILD_ID}" ]]; then
  echo "CI_BUILD_ID not set, exiting"
  exit
fi

./scripts/cypress/delete_cache.sh
./scripts/cypress/make_results_dir.sh
./scripts/cypress/delete_failed_specs.sh
./scripts/cypress/run_workers_in_parallel.sh
./scripts/cypress/run_generate_requirements_report.sh
./scripts/cypress/merge_reports.sh

echo "================="
echo "================="
secs_to_human "$(($(date +%s) - ${start}))"
