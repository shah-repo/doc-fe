#!/bin/bash

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
  export ENLIL_COMPOSE_EXPOSE_GOTENBERG_PORT="3000"
  export ENLIL_COMPOSE_EXPOSE_DOCXTOPDF_PORT=4216
  export ENLIL_COMPOSE_EXPOSE_WORD_SERVICE_PORT=5000

  export ENLIL_BE_ENV_NAME="CYPRESS_TEST_$ENLIL_COMPOSE_SUITE_NUMBER"
  
  export VALIDATORS_CYPRESS_FE_URL="http://validators:$ENLIL_COMPOSE_EXPOSE_VALIDATORS_PORT"
  export REACT_APP_API_ENDPOINT="http://backend:$ENLIL_COMPOSE_EXPOSE_HAPROXY_PORT/api"
  export REACT_APP_FRONTEND_URL="http://frontend:$ENLIL_COMPOSE_EXPOSE_FE_PORT"
  export REACT_APP_WORKER_API_ENDPOINT="http://worker:$ENLIL_COMPOSE_EXPOSE_BE_WORKER_PORT/api"

  export REACT_APP_DATADOG_APPLICATION_ID="fake"
  export REACT_APP_DATADOG_CLIENT_TOKEN="fake"
  export REACT_APP_DATADOG_ENABLED="false"
  export REACT_APP_DATADOG_SAMPLE_RATE="0"

  export TYPEORM_DATABASE=${TYPEORM_DATABASE-cypress_db}
  export TYPEORM_HOST=postgres
  export ENLIL_DB_PERSIST=false
  export ECR_REPO="codebuild"
  export AWS_DEFAULT_REGION=us-west-2
set +a

echo "--| BE_GIT_COMMIT_HASH: $BE_GIT_COMMIT_HASH"
echo "--| FE_GIT_COMMIT_HASH: $FE_GIT_COMMIT_HASH"
echo "--| VALIDATORS_GIT_COMMIT_HASH: $VALIDATORS_GIT_COMMIT_HASH"
echo "--| EXPORT_GIT_COMMIT_HASH: $EXPORT_GIT_COMMIT_HASH"
echo "--| DOCXTOPDF_GIT_COMMIT_HASH: $DOCXTOPDF_GIT_COMMIT_HASH"
echo "--| ENLIL_COMPOSE_SUITE_NUMBER: $ENLIL_COMPOSE_SUITE_NUMBER"

build_be () {
  cd $BE_REPO
  IMAGE=be_server_${BE_GIT_COMMIT_HASH}
  $FE_REPO/codebuild/helper/find_ecr_image.sh $ECR_REPO $IMAGE
  IMAGE_FOUND=$?

  if [ $IMAGE_FOUND = 0 ]
  then
    echo "BE image found"
  else
    echo "BE image not found, building..."
    $FE_REPO/codebuild/1.build-images/build_and_push_be_images.sh
  fi
}

build_fe () {
  cd $FE_REPO
  IMAGE=fe_${FE_GIT_COMMIT_HASH}
  DOCKER_IMAGE=817083319299.dkr.ecr.us-west-2.amazonaws.com/$ECR_REPO:$IMAGE
  $FE_REPO/codebuild/helper/find_ecr_image.sh $ECR_REPO $IMAGE
  IMAGE_FOUND=$?

  if [ $IMAGE_FOUND = 0 ]
  then
    echo "FE image found"
  else
    echo "FE image not found, building..."
    $FE_REPO/codebuild/1.build-images/build_and_push_fe_image.sh
  fi
}

build_validators () {
  cd $VALIDATORS_REPO
  IMAGE=validators_${VALIDATORS_GIT_COMMIT_HASH}
  DOCKER_IMAGE=817083319299.dkr.ecr.us-west-2.amazonaws.com/$ECR_REPO:$IMAGE
  $FE_REPO/codebuild/helper/find_ecr_image.sh $ECR_REPO $IMAGE
  IMAGE_FOUND=$?
  if [ $IMAGE_FOUND = 0 ]
  then
    echo "Validators image found"
  else
    echo "Validators image not found, building..."
    ./scripts/cypress_build_images.sh
    docker tag enlil_cypress_validators:$VALIDATORS_GIT_COMMIT_HASH $DOCKER_IMAGE
    docker push $DOCKER_IMAGE
  fi
}

build_export () {
  cd $EXPORT_REPO
  IMAGE=doc_export_${EXPORT_GIT_COMMIT_HASH}

  DOCKER_IMAGE=817083319299.dkr.ecr.us-west-2.amazonaws.com/$ECR_REPO:$IMAGE
  $FE_REPO/codebuild/helper/find_ecr_image.sh $ECR_REPO $IMAGE
  IMAGE_FOUND=$?
  if [ $IMAGE_FOUND = 0 ]
  then
    echo "doc-export image found"
  else
    echo "doc-export  image not found, building..."
    ./scripts/cypress_build_images.sh
    docker tag enlil_doc_export:$EXPORT_GIT_COMMIT_HASH $DOCKER_IMAGE
    docker push $DOCKER_IMAGE
  fi
}

build_docx_to_pdf () {
  cd $DOCXTOPDF_REPO
  IMAGE=docx_to_pdf_${DOCXTOPDF_GIT_COMMIT_HASH}

  DOCKER_IMAGE=817083319299.dkr.ecr.us-west-2.amazonaws.com/$ECR_REPO:$IMAGE
  $FE_REPO/codebuild/helper/find_ecr_image.sh $ECR_REPO $IMAGE
  IMAGE_FOUND=$?
  if [ $IMAGE_FOUND = 0 ]
  then
    echo "docx-to-pdf image found"
  else
    echo "docx-to-pdf  image not found, building..."
    ./scripts/cypress_build_images.sh
    docker tag enlil_cypress_docxtopdf:$DOCXTOPDF_GIT_COMMIT_HASH $DOCKER_IMAGE
    docker push $DOCKER_IMAGE
  fi
}


build_word_service () {
  cd $BUILD_WORD_SERVICE_REPO
  IMAGE=word_service_${WORDSERVICE_GIT_COMMIT_HASH}

  DOCKER_IMAGE=817083319299.dkr.ecr.us-west-2.amazonaws.com/$ECR_REPO:$IMAGE
  $FE_REPO/codebuild/helper/find_ecr_image.sh $ECR_REPO $IMAGE
  IMAGE_FOUND=$?
  if [ $IMAGE_FOUND = 0 ]
  then
    echo "word-service image found"
  else
    echo "word-service image not found, building..."
    ./scripts/cypress_build_images.sh
    docker tag enlil_cypress_wordservice:$WORDSERVICE_GIT_COMMIT_HASH $DOCKER_IMAGE
    docker push $DOCKER_IMAGE
  fi
}


if [[ $BE_GIT_COMMIT_HASH ]]; then
  build_be &
fi
if [[ $FE_GIT_COMMIT_HASH ]]; then
  build_fe &
fi
if [[ $VALIDATORS_GIT_COMMIT_HASH ]]; then
  build_validators &
fi
if [[ $EXPORT_GIT_COMMIT_HASH ]]; then
  build_export &
fi
if [[ $DOCXTOPDF_GIT_COMMIT_HASH ]]; then
  build_docx_to_pdf &
fi
if [[ $WORDSERVICE_GIT_COMMIT_HASH ]]; then
  build_word_service &
fi

wait

echo "Done with building images"
