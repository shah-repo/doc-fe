#!/bin/bash
set -e
NUMBER_OF_THREADS=${1:-6}

DIRTY_FILES=($(yarn lint | grep ERROR | cut -d ' ' -f 2 | cut -d ':' -f1 | sort -u))

if [ ${#DIRTY_FILES[@]} -eq 0 ]; then
  echo "All files are good!"
  exit;
fi

yarn prettier --write $DIRTY_FILES

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

echo "All done"
