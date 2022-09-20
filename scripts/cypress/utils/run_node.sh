#!/bin/bash

if [[ -z "${ENLIL_COMPOSE_PORT_RANGE_START}" ]]; then
  echo "ENLIL_COMPOSE_PORT_RANGE_START not set, exiting"
  exit 1
fi

if [[ -z "${CI_BUILD_ID}" ]]; then
  echo "CI_BUILD_ID not set, exiting"
  exit 1
fi

if [[ -z "${DIR_JSON}" ]]; then
  echo "DIR_JSON not set, exiting"
  exit 1
fi

if [[ -z "${REPORT_TITLE}" ]]; then
  echo "REPORT_TITLE not set, exiting"
  exit 1
fi

if [[ -z "${CYPRESS_FE_URL}" ]]; then
  echo "CYPRESS_FE_URL not set, exiting"
  exit 1
fi

if [[ -z "${CYPRESS_BE_URL}" ]]; then
  echo "CYPRESS_BE_URL not set, exiting"
  exit 1
fi

export CYPRESS_BASE_URL=$CYPRESS_FE_URL

export CYPRESS_KONFIG_ENV="development"
export CYPRESS_BROWSER=${CYPRESS_BROWSER:-chrome}

./scripts/cypress/wait.sh

CYPRESSARGS=(
  --parallel 
  --record 
  --key 9e6e4a3d-c43a-4e60-8984-fa2ae0a90a76
  --reporter mochawesome 
  --reporter-options reportDir=$DIR_JSON,overwrite=false,html=false,json=true,reportFilename=$REPORT_TITLE
  --browser $CYPRESS_BROWSER
  --headless
  --spec "cypress/integration/document.revision/document_history.spec.ts,cypress/integration/document.type.management/invalid_schemas_for_doc_mgmt_second_part.spec.ts,cypress/integration/engineering.build/new_layout_for_Parts.spec.ts,cypress/integration/intermediate.page/part.spec.ts,cypress/integration/intermediate.page/parts_intermediate_page.spec.ts,cypress/integration/intermediate.page/seed_intermediate_page.spec.ts,cypress/integration/layout/LHRT_layout.spec.ts,cypress/integration/layout/receivable.new.tab.layout.spec.ts,cypress/integration/layout/receiving_form_flow.spec.ts,cypress/integration/layout/record.inline.spec.ts,cypress/integration/lhrs/lhr_lhrs_flow.spec.ts,cypress/integration/mpi/lhr_mpi_po_as_needed_check.spec.ts,cypress/integration/purchase.order/PO_and_Parts_Internal_Type.spec.ts,cypress/integration/purchase.order/purchase_order.spec.ts,cypress/integration/purchase.order/purchase_order_approver_before_requestor_nco.spec.ts,cypress/integration/purchase.order/purchase_order_create.spec.ts,cypress/integration/purchase.order/purchase_order_create_landing_page.spec.ts,cypress/integration/purchase.order/purchase_order_default.spec.ts,cypress/integration/purchase.order/purchase_order_tax_rate_calculation.spec.ts,cypress/integration/training/add_remove_training_docs.spec.ts,cypress/integration/training/training_notification.spec.ts" 
  --ci-build-id $CI_BUILD_ID
  --env grepTags=$CYPRESS_INCLUDE_TAGS
)

if xvfb-run --help > /dev/null; then
    xvfb-run -a yarn cypress run "${CYPRESSARGS[@]/#/}"
else
    yarn cypress run "${CYPRESSARGS[@]/#/}"
fi
