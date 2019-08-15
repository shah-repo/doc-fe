#!/bin/bash
set -e

ENV=$1

AWS_DIR="${BITBUCKET_CLONE_DIR}/aws"
ENVIRONMENT_DIR="${AWS_DIR}/environments"
BASH_SCRIPTS_DIR="${AWS_DIR}/bash_scripts"
PYTHON_SCRIPTS_DIR="${AWS_DIR}/python_scripts"

export CLUSTER_NAME=$ECS_CLUSTER_NAME
export COMMIT_HASH="${BITBUCKET_COMMIT::7}"
export IMAGE_NAME="${REPOSITORY_URL}:${COMMIT_HASH}"

if [ "${ENV}" == "prod" ]; then
	export AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID_PROD
	export AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY_PROD
	export CLUSTER_NAME=$ECS_CLUSTER_NAME_PROD
	export IMAGE_NAME="${REPOSITORY_URL_PROD}:${COMMIT_HASH}"
fi

# Install Dependencies
echo "-------- Installing Dependencies --------"

chmod a+x "${BASH_SCRIPTS_DIR}/install.sh"
"${BASH_SCRIPTS_DIR}/install.sh"

# Login to AWS
echo "-------- Logging into AWS --------"

aws ecr get-login --no-include-email --region "${AWS_DEFAULT_REGION}" | bash

# Generating Build Info
echo "-------- Generating Build Info --------"

chmod a+x "${BASH_SCRIPTS_DIR}/status.sh"
"${BASH_SCRIPTS_DIR}/status.sh"

SCRIPT="${PYTHON_SCRIPTS_DIR}/getEnvValue.py"
export KEY_REACT_APP_API_ENDPOINT="REACT_APP_API_ENDPOINT"
export KEY_REACT_APP_AWS_COGNITO_CLIENT_ID="REACT_APP_AWS_COGNITO_CLIENT_ID"
export KEY_REACT_APP_FRONTEND_URL="REACT_APP_FRONTEND_URL"
export KEY_REACT_APP_SIGNUP_DOMAIN_URL="REACT_APP_SIGNUP_DOMAIN_URL"

# Building
echo "-------- Building Application --------"

docker build -f ./docker/Dockerfile \
--build-arg $KEY_REACT_APP_API_ENDPOINT=$(python3 $SCRIPT $ENV $ENVIRONMENT_DIR $KEY_REACT_APP_API_ENDPOINT 2>&1) \
--build-arg $KEY_REACT_APP_AWS_COGNITO_CLIENT_ID=$(python3 $SCRIPT $ENV $ENVIRONMENT_DIR $KEY_REACT_APP_AWS_COGNITO_CLIENT_ID 2>&1) \
--build-arg $KEY_REACT_APP_FRONTEND_URL=$(python3 $SCRIPT $ENV $ENVIRONMENT_DIR $KEY_REACT_APP_FRONTEND_URL 2>&1) \
--build-arg $KEY_REACT_APP_SIGNUP_DOMAIN_URL=$(python3 $SCRIPT $ENV $ENVIRONMENT_DIR $KEY_REACT_APP_SIGNUP_DOMAIN_URL 2>&1) \
-t "${IMAGE_NAME}" .

# Deploy
echo "-------- Pushing Image to AWS ECR --------"

docker push "${IMAGE_NAME}"

# Upadate Task Definition 
echo "-------- Updating EC2 Service --------"

python3 "${PYTHON_SCRIPTS_DIR}/main.py" "${CONTAINER_NAME}" "${IMAGE_NAME}" "${ENV}"

export TASK_VERSION=$(aws ecs register-task-definition --family "${ECS_TASK_NAME}" --cli-input-json file://${AWS_DIR}/AWS.TaskDefinition.json | jq --raw-output '.taskDefinition.revision')

echo "Registered ECS Task Definition:" "${TASK_VERSION}"

aws ecs update-service --cluster "${CLUSTER_NAME}" --service "${ECS_SERVICE_NAME}" --task-definition "${ECS_TASK_NAME}:${TASK_VERSION}"

