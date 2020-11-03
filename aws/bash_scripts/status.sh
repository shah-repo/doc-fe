DATE=`date '+%Y-%m-%d %H:%M:%S %Z %z'`
FILE="./src/data/buildInfo.json"
RELEASE_VERSION=$(cat package.json | jq '.version')

rm -rf $FILE
cat >> $FILE <<EOF 
{
"Repository": "$BITBUCKET_REPO_FULL_NAME",
"Branch": "$BITBUCKET_BRANCH",
"Tag": "$BITBUCKET_TAG",
"Commit Hash": "$BITBUCKET_COMMIT",
"Build Number": "$BITBUCKET_BUILD_NUMBER",
"ECR Image": "$IMAGE_NAME",
"Date": "$DATE",
"Release Version": $RELEASE_VERSION
}
EOF

cat $FILE