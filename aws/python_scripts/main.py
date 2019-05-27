import sys
import json
import boto3
from environs import Env

keyDatabaseInfo = 'shifamed/doc-fe/%s/env/vars'

def loadEnvVarsFrom(path):
    env = Env()
    env.read_env(path, recurse=False)
    return env

def replaceValues(envDict, destinationArray):
    for index, item in enumerate(destinationArray):
        setting = destinationArray[index]
        name = setting["name"]
        if envDict(name, default="|error|") != "|error|":
            setting["value"] = envDict(name)
        #print(setting["name"] + " = " + envDict(setting["name"]))
    return destinationArray

def replaceValuesFromSecretManager(envDict, destinationArray):
    #print(envDict)
    for index, item in enumerate(destinationArray):
        setting = destinationArray[index]
        name = setting["name"]
        if name in envDict:
            setting["value"] = envDict[name]
            #print(name + " = " + envDict[name])
    return destinationArray

def getSecretValue(key):
    client = boto3.client('secretsmanager')
    dictionary = client.get_secret_value(
        SecretId = key
    )
    return dictionary['SecretString']

if len(sys.argv) >= 4:
    name  = sys.argv[1]
    image = sys.argv[2]
    env   = sys.argv[3]

    path = "./aws/environments/%s.env" % env
    env_vars = loadEnvVarsFrom(path)

    keyDatabaseInfo = keyDatabaseInfo % env
    databaseInfo = json.loads(getSecretValue(keyDatabaseInfo))

    with open('./aws/AWS.TaskDefinition.Template.json') as taskDefinition:
        data = json.load(taskDefinition)
        for containerDefinition in data['containerDefinitions']:
            if containerDefinition['name'] == '<container_name>':
                containerDefinition['name']  = name # set container name
                containerDefinition['image'] = image # ser container image

                destinationArray = containerDefinition['environment']
                replaceValues(env_vars, destinationArray) # replace values from local env file
                replaceValuesFromSecretManager(databaseInfo, destinationArray) # replace values from AWS secret manager
        print(data)
        with open('./aws/AWS.TaskDefinition.json', 'w') as taskDefinitionOut:
            json.dump(data, taskDefinitionOut)
else:
    print('input error.')