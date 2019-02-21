#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"
PATH=$PATH:$DIR/node_modules/.bin/
alias start-server="nodemon -w ./server -e ts -x ts-node server/server.ts < /dev/null"
alias start="webpack-dev-server & start-server & electron . | grep -v "ERROR:CONSOLE" &"