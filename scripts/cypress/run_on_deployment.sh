#!/bin/bash
set -e

PS3='Please select the environment:'
options=("DEV" "DEMO" "SANDBOX" "PROD" "PROD2" "Quit")
select opt in "${options[@]}"
do
    echo "Selected $opt"
    case $opt in
        "DEV")
            echo "Running tests on $opt"
            export CYPRESS_BE_URL="https://api.dev.enlil.io"
            export CYPRESS_FE_URL="https://dev.enlil.io"
            export CYPRESS_SUPERADMIN_EMAIL="zoran.kovacevic+admin@codecons.com"
            export CYPRESS_SUPERADMIN_PASSWORD="Tester1!"
            ./scripts/cypress/run_in_parallel.sh
            break
            ;;
        "DEMO")
            echo "Running tests on $opt"
            export CYPRESS_BE_URL="https://api.demo.enlil.io"
            export CYPRESS_FE_URL="https://demo.enlil.io"
            export CYPRESS_SUPERADMIN_EMAIL="zoran.kovacevic+admin@codecons.com"
            export CYPRESS_SUPERADMIN_PASSWORD="Tester1!"
            ./scripts/cypress/run_in_parallel.sh
            break
            ;;
        "SANDBOX")
            echo "Running tests on $opt"
            export CYPRESS_BE_URL="https://api.sandbox.enlil.io"
            export CYPRESS_FE_URL="https://sandbox.enlil.io"
            ./scripts/cypress/run_in_parallel.sh
            break
            ;;
        "PROD")
            echo "Running tests on $opt"
            export CYPRESS_BE_URL="https://api.enlil.io"
            export CYPRESS_FE_URL="https://enlil.io"
            ./scripts/cypress/run_in_parallel.sh
            break
            ;;
        "PROD2")
            echo "Running tests on $opt"
            export CYPRESS_BE_URL="https://api.prod2.enlil.io"
            export CYPRESS_FE_URL="https://prod2.enlil.io"
            export CYPRESS_SUPERADMIN_EMAIL="zoran.kovacevic+admin@codecons.com"
            export CYPRESS_SUPERADMIN_PASSWORD="Tester1!"
            ./scripts/cypress/run_in_parallel.sh
            break
            ;;
        "Quit")
            echo "Exiting"
            break
            ;;
        *) echo "invalid option $REPLY";;
    esac
done

