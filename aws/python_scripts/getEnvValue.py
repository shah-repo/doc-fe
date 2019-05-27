import sys
import json
from environs import Env

def loadEnvVarsFrom(path):
    env = Env()
    env.read_env(path, recurse=False)
    return env

if len(sys.argv) >= 3:
    env = sys.argv[1]
    key = sys.argv[2]

    path = "./aws/environments/%s.env" % env
    env_vars = loadEnvVarsFrom(path)

    print(env_vars(key))
else:
    print('input error.')