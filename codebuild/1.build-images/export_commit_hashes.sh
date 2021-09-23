cat <<EOF > $FE_REPO/commit_hashes.json
{
  "feCommit": "$FE_GIT_COMMIT_HASH",
  "beCommit": "$BE_GIT_COMMIT_HASH",
  "validatorsCommit": "$VALIDATORS_GIT_COMMIT_HASH"
}
EOF