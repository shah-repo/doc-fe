#!/bin/bash

export CI_BUILD_ID=$(date --iso-8601=seconds)
echo "CI_BUILD_ID=$CI_BUILD_ID"
