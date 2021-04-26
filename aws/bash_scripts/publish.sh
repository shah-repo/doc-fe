#!/bin/bash
set -e

ENV=$1

AWS_DIR="${BITBUCKET_CLONE_DIR}/aws"
ENVIRONMENT_DIR="${AWS_DIR}/environments"

set -o allexport
[[ -f "${ENVIRONMENT_DIR}/pipelines/${ENV}.env" ]] && source "${ENVIRONMENT_DIR}/pipelines/${ENV}.env"
set +o allexport

# Login to AWS
echo "-------- Logging into AWS --------"

if [ "${ENV}" == "prod" ] || [ "${ENV}" == "sandbox" ] || [ "${ENV}" == "prod2" ]; then
	export AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID_PROD
	export AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY_PROD
fi

tar -zxvf "compiled.tar.gz"

aws s3 sync "compiled/build/" \
	"s3://${DEPLOYMENT_BUCKET_NAME}" \
 	--acl public-read

aws cloudfront create-invalidation \
    --distribution-id "${CLOUDFRONT_DISTRIBUTION_ID}" \
    --paths "/*"