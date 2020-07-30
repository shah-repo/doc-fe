#!/bin/bash
set -e

if [[ -z "${CI_BUILD_ID}" ]]; then
  echo "CI_BUILD_ID not set, exiting"
  exit
fi


if [[ -z "${REPORT_TITLE}" ]]; then
  echo "REPORT_TITLE not set, exiting"
  exit
fi


./scripts/cypress/make_results_dir.sh

MOCHAWESOME_FILES=($(find results/$CI_BUILD_ID/json -name "$REPORT_TITLE*"))

for i in "${MOCHAWESOME_FILES[@]}"
do
  FILES=($(cat $i | jq 'select(.stats.failures != 0) | .results | .[] | .fullFile' | uniq | sort -u))
  # echo "File $i output '$WITH_FAILING_SPECS'"
  echo " "
  if [[ -z "${FILES}" ]]; then
    echo "PASSING SPEC"
    echo "--| skipping: $i"

  else
    echo "FAILING SPEC"
    # rm $i
    for x in "${FILES[@]}"
    do
      echo "--| $x"
      SCRIPT="
        var specFile = $x;
        var ciBuildId = \"$CI_BUILD_ID\";
        db = new Mongo().getDB(\"sorry-cypress\");
        var run = db.getCollection('runs').find({\"meta.ciBuildId\": ciBuildId, \"specs.spec\": specFile}).limit(1).toArray();

        db.getCollection('runs').updateOne({\"meta.ciBuildId\": ciBuildId, \"specs.spec\": specFile}, {\$set: {\"specs.\$.claimed\": false}});
        db.getCollection('instances').deleteOne({runId: run[0].runId, spec: specFile});"
      
    echo $SCRIPT | docker exec -i enlil_cypress_dashboard_mongo bash -c mongo  1> /dev/null
    done

    echo "--| deleting  $i"
    rm $i
  fi
done
