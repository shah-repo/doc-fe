#!/bin/bash
set -e

npx ts-node -O '{"module": "commonjs"}' cypress/requirements/convertRequirements.ts
