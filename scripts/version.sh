#!/bin/bash
set -ev

if [ "${TRAVIS_TAG}" = "" ]; then
  npm version patch

  git push --tags
fi
