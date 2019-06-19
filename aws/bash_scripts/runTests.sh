#!/bin/bash
set -e

AWS_DIR="${BITBUCKET_CLONE_DIR}/aws"
ENVIRONMENT_DIR="${AWS_DIR}/environments"
BASH_SCRIPTS_DIR="${AWS_DIR}/bash_scripts"
PYTHON_SCRIPTS_DIR="${AWS_DIR}/python_scripts"

# Install Dependencies
echo "-------- Installing Dependencies --------"

chmod a+x "${BASH_SCRIPTS_DIR}/install.sh"
"${BASH_SCRIPTS_DIR}/install.sh"

# Exporting required variables
SCRIPT="${PYTHON_SCRIPTS_DIR}/getEnvValue.py"
export REACT_APP_API_ENDPOINT=$(python3 $SCRIPT $ENV $ENVIRONMENT_DIR REACT_APP_API_ENDPOINT 2>&1) 
export REACT_APP_AWS_COGNITO_CLIENT_ID=$(python3 $SCRIPT $ENV $ENVIRONMENT_DIR REACT_APP_AWS_COGNITO_CLIENT_ID 2>&1) 
export REACT_APP_FRONTEND_URL=$(python3 $SCRIPT $ENV $ENVIRONMENT_DIR REACT_APP_FRONTEND_URL 2>&1) 
export REACT_APP_SIGNUP_DOMAIN_URL=$(python3 $SCRIPT $ENV $ENVIRONMENT_DIR REACT_APP_SIGNUP_DOMAIN_URL 2>&1) 

# install dependencies 
yarn install
yarn add jest-junit

# build the app
echo "-------- Building Application --------"

yarn build

# execute tests
echo "-------- Executing Tests --------"

yarn test --outputFile "${AWS_DIR}/result.json" --json --no-watch --reporters="jest-junit"
rm -rf "${AWS_DIR}/test-reports"
mkdir "${AWS_DIR}/test-reports"
mv junit.xml "${AWS_DIR}/test-reports/junit.xml"

# Process test results
echo "-------- Processing Test Results --------"

python3 "${PYTHON_SCRIPTS_DIR}/testResultProcessor.py" "${AWS_DIR}"

# Print test results
echo "-------- Printing Test Results --------"

TEST_RESULT=$(python3 "${PYTHON_SCRIPTS_DIR}/getResult.py" "${AWS_DIR}/test_result.txt" "0")
TEST_RESULT_STATUS=$(python3 "${PYTHON_SCRIPTS_DIR}/getResult.py" "${AWS_DIR}/test_result_status.txt" "1")
echo "Test Result = ${TEST_RESULT}"
echo "Test Result Status = ${TEST_RESULT_STATUS}"

cat "${AWS_DIR}/result.json" | python3 -m json.tool

# fails if tests are not successful
if [ "${TEST_RESULT_STATUS}" == "0" ]; then
	echo "Pipeline failed as one or more tests did not pass."
	exit 1
fi