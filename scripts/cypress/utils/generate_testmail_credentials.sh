cat <<EOF > ./cypress/credentials/credentials.json
{
  "installed": {
    "client_id": "99719099588-qfjn6tqo97saj933uu6g4mshnbpp3f8j.apps.googleusercontent.com",
    "project_id": "cypress-tests-1611328604549",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_secret": "2m13DacK5AfBHkPjkLDrpWHl",
    "redirect_uris": [
      "urn:ietf:wg:oauth:2.0:oob",
      "http://localhost"
    ]
  }
}
EOF

cat <<EOF > ./cypress/credentials/gmail_token.json
{
  "access_token": "ya29.a0AfH6SMCB7TXAzlF_rBR1gn92pTJ0qICltXcCKP7LENRv54omQkDFg8Zv_UyKW90HazCWgvs7WzTW0NLF5ubNoZ84i-2d68_pVjpGv0A-T6LmNNGabB9FsLxuO6xo6XH1a6n4hQc8DCv12MmxjiKyjvKTIFmXGrDc-f-UbfKok3g",
  "refresh_token": "1//0gKlTfWqhtf2zCgYIARAAGBASNwF-L9Irf4lV3WAR1TlhbvMBPKAONupeKzK4RQefSbaZ-0Mim_H3CzjdL16oMm17zAsI23rSmTg",
  "scope": "https://www.googleapis.com/auth/gmail.readonly",
  "token_type": "Bearer",
  "expiry_date": 1611489361509
}
EOF