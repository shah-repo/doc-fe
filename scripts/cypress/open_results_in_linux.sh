#!/bin/bash
set -e

source ./scripts/cypress/make_results_dir.sh

FILE=./results/$DIR_REPORTS/reports

echo "--| Opening $DIR_REPORTS"
dolphin $DIR_REPORTS &
