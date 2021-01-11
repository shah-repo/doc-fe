#!/bin/bash
set -e

FILES=($DIR_JSON/generated_specs*.json)
JUNIT_FILES=($DIR_JSON/junit/results-*.xml)
declare -a LAST_RAN_TESTS
declare -a REPORTS_TO_DELETE
declare -a JUNIT_REPORT_TITLES_TO_DELETE
declare -a JUNIT_REPORT_TIMESTAMPS_TO_DELETE
declare -a JUNIT_FILES_TO_DELETE

for ((i=${#FILES[@]}-2; i>=-1; i--));
do
  test_timestamp=$(cat ${FILES[$i]} | jq '."stats"."start"')
  test_title=$(cat ${FILES[$i]} | jq '."results"[0]."file"')
  if [[ " ${LAST_RAN_TESTS[@]} " =~ " ${test_title} " ]];
  then
    REPORTS_TO_DELETE+=(${FILES[$i]})
    JUNIT_REPORT_TITLES_TO_DELETE+=(${test_title})
    JUNIT_REPORT_TIMESTAMPS_TO_DELETE+=(${test_timestamp%??????}\")
  else
    LAST_RAN_TESTS+=($test_title)
  fi
done

for f in ${REPORTS_TO_DELETE[@]}
do
  rm -f $f
  echo "$f-------report deleted"
done

for f in ${JUNIT_FILES[@]}
do
  test_title=\"$(grep -Pio 'name="Root Suite".*file="\K[^"]*' $f)\"
  test_timestamp=\"$(grep -Pio 'name="Root Suite".*timestamp="\K[^"]*' $f)\"
  for ((i=0; i<${#JUNIT_REPORT_TITLES_TO_DELETE[@]}; i++));
  do
    if [[ ${JUNIT_REPORT_TITLES_TO_DELETE[$i]} = ${test_title} ]] && [[ ${JUNIT_REPORT_TIMESTAMPS_TO_DELETE[$i]} = ${test_timestamp} ]];
    then
      JUNIT_FILES_TO_DELETE+=(${f})
    fi
  done
done

for f in ${JUNIT_FILES_TO_DELETE[@]}
do
  rm -f $f
  echo "$f-------report deleted"
done