#!/bin/bash

if [ -f .env ]; then
  export $(echo $(cat .env | sed 's/#.*//g'| xargs) | envsubst);
  vars=$(echo $(cat .env | sed 's/#.*//g' | sed -r 's/(.*)=.*/$\1/g' ));
  eval export MMRD="${MAGIC_MIRROR_ROOT_DIR}";
  envsubst "'$vars'" < ./MagicMirror/config/config.template.js > ${MMRD}/config/config.js
  cd ${MMRD} && DISPLAY=:0 npm start;
fi
