#!/bin/bash
set -e

FOLDER="scripts/cypress"
FILES=($(find $FOLDER -name "*.sh"))

for file in "${FILES[@]}"
do
  chmod +x $file
done

for file in "${FILES[@]}"
do
  if [[ ! -x "$file" ]]
  then
      echo "File '$file' is not executable or found"
      echo "Run 'chmod +x -R $FOLDER' and try again."
      echo "Exiting ..."
      exit
  fi
done
