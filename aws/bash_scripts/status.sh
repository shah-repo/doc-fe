DATE=`date '+%Y-%m-%d %H:%M:%S %Z %z'`
FILE="./src/data/buildInfo.json"
rm -rf $FILE
cat >> $FILE <<EOF 
{
"Repository": "$BITBUCKET_REPO_FULL_NAME",
"Branch": "$BITBUCKET_BRANCH",
"Tag": "$BITBUCKET_TAG",
"Commit Hash": "$BITBUCKET_COMMIT",
"Build Number": "$BITBUCKET_BUILD_NUMBER",
"ECR Image": "$IMAGE_NAME",
"Date": "$DATE"
}
EOF

cat $FILE