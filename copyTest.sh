#!/bin/bash

cp cypress/integration/test.spec.ts cypress/integration/test1.spec.ts
cp cypress/integration/test.spec.ts cypress/integration/test2.spec.ts
cp cypress/integration/test.spec.ts cypress/integration/test3.spec.ts


# yarn cypress run --parallel --record --key xxx --ci-build-id 123
