export BE_REPO="$HEAD_PWD/doc-be"
export FE_REPO="$HEAD_PWD/doc-fe"
export VALIDATORS_REPO="$HEAD_PWD/remote-js-validators"
export ENLIL_COMPOSE_SUITE_NUMBER="13"
export ENLIL_COMPOSE_PORT_RANGE_START=${ENLIL_COMPOSE_PORT_RANGE_START-5600}

export BE_GIT_COMMIT_HASH=$(cd $BE_REPO;git rev-parse HEAD | cut -c1-8)
export FE_GIT_COMMIT_HASH=$(cd $FE_REPO;git rev-parse HEAD | cut -c1-8)
export VALIDATORS_GIT_COMMIT_HASH=$(cd $VALIDATORS_REPO;git rev-parse HEAD | cut -c1-8)