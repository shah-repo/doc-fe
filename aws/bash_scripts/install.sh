#!/bin/bash
set -e

if [[ "$OSTYPE" == "linux-gnu" ]]; then
	apt-get update -y
	apt-get install -y jq

	if command -v python3 &>/dev/null; then
		echo "- Python3 is installed."
	else 
		# install python
		apt-get install -y python3.6
	fi	

	if command -v pip3 &>/dev/null; then
		echo "- Pip3 is installed."
	else 
		# install pip3
		apt-get install -y python3-pip
	fi

	pip3 install boto3
	pip3 install environs
	pip3 install awscli --upgrade
fi