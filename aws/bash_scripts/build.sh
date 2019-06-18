#!/bin/bash
set -e

ENV=$1
DTD=$2

ENVIRONMENT_DIR="$BITBUCKET_CLONE_DIR/aws/environments"
BASH_SCRIPTS_DIR="$BITBUCKET_CLONE_DIR/aws/bash_scripts"
PYTHON_SCRIPTS_DIR="$BITBUCKET_CLONE_DIR/aws/python_scripts"
AWS_DIR="$BITBUCKET_CLONE_DIR/aws"

# Install Dependencies
echo "Installing dependencies started on `date`"

chmod a+x "$BASH_SCRIPTS_DIR/install.sh"
"$BASH_SCRIPTS_DIR/install.sh"

# Login to AWS
aws ecr get-login --no-include-email --region "${AWS_DEFAULT_REGION}" | bash

# Build & Push Image
echo "Build started on `date`"

COMMIT_HASH="${BITBUCKET_COMMIT::7}"
export IMAGE_NAME="${REPOSITORY_URL}:${COMMIT_HASH}"

chmod a+x "$BASH_SCRIPTS_DIR/status.sh"
"$BASH_SCRIPTS_DIR/status.sh"

SCRIPT="$PYTHON_SCRIPTS_DIR/getEnvValue.py"
export KEY_REACT_APP_API_ENDPOINT="REACT_APP_API_ENDPOINT"
export KEY_REACT_APP_AWS_COGNITO_CLIENT_ID="REACT_APP_AWS_COGNITO_CLIENT_ID"
export KEY_REACT_APP_FRONTEND_URL="REACT_APP_FRONTEND_URL"
export KEY_REACT_APP_SIGNUP_DOMAIN_URL="REACT_APP_SIGNUP_DOMAIN_URL"

docker build -f ./docker/Dockerfile \
--build-arg $KEY_REACT_APP_API_ENDPOINT=$(python3 $SCRIPT $ENV $ENVIRONMENT_DIR $KEY_REACT_APP_API_ENDPOINT 2>&1) \
--build-arg $KEY_REACT_APP_AWS_COGNITO_CLIENT_ID=$(python3 $SCRIPT $ENV $ENVIRONMENT_DIR $KEY_REACT_APP_AWS_COGNITO_CLIENT_ID 2>&1) \
--build-arg $KEY_REACT_APP_FRONTEND_URL=$(python3 $SCRIPT $ENV $ENVIRONMENT_DIR $KEY_REACT_APP_FRONTEND_URL 2>&1) \
--build-arg $KEY_REACT_APP_SIGNUP_DOMAIN_URL=$(python3 $SCRIPT $ENV $ENVIRONMENT_DIR $KEY_REACT_APP_SIGNUP_DOMAIN_URL 2>&1) \
-t "${IMAGE_NAME}" .

# Execute & Process Test Results
echo "Test execution started on `date`"

docker run --rm \
--name "${ECS_TASK_NAME}_test" \
-v="$AWS_DIR:/aws" \
"${IMAGE_NAME}" "./runTests.sh"

python3 "$PYTHON_SCRIPTS_DIR/testResultProcessor.py"

TEST_RESULT=$(python3 "$PYTHON_SCRIPTS_DIR/getResult.py" "$AWS_DIR/test_result.txt" "0")
TEST_RESULT_STATUS=$(python3 "$PYTHON_SCRIPTS_DIR/getResult.py" "$AWS_DIR/test_result_status.txt" "1")
echo "Test Result = ${TEST_RESULT}"
echo "Test Result Status = ${TEST_RESULT_STATUS}"

# fails if tests are not successful
if [ "$TEST_RESULT_STATUS" == "0" ]; then
	exit 1
fi

# Deploy
#if [ "$DTD" == "true" ] && [ "$TEST_RESULT_STATUS" == "1" ]; then
	# Login to AWS
	aws ecr get-login --no-include-email --region "${AWS_DEFAULT_REGION}" | bash

	echo Pushing the Docker images...

	docker push "${IMAGE_NAME}"

	echo "Updating service started on `date`"
	
	# Upadate Task Definition 
	echo Updating Task Definition
	
	python3 "$PYTHON_SCRIPTS_DIR/main.py" "${CONTAINER_NAME}" "${IMAGE_NAME}" "${ENV}"
	
	export TASK_VERSION=$(aws ecs register-task-definition --family "${ECS_TASK_NAME}" --cli-input-json file://$AWS_DIR/AWS.TaskDefinition.json | jq --raw-output '.taskDefinition.revision')
	
	echo "Registered ECS Task Definition:" "${TASK_VERSION}"
	
	aws ecs update-service --cluster "${ECS_CLUSTER_NAME}" --service "${ECS_SERVICE_NAME}" --task-definition "${ECS_TASK_NAME}:${TASK_VERSION}"
#fi
