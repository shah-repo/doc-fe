#!/bin/bash
set -e

BE_SERVER_IMAGE=be_server_${BE_GIT_COMMIT_HASH}
BE_COMMON_IMAGE=be_common_${BE_GIT_COMMIT_HASH}
BE_WORKER_IMAGE=be_worker_${BE_GIT_COMMIT_HASH}
BE_MIGRATION_IMAGE=be_migration_${BE_GIT_COMMIT_HASH}
ECR_PATH=817083319299.dkr.ecr.us-west-2.amazonaws.com/$ECR_REPO

./scripts/cypress_build_images.sh

docker tag enlil_cypress_server:${BE_GIT_COMMIT_HASH} $ECR_PATH:$BE_SERVER_IMAGE
docker push $ECR_PATH:$BE_SERVER_IMAGE

docker tag enlil_cypress_common:${BE_GIT_COMMIT_HASH} $ECR_PATH:$BE_COMMON_IMAGE
docker push $ECR_PATH:$BE_COMMON_IMAGE

docker tag enlil_cypress_worker:${BE_GIT_COMMIT_HASH} $ECR_PATH:$BE_WORKER_IMAGE
docker push $ECR_PATH:$BE_WORKER_IMAGE

docker tag enlil_cypress_migration:${BE_GIT_COMMIT_HASH} $ECR_PATH:$BE_MIGRATION_IMAGE
docker push $ECR_PATH:$BE_MIGRATION_IMAGE
