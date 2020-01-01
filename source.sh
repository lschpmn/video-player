#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"
PATH=:$DIR/node_modules/.bin/:$PATH;
alias start-client="electron . | grep -v ProductRegistryImpl.Registry"
alias start-server="nodemon -w ./server -e ts -x ts-node server/ < /dev/null"
alias start="start-server & start-client &"
