#!/bin/bash

cd /home/ubuntu/server

node_modules/forever/bin/forever stopall

node_modules/forever/bin/forever \
start \
-al forever.log \
-ao out.log \
-ae err.log \
src/server.js
