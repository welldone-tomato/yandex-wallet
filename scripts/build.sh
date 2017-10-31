#!/bin/bash

# check version of docker
hash docker 2>/dev/null || { echo >&2 -e "\e[33mYou dont have docker daemon. Please check, fix or install it.\e[0m"; exit 1; }
hash docker-compose 2>/dev/null || { echo >&2 -e "\e[33mYou dont have docker-compose script. Please check, fix or install it.\e[0m"; exit 1; }

hash node 2>/dev/null || { echo >&2 -e "\e[33mYou dont have node. Please check, fix or install it.\e[0m"; exit 1; }
hash npm 2>/dev/null || { echo >&2 -e "\e[33mYou dont have npm. Please check, fix or install it.\e[0m"; exit 1; }

dir=$(cd -P -- "$(dirname -- "$0")" && pwd -P)

npm install $dir/..
#npm run test:server $dir/..
npm run build $dir/..

docker build $dir/.. -t yandex-wallet