#!/bin/bash
set -e

BUILD_ENV="dev"
if [ "$GH_BRANCH" == "master" ] && [ "$DTD" != "true" ]; then 
	BUILD_ENV="prod"
fi

echo "Branch: $GH_BRANCH"
echo "Endpoint: $REACT_APP_API_ENDPOINT"
echo "Deploy to dev: $DTD"
echo "No deploy: $NO_DEPLOY"

echo "Installing dependencies started on `date`"
chmod a+x ./aws/bash_scripts/install.sh
./aws/bash_scripts/install.sh

# Build & Push Image
echo "Build started on `date`"

export REACT_APP_API_ENDPOINT=$(python3 ./aws/python_scripts/getEnvValue.py ${BUILD_ENV} REACT_APP_API_ENDPOINT 2>&1)
export REACT_APP_AWS_COGNITO_CLIENT_ID=$(python3 ./aws/python_scripts/getEnvValue.py ${BUILD_ENV} REACT_APP_AWS_COGNITO_CLIENT_ID 2>&1)
export REACT_APP_FRONTEND_URL=$(python3 ./aws/python_scripts/getEnvValue.py ${BUILD_ENV} REACT_APP_FRONTEND_URL 2>&1)
export REACT_APP_SIGNUP_DOMAIN_URL=$(python3 ./aws/python_scripts/getEnvValue.py ${BUILD_ENV} REACT_APP_SIGNUP_DOMAIN_URL 2>&1)

docker build -f ./docker/Dockerfile \
--build-arg REACT_APP_API_ENDPOINT="${REACT_APP_API_ENDPOINT}" \
--build-arg REACT_APP_AWS_COGNITO_CLIENT_ID="${REACT_APP_AWS_COGNITO_CLIENT_ID}" \
--build-arg REACT_APP_FRONTEND_URL="${REACT_APP_FRONTEND_URL}" \
--build-arg REACT_APP_SIGNUP_DOMAIN_URL="${REACT_APP_SIGNUP_DOMAIN_URL}" \
-t "${REMOTE_REPOSITORY_URI}:${IMAGE_TAG}" .

echo Pushing the Docker images...
docker push "${REMOTE_REPOSITORY_URI}:${IMAGE_TAG}"

# Execute & Process Test Results
echo "Test execution started on `date`"
docker run --rm \
--name "${ECS_TASK_NAME}_test" \
--mount type=bind,source="$(pwd)/aws",target="/aws" \
"${REMOTE_REPOSITORY_URI}:${IMAGE_TAG}" yarn test --outputFile "/aws/result.json" --json --no-watch
python3 ./aws/python_scripts/testResultProcessor.py

# Deploy
if [ "$DTD" == "true" ] && [ "$NO_DEPLOY" == "false" ]; then
	echo "Updating service started on `date`"
	# Upadate Task Definition 
	echo Updating Task Definition
	python3 ./aws/python_scripts/main.py "${CONTAINER_NAME}" "$REMOTE_REPOSITORY_URI:$IMAGE_TAG" "${BUILD_ENV}"
	export TASK_VERSION=$(aws ecs register-task-definition --family "${ECS_TASK_NAME}" --cli-input-json file://aws/AWS.TaskDefinition.json | jq --raw-output '.taskDefinition.revision')
	echo "Registered ECS Task Definition:" "${TASK_VERSION}"
	aws ecs update-service --cluster "${ECS_CLUSTER_NAME}" --service "${ECS_SERVICE_NAME}" --task-definition "${ECS_TASK_NAME}:${TASK_VERSION}"
fi
