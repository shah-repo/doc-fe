#!/bin/bash

set -a
source doc-fe/codebuild/env_vars_for_compose.sh
set +a

export DOCKER_COMPOSE_BE="$BE_REPO/cypress/docker-compose.yml"
export DOCKER_COMPOSE_FE="$BE_REPO/cypress/fe.docker-compose.yml"
export DOCKER_COMPOSE_SORRY_CY="$BE_REPO/cypress/sorry-cypress.docker-compose.yml"

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

if [[ -z "${ENLIL_COMPOSE_PORT_RANGE_START}" ]]; then
  echo "ENLIL_COMPOSE_PORT_RANGE_START not set, exiting"
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

# if [[ -z "${AWS_ACCESS_KEY_ID}" ]]; then
#   echo "AWS_ACCESS_KEY_ID not set, exiting"
#   echo "Use ./scripts/export_aws_credentials.sh"
#   exit
# fi
# if [[ -z "${AWS_SECRET_ACCESS_KEY}" ]]; then
#   echo "AWS_SECRET_ACCESS_KEY not set, exiting"
#   echo "Use ./scripts/export_aws_credentials.sh"
#   exit
# fi
# if [[ -z "${AWS_SESSION_TOKEN}" ]]; then
#   echo "AWS_SESSION_TOKEN not set, exiting"
#   echo "Use ./scripts/export_aws_credentials.sh"
#   exit
# fi


export COMPOSE_PROJECT_NAME="enlil_$ENLIL_COMPOSE_PORT_RANGE_START"

export ENLIL_COMPOSE_EXPOSE_BE_PORT="$((ENLIL_COMPOSE_PORT_RANGE_START+1))"
export ENLIL_COMPOSE_EXPOSE_FE_PORT="$((ENLIL_COMPOSE_PORT_RANGE_START+2))"
export ENLIL_COMPOSE_EXPOSE_VALIDATORS_PORT="$((ENLIL_COMPOSE_PORT_RANGE_START+3))"
export ENLIL_COMPOSE_EXPOSE_POSTGRES_PORT="$((ENLIL_COMPOSE_PORT_RANGE_START+4))"
export ENLIL_COMPOSE_EXPOSE_REDIS_PORT="$((ENLIL_COMPOSE_PORT_RANGE_START+5))"
export ENLIL_COMPOSE_EXPOSE_SORRY_CY_DIRECTOR_PORT="$((ENLIL_COMPOSE_PORT_RANGE_START+6))"
export ENLIL_COMPOSE_EXPOSE_SORRY_CY_API_PORT="$((ENLIL_COMPOSE_PORT_RANGE_START+7))"
export ENLIL_COMPOSE_EXPOSE_SORRY_CY_DASHBOARD_PORT="$((ENLIL_COMPOSE_PORT_RANGE_START+8))"
export ENLIL_COMPOSE_EXPOSE_BE_WORKER_PORT="$((ENLIL_COMPOSE_PORT_RANGE_START+9))"

export ENLIL_BE_AWS_SQS_QUEUE_URL="https://sqs.us-west-2.amazonaws.com/817083319299/cypress_terraform_test_dev_$ENLIL_COMPOSE_SUITE_NUMBER.fifo"
export ENLIL_BE_VALIDATORS_CYPRESS_FE_URL="http://validators:${ENLIL_COMPOSE_EXPOSE_VALIDATORS_PORT}"

export REACT_APP_API_ENDPOINT="http://backend:$ENLIL_COMPOSE_EXPOSE_BE_PORT/api"
export REACT_APP_WORKER_API_ENDPOINT="http://worker:$ENLIL_COMPOSE_EXPOSE_BE_WORKER_PORT/api"


export TYPEORM_DATABASE=${TYPEORM_DATABASE-cypress_db}
export TYPEORM_HOST=enlil_cypress_postgres

echo "--| BE_GIT_COMMIT_HASH: $BE_GIT_COMMIT_HASH"
echo "--| FE_GIT_COMMIT_HASH: $FE_GIT_COMMIT_HASH"
echo "--| VALIDATORS_GIT_COMMIT_HASH: $VALIDATORS_GIT_COMMIT_HASH"
echo "--| ENLIL_COMPOSE_SUITE_NUMBER: $ENLIL_COMPOSE_SUITE_NUMBER"
echo "--| ENLIL_COMPOSE_PORT_RANGE_START: $ENLIL_COMPOSE_PORT_RANGE_START"

aws sqs purge-queue --region=us-west-2 --queue-url $ENLIL_BE_AWS_SQS_QUEUE_URL

export ECR_REPO="codebuild"

for ARGUMENT in "$@"
do
    KEY=$(echo $ARGUMENT | cut -f1 -d=)
    case "$KEY" in
            BUILD_FE)
              cd $FE_REPO
              IMAGE=fe_${FE_GIT_COMMIT_HASH}
              DOCKER_IMAGE=817083319299.dkr.ecr.us-west-2.amazonaws.com/$ECR_REPO:$IMAGE
              $FE_REPO/codebuild/helper/find_ecr_image.sh $ECR_REPO $IMAGE
              IMAGE_FOUND=$?

              if [ $IMAGE_FOUND = 0 ]
              then
                docker pull $DOCKER_IMAGE
              else
                ./scripts/cypress_build_images.sh
                docker tag enlil_cypress_web:${FE_GIT_COMMIT_HASH}_${ENLIL_COMPOSE_PORT_RANGE_START} $DOCKER_IMAGE
                docker push $DOCKER_IMAGE
              fi
              cd $HEAD_PWD
            ;;
            BUILD_BE)
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
            ;;
            BUILD_VALIDATORS)
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
            ;;   
            *)   
    esac    
done
