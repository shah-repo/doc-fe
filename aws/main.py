import sys
import json

if len(sys.argv) >= 3:
    name = sys.argv[1]
    image = sys.argv[2]
    with open('./aws/AWS.TaskDefinition.Template.json') as taskDefinition:
        data = json.load(taskDefinition)
        for containerDefinition in data['containerDefinitions']:
            if containerDefinition['name'] == '<container_name>':
                containerDefinition['name']  = name
                containerDefinition['image'] = image
        print(data)
        with open('./aws/AWS.TaskDefinition.json', 'w') as taskDefinitionOut:
            json.dump(data, taskDefinitionOut)
else:
    print('input error.')