DATE=`date '+%Y-%m-%d %H:%M:%S %Z %z'`
cat >> "./src/data/buildInfo.json" <<EOF 
{
"Repository": "$BITBUCKET_REPO_FULL_NAME",
"Branch": "$BITBUCKET_BRANCH",
"Tag": "$BITBUCKET_TAG",
"Commit Hash": "$BITBUCKET_COMMIT",
"Build Number": "$BITBUCKET_BUILD_NUMBER",
"ECR Image": "$IMAGE_NAME",
"Date": "$BITBUCKET_REPO_FULL_NAME"
}
EOF

cat "./src/data/buildInfo.json"