#!/bin/bash
set -e

mapfile -t ci_build_ids < <(find ./results -maxdepth 1 -type d -ctime -2 -printf "%T@ %p\n" | sort -r | grep "./" | cut -d' ' -f2 | cut -d'/' -f3 | grep -v "^$")
for i in "${!ci_build_ids[@]}"; do
    printf "%s %s) %s\n" "--|" "$i" "${ci_build_ids[$i]}"
done
echo ""
printf '%s Select an interface from the above list: \n%s ' "--|" "--|"
IFS= read -r opt
if [[ $opt =~ ^[0-9]+$ ]] && (( (opt >= 0) && (opt < "${#ci_build_ids[@]}") )); then
    echo ""
    echo "--| CI_BUILD_ID=${ci_build_ids[$opt]}"
    export CI_BUILD_ID=${ci_build_ids[$opt]}
else
    echo "Option '$opt' not on list. Exiting"
    exit 1;
fi
