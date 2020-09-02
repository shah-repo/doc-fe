#!/bin/bash
set -e

if [[ -z "${ENLIL_COMPOSE_PORT_RANGE_START}" ]]; then
  echo "ENLIL_COMPOSE_PORT_RANGE_START not set, exiting"
  exit
fi

export ENLIL_COMPOSE_EXPOSE_BE_PORT="$((ENLIL_COMPOSE_PORT_RANGE_START+1))"
export ENLIL_COMPOSE_EXPOSE_FE_PORT="$((ENLIL_COMPOSE_PORT_RANGE_START+2))"

printf 'Waiting for backend .'
until $(curl --output /dev/null --silent --head --fail http://localhost:$ENLIL_COMPOSE_EXPOSE_BE_PORT/api/v1/healthcheck); do
    printf '.'
    sleep 2
done
echo ""

printf 'Waiting for frontend .'
until $(curl --output /dev/null --silent --head --fail http://localhost:$ENLIL_COMPOSE_EXPOSE_FE_PORT); do
    printf '.'
    sleep 2
done

echo ""
