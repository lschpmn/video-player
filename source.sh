#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"
PATH=$PATH:$DIR/node_modules/.bin/
alias server-watch="nodemon -w ./server -e ts -x ./node_modules/.bin/ts-node server/server.ts < /dev/null"