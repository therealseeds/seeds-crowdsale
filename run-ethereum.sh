#! /bin/bash

#docker pull ethereum/client-go

docker run -d --name ethereum-node \
  -v /Users/Federico/ethereum:/root \
  -p 8545:8545 -p 30303:30303 \
  ethereum/client-go --fast --cache=512 --rinkeby --rpc --rpcaddr "0.0.0.0"
