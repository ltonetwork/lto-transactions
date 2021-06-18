#!/bin/bash
set -ev

if [ "${TRAVIS_TAG}" = "" ]; then
  echo "Running version ..."
fi

#  if NOT TRAVIS_TAG > run npm version and push a new commit/tag
# else nothing
