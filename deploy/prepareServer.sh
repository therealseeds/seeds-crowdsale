#!/bin/bash

cd /home/ubuntu/server

npm install

aws s3 cp "s3://seedsconfigs/seeds_crowdsale_config.js" /home/ubuntu/server/config/default.js --region us-east-1
