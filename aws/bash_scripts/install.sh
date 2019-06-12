#!/bin/bash
set -e

apt-get update -y
apt-get install -y jq

pip3 install boto3
pip3 install environs
pip3 install awscli --upgrade