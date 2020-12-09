#!/bin/bash
set -e

FILES=($DIR_JSON/generated_specs*.json)
declare -a LAST_RAN_TESTS
declare -a REPORTS_TO_DELETE

for ((i=${#FILES[@]}-2; i>=-1; i--));
do
  test_title=$(cat ${FILES[$i]} | jq '."results"[0]."file"')
  if [[ " ${LAST_RAN_TESTS[@]} " =~ " ${test_title} " ]];
  then
    REPORTS_TO_DELETE+=(${FILES[$i]})
  else
    LAST_RAN_TESTS+=($test_title)
  fi
done

for f in ${REPORTS_TO_DELETE[@]}
do
  rm -f $f
  echo "$f-------report deleted"
done