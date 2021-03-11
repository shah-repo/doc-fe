#!/bin/bash
set -e

NUMBER_OF_FAILS=$(jq '.stats.failures' ./$DIR_REPORTS/result.json)

if [ "$NUMBER_OF_FAILS" != "0" ]; then
  echo "found $NUMBER_OF_FAILS failures"
  exit 1;
fi
