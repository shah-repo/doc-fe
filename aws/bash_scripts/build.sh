#!/bin/bash
set -e

echo "Installing dependencies started on `date`"
chmod a+x ./aws/bash_scripts/install.sh
./aws/bash_scripts/install.sh

# Build & Push Image
echo "Build started on `date`"
export REACT_APP_API_ENDPOINT=https://api.develop.enlil4mfp.io/api
docker build -f ./docker/Dockerfile --build-arg REACT_APP_API_ENDPOINT="${REACT_APP_API_ENDPOINT}" -t "${REMOTE_REPOSITORY_URI}:${IMAGE_TAG}" .
echo Pushing the Docker images...
docker push "${REMOTE_REPOSITORY_URI}:${IMAGE_TAG}"

# Execute & Process Test Results
echo "Test execution started on `date`"
docker run --rm \
--name "${ECS_TASK_NAME}_test" \
--mount type=bind,source="$(pwd)/aws",target="/aws" \
"${REMOTE_REPOSITORY_URI}:${IMAGE_TAG}" yarn test --outputFile "/aws/result.json" --json --no-watch
python3 ./aws/python_scripts/testResultProcessor.py

DTD="${DTD}" # deploy to dev
CODEBRANCH="${CODEBUILD_GIT_BRANCH}"
#if [ "$CODEBRANCH" == "develop" ] || [ "$DTD" == "1" ]; then
	echo "Updating service started on `date`"
	# Upadate Task Definition 
	echo Updating Task Definition
	python3 ./aws/python_scripts/main.py "${CONTAINER_NAME}" "$REMOTE_REPOSITORY_URI:$IMAGE_TAG" "dev"
	export TASK_VERSION=$(aws ecs register-task-definition --family "${ECS_TASK_NAME}" --cli-input-json file://aws/AWS.TaskDefinition.json | jq --raw-output '.taskDefinition.revision')
	echo "Registered ECS Task Definition:" "${TASK_VERSION}"
	aws ecs update-service --cluster "${ECS_CLUSTER_NAME}" --service "${ECS_SERVICE_NAME}" --task-definition "${ECS_TASK_NAME}:${TASK_VERSION}"
#fi
