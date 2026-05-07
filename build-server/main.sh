#!/bin/bash

echo "Starting build process..."

git clone "$GIT_REPOSITORY_URL" /home/app/output

node /home/app/script.js