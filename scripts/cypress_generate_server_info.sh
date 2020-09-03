#!/bin/bash

tmp=$(mktemp)

jq \
  --arg date "$(git show -s --format=%ci)"  \
  --arg branch "$(git branch 2> /dev/null | sed -e '/^[^*]/d' -e 's/* \(.*\)/\1/')"  \
  --arg commit "$(git rev-parse HEAD)"  \
'
  .Repository = "doc-fe"
| .Branch = $branch
| .Tag = "-" 
| .["Commit Hash"] = $commit 
| .Date = $date 
| .["ECR Image"] = "Cypress" 
| .["Build Number"] = "-"
' src/data/buildInfo.json > "$tmp" && mv "$tmp" src/data/buildInfo.json

