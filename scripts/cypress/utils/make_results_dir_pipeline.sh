#!/bin/bash
set -e

mkdir -p $DIR_JSON
mkdir -p $DIR_REPORTS
mkdir -p $DIR_SCREENSHOTS_REPORT
mkdir -p $DIR_VIDEOS_REPORT

cat <<EOF > ./test_results/$CI_BUILD_ID/start_time.json
{
  "startTime": "$(date "+%Y-%m-%dT%H-%M-%S%z")"
}
EOF
