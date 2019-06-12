DATE=`date '+%Y-%m-%d %H:%M:%S %Z %z'`
cat >> "./public/status.html" <<EOF 
<html>
	<div>
		<H1>Build Info</H1>
	</div>
	<div>
		<b>Repository:</b> "$BITBUCKET_REPO_FULL_NAME" 
	</div>
	<div>
		<b>Branch:</b> "$BITBUCKET_BRANCH"
	</div>
	<div>
		<b>Tag:</b> "$BITBUCKET_TAG"
	</div>
	<div>
		<b>Commit Hash:</b> "$BITBUCKET_COMMIT"
	</div>
	<div>
		<b>Build Number:</b> "$BITBUCKET_BUILD_NUMBER"
	</div>
	<div>
		<b>ECR Image:</b> "$IMAGE_NAME"
	</div>
	<div>
		<b>Date:</b> "$DATE"
	</div>
</html>
EOF

cat "./public/status.html"