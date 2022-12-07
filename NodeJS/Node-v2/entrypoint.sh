#!/usr/bin/env sh
set -e

if [[ ! -f /usr/src/app/node_modules/.lock ]]; then
    yarn --no-progress
    touch /usr/src/app/node_modules/.lock
fi

if [[ "$ENV" = "TEST" ]]; then
    echo "Running eslint" && yarn lint
    echo "Running tests" && yarn test
else
    echo "Running dev" && yarn start:dev
fi
