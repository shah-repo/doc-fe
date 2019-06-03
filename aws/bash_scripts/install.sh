#!/bin/bash
set -e

pip3 install boto3
pip3 install environs
pip3 install awscli --upgrade --user
aws --version