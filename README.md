# MagicMirror-config

[![ISC License](https://img.shields.io/badge/license-ISC-blue.svg)](https://choosealicense.com/licenses/isc)

My personal configuration of [MagicMirror²](https://github.com/MichMich/MagicMirror) with some utility scripts.

## install

```sh
# clone the magic mirror itself
git clone https://github.com/MichMich/MagicMirror


# then clone the config
git clone https://github.com/shin10/MagicMirror-config.git
# or
git clone git@github.com:shin10/MagicMirror-config.git


# create/config .env (editing doesn't work in ssh sub-shell)
cp -iu MagicMirror-config/.env.template MagicMirror-config/.env && nano MagicMirror-config/.env

# stow config/css, install modules and start
$(
  cd MagicMirror-config &&
  make stow &&
  make install-modules &&
  make start
)

# pm2 - autostart
sudo npm install -g pm2
pm2 startup
# now run the prompted command

# setup autostart script
pm2 start MagicMirror-config/mm.sh
pm2 save
pm2 show
```

**Note:** # forked git@github.com:shin10/MMM-PIR-Sensor.git - postinstall: rebuilding electron might fail; if it does check ABI version

## update all installed modules

```sh
make update-modules
```

## backup module list

```sh
make save-modules
```

## .env/secrets

Unfortunately environment variables can't be used that simple in `config.js` without docker-compose since it's used in FE and BE as well. See: https://github.com/MichMich/MagicMirror/issues/1756

Running the following startup script in the MagicMirror² base directory will use `envsubst` to substitute variables defined in`.env` within the content of `config.template.js` to create the final `config.js`.

```sh
make start
```

Alternatively you can put `mm.sh` and your `.env` in the MagicMirror root directory.

### practical tip

```sh
echo ".env" > ~/.gitignore
git config --global core.excludesFile '~/.gitignore'
```
