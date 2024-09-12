#!/bin/bash
set -e

NPM=${1:-"20.12.0"}

source ~/.bashrc
source ~/.nvm/nvm.sh

nvm install $NPM
nvm use $NPM
npm install -g yarn@1.22.19
yarn cache clean
