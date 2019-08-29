import sys
import json
from environs import Env

def loadEnvVarsFrom(path):
    env = Env()
    env.read_env(path, recurse=False)
    return env

if len(sys.argv) >= 4:
    env = sys.argv[1]
    directory = sys.argv[2]
    key = sys.argv[3]

    path = "%s/%s.env" % (directory, env)
    env_vars = loadEnvVarsFrom(path)

    print(env_vars.str(key))
else:
    print('input error.')