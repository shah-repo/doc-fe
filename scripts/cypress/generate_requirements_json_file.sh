#!/bin/bash
set -e

yarn ts-node -O '{"module": "commonjs"}' cypress/requirements/convertRequirements.ts
