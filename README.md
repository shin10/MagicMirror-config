# MagicMirror-config
## install

```sh

git clone git@github.com:shin10/MagicMirror-config.git

$(
  cd MagicMirror-config &&
  cp .env.template .env &&
  edit .env &&
  make stow &&
  make install-modules
)
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
