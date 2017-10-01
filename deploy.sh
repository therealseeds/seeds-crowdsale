#! /bin/bash

docker build -t seeds/crowdsale .

docker run -d --name seeds-crowdsale \
  -p 8080:8080 \
  -e CROWDSALE_ADDRESS \
  -e MONGO_HOST \
  -e MONGO_PORT \
  -e MONGO_USER \
  -e MONGO_PASS \
  -e MONGO_DATABASE \
  -e MONGO_REPLICA \
  seeds/crowdsale
