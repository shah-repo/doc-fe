#!/bin/bash

source ./scripts/cypress/utils/variables_scheduled_pipeline.sh "SANDBOX"
./scripts/cypress/wait.sh
yarn install --frozen-lockfile
ENLIL_DIRECTOR_HOST="director" ./scripts/cypress/utils/patch_director_port_in_cache_pipeline.sh
./scripts/cypress/utils/generate_requirements_json_file.sh
./scripts/cypress/utils/make_results_dir_pipeline.sh
./scripts/cypress/utils/run_generate_info_report_pipeline.sh
./scripts/cypress/utils/run_workers_in_parallel_pipeline.sh
./scripts/cypress/utils/merge_reports_pipeline.sh
./scripts/cypress/utils/slack_test_report_upload.sh