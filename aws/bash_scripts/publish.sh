#!/bin/bash
set -e

ENV=$1

AWS_DIR="${BITBUCKET_CLONE_DIR}/aws"
ENVIRONMENT_DIR="${AWS_DIR}/environments"
# BASH_SCRIPTS_DIR="${AWS_DIR}/bash_scripts"
# PYTHON_SCRIPTS_DIR="${AWS_DIR}/python_scripts"

set -o allexport
[[ -f "${ENVIRONMENT_DIR}/pipelines/${ENV}.env" ]] && source "${ENVIRONMENT_DIR}/pipelines/${ENV}.env"
set +o allexport

# export COMMIT_HASH="${BITBUCKET_COMMIT::7}"
# export IMAGE_NAME="${REPOSITORY_URL}:${COMMIT_HASH}"

# # Login to AWS
# echo "-------- Logging into AWS --------"

# aws ecr get-login --no-include-email --region "${AWS_DEFAULT_REGION}" | bash

# # Creating Image
# echo "-------- Creating Docker Image --------"

# tar -zxvf "compiled.tar.gz"

# docker build -f ./docker/Dockerfile -t "${IMAGE_NAME}" .

# # Login to AWS
# echo "-------- Logging into AWS (Incase of prod) --------"

# if [ "${ENV}" == "prod" ]; then
# 	export AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID_PROD
# 	export AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY_PROD

# 	aws ecr get-login --no-include-email --region "${AWS_DEFAULT_REGION}" | bash
# fi

# # Pusing to ECS
# echo "-------- Pushing Image to AWS ECR --------"

# docker push "${IMAGE_NAME}"

# # Upadate Task Definition 
# echo "-------- Updating EC2 Service --------"

# python3 "${PYTHON_SCRIPTS_DIR}/main.py" "${CONTAINER_NAME}" "${IMAGE_NAME}" "${ENV}"

# export TASK_VERSION=$(aws ecs register-task-definition --family "${ECS_TASK_NAME}" --cli-input-json file://${AWS_DIR}/AWS.TaskDefinition.json | jq --raw-output '.taskDefinition.revision')

# echo "Registered ECS Task Definition:" "${TASK_VERSION}"

# aws ecs update-service --cluster "${ECS_CLUSTER_NAME}" --service "${ECS_SERVICE_NAME}" --task-definition "${ECS_TASK_NAME}:${TASK_VERSION}"

# Login to AWS
echo "-------- Logging into AWS --------"

if [ "${ENV}" == "prod" ]; then
	export AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID_PROD
	export AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY_PROD
fi

aws ecr get-login --no-include-email --region "${AWS_DEFAULT_REGION}" | bash

tar -zxvf "compiled.tar.gz"

echo "s3://${DEPLOYMENT_BUCKET_NAME}"

aws s3 sync "compiled/build/" "s3://${DEPLOYMENT_BUCKET_NAME}" --acl public-read
