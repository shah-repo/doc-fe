#!/bin/bash

export FE_GIT_COMMIT_HASH=$(git rev-parse HEAD 2> /dev/null |  cut -c1-8)

docker build \
  -f docker/cypress_web.Dockerfile \
  -t enlil/cypress_web:$FE_GIT_COMMIT_HASH \
  --build-arg FE_GIT_COMMIT_HASH .
