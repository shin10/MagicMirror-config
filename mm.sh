#!/bin/sh

if [ -f .env ]; then
  export $(echo $(cat .env | sed 's/#.*//g'| xargs) | envsubst);
  vars=$(echo $(cat .env | sed 's/#.*//g' | sed -r 's/(.*)=.*/$\1/g' ));
  envsubst "'$vars'" < ./config/config.template.js > ./config/config.js
fi

DISPLAY=:0 npm start