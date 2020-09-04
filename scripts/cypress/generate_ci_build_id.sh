#!/bin/bash

source ./scripts/cypress/platform_specific_variables.sh

export CI_BUILD_ID=$DATE_ISO_DEFAULT
echo "CI_BUILD_ID=$CI_BUILD_ID"
