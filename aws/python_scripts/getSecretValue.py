import sys
import json
import os.path
import boto3

def getSecretsJson(key):
    client = boto3.client('secretsmanager')
    dictionary = client.get_secret_value(
        SecretId = key
    )
    return dictionary["SecretString"]

if len(sys.argv) >= 3:
    storeName = sys.argv[1]
    key = sys.argv[2]
    dictionary = json.loads(getSecretsJson(storeName))
    print(dictionary[key])
else:
	print("failed")
	