#!/bin/bash

source ./scripts/cypress/platform_specific_variables.sh

if [[ -z "${DATE_ISO_DEFAULT}" ]]; then
  echo "DATE_ISO_DEFAULT not set, exiting"
  exit 1
fi

ID_SUFFIX=$1

if [[ -z "${ID_SUFFIX}" ]]; then
  export CI_BUILD_ID=$DATE_ISO_DEFAULT
else
  export CI_BUILD_ID=$DATE_ISO_DEFAULT"_"$ID_SUFFIX
fi

echo "CI_BUILD_ID=$CI_BUILD_ID"
