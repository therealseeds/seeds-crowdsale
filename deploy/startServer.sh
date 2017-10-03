#!/bin/bash

cd /home/ubuntu/server

node_modules/forever/bin/forever stopall

killall node

node_modules/forever/bin/forever \
start \
-al forever.log \
-ao out.log \
-ae err.log \
-c node_modules/.bin/babel-node \
src/server.js
