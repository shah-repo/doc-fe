#!/bin/bash
set -e

source ./scripts/cypress/utils/make_results_dir.sh

FILE=$DIR_REPORTS/result.html

echo "--| Opening $FILE"

case "$1" in
     "firefox") firefox $FILE &;;
     "google-chrome-stable") google-chrome-stable $FILE &;;
     "google-chrome") google-chrome $FILE &;;
     *) echo "unknown option";;
    esac
