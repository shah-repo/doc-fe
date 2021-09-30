#!/bin/bash

set -a
  export BE_REPO="$HEAD_PWD/doc-be"
  export FE_REPO="$HEAD_PWD/doc-fe"
  export VALIDATORS_REPO="$HEAD_PWD/remote-js-validators"
  export ENLIL_COMPOSE_SUITE_NUMBER="13"

  export BE_GIT_COMMIT_HASH=$(cd $BE_REPO;git rev-parse HEAD | cut -c1-8)
  export FE_GIT_COMMIT_HASH=$(cd $FE_REPO;git rev-parse HEAD | cut -c1-8)
  export VALIDATORS_GIT_COMMIT_HASH=$(cd $VALIDATORS_REPO;git rev-parse HEAD | cut -c1-8)

  export DOCKER_COMPOSE_BE="$BE_REPO/cypress/docker-compose.yml"
  export DOCKER_COMPOSE_FE="$BE_REPO/cypress/fe.docker-compose.yml"
  export DOCKER_COMPOSE_SORRY_CY="$BE_REPO/cypress/sorry-cypress.docker-compose.yml"
set +a

if [ ! -f "$DOCKER_COMPOSE_BE" ]; then
    echo "$DOCKER_COMPOSE_BE does not exist"
    echo "-------"
    echo "Run from root of the repository!!"
    exit;
fi

if [ ! -f "$DOCKER_COMPOSE_FE" ]; then
    echo "$DOCKER_COMPOSE_FE does not exist"
    echo "-------"
    echo "Run from root of the repository!!"
    exit;
fi

if [ ! -f "$DOCKER_COMPOSE_SORRY_CY" ]; then
    echo "$DOCKER_COMPOSE_SORRY_CY does not exist"
    echo "-------"
    echo "Run from root of the repository!!"
    exit;
fi

if [[ -z "${ENLIL_COMPOSE_SUITE_NUMBER}" ]]; then
  echo "ENLIL_COMPOSE_SUITE_NUMBER not set, exiting"
  exit
fi

if [[ -z "${BE_REPO}" ]]; then
  echo "BE_REPO not set, exiting"
  exit
fi

if [[ -z "${FE_REPO}" ]]; then
  echo "FE_REPO not set, exiting"
  exit
fi

if [[ -z "${VALIDATORS_REPO}" ]]; then
  echo "VALIDATORS_REPO not set, exiting"
  exit
fi

set -a
  export COMPOSE_PROJECT_NAME="enlil_codebuild"

  export ENLIL_COMPOSE_EXPOSE_BE_PORT="4211"
  export ENLIL_COMPOSE_EXPOSE_FE_PORT="4212"
  export ENLIL_COMPOSE_EXPOSE_VALIDATORS_PORT="4215"
  export ENLIL_COMPOSE_EXPOSE_POSTGRES_PORT="5432"
  export ENLIL_COMPOSE_EXPOSE_REDIS_PORT="6379"
  export ENLIL_COMPOSE_EXPOSE_SORRY_CY_DIRECTOR_PORT="1234"
  export ENLIL_COMPOSE_EXPOSE_BE_WORKER_PORT="4219"
  export ENLIL_COMPOSE_EXPOSE_HAPROXY_PORT="80"

  export ENLIL_BE_AWS_SQS_QUEUE_URL="https://sqs.us-west-2.amazonaws.com/817083319299/cypress_terraform_test_dev_$ENLIL_COMPOSE_SUITE_NUMBER.fifo"
  export ENLIL_BE_ENV_NAME="CYPRESS_TEST_$ENLIL_COMPOSE_SUITE_NUMBER"
  
  export VALIDATORS_CYPRESS_FE_URL="http://validators:$ENLIL_COMPOSE_EXPOSE_VALIDATORS_PORT"
  export REACT_APP_API_ENDPOINT="http://backend:$ENLIL_COMPOSE_EXPOSE_HAPROXY_PORT/api"
  export REACT_APP_FRONTEND_URL="http://frontend:$ENLIL_COMPOSE_EXPOSE_FE_PORT"
  export REACT_APP_WORKER_API_ENDPOINT="http://worker:$ENLIL_COMPOSE_EXPOSE_BE_WORKER_PORT/api"


  export TYPEORM_DATABASE=${TYPEORM_DATABASE-cypress_db}
  export TYPEORM_HOST=postgres
  export ENLIL_DB_PERSIST=false
  export ECR_REPO="codebuild"
  export AWS_DEFAULT_REGION=us-west-2
set +a

echo "--| BE_GIT_COMMIT_HASH: $BE_GIT_COMMIT_HASH"
echo "--| FE_GIT_COMMIT_HASH: $FE_GIT_COMMIT_HASH"
echo "--| VALIDATORS_GIT_COMMIT_HASH: $VALIDATORS_GIT_COMMIT_HASH"
echo "--| ENLIL_COMPOSE_SUITE_NUMBER: $ENLIL_COMPOSE_SUITE_NUMBER"

aws sqs purge-queue --region=us-west-2 --queue-url $ENLIL_BE_AWS_SQS_QUEUE_URL

build_be () {
  cd $BE_REPO
  IMAGE=be_server_${BE_GIT_COMMIT_HASH}
  $FE_REPO/codebuild/helper/find_ecr_image.sh $ECR_REPO $IMAGE
  IMAGE_FOUND=$?

  if [ $IMAGE_FOUND = 0 ]
  then
    $FE_REPO/codebuild/pull_be_images.sh
  else
    $FE_REPO/codebuild/build_and_push_be_images.sh
  fi
  cd $HEAD_PWD
}

build_fe () {
  cd $FE_REPO
  IMAGE=fe_${FE_GIT_COMMIT_HASH}
  DOCKER_IMAGE=817083319299.dkr.ecr.us-west-2.amazonaws.com/$ECR_REPO:$IMAGE
  $FE_REPO/codebuild/helper/find_ecr_image.sh $ECR_REPO $IMAGE
  IMAGE_FOUND=$?

  if [ $IMAGE_FOUND = 0 ]
  then
    docker pull $DOCKER_IMAGE
  else
    $FE_REPO/codebuild/build_and_push_fe_image.sh
  fi
  cd $HEAD_PWD
}

build_validators () {
  cd $VALIDATORS_REPO
  IMAGE=validators_${VALIDATORS_GIT_COMMIT_HASH}
  DOCKER_IMAGE=817083319299.dkr.ecr.us-west-2.amazonaws.com/$ECR_REPO:$IMAGE
  $FE_REPO/codebuild/helper/find_ecr_image.sh $ECR_REPO $IMAGE
  IMAGE_FOUND=$?
  if [ $IMAGE_FOUND = 0 ]
  then
    docker pull $DOCKER_IMAGE
  else
    ./scripts/cypress_build_images.sh
    docker tag enlil_cypress_validators:$VALIDATORS_GIT_COMMIT_HASH $DOCKER_IMAGE
    docker push $DOCKER_IMAGE
  fi
  cd $HEAD_PWD
}

build_be &
build_fe &
build_validators &

wait
echo "Done with images"