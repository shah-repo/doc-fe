import sys
import json
import os.path
import boto3

def getSecretDictionary(key):
    client = boto3.client('secretsmanager')
    dictionary = client.get_secret_value(
        SecretId = key
    )
    return dictionary

if len(sys.argv) >= 3:
    storeName = sys.argv[1]
    key = sys.argv[2]
    dictionary = getSecretDictionary(storeName)
    print(dictionary[key])
else:
	print("")
	