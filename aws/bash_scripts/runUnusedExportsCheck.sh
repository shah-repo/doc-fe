#!/bin/bash
set -e

yarn ts-unused-exports tsconfig.json \
  --excludePathsFromReport=/__mocks__/ \
  --maxIssues=490
