#!/bin/bash
set -e

NODE_ENV=development yarn install --frozen-lockfile

yarn unused-exports
