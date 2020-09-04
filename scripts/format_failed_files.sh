#!/bin/bash
set -e
NUMBER_OF_THREADS=${1:-6}

DIRTY_FILES=($(yarn lint --format unix --quiet --no-color 2>/dev/null | grep $(pwd) | cut -d ':' -f 1 | sort -u))

if [ ${#DIRTY_FILES[@]} -eq 0 ]; then
  echo "All files are good!"
  exit 1;
fi

FILES_PER_THREAD=$((${#DIRTY_FILES[@]} / $NUMBER_OF_THREADS))

if [ $FILES_PER_THREAD -eq 0 ]; then
  FILES_PER_THREAD=1
fi

for((i=0; i < ${#DIRTY_FILES[@]}; i+=FILES_PER_THREAD))
do
  part=( "${DIRTY_FILES[@]:i:FILES_PER_THREAD}" )
  yarn lint:fix ${part[*]} 2>/dev/null || true  &
  pids[${i}]=$!
done

for pid in ${pids[*]}; do
    wait $pid
done
yarn lint
