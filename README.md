# PRIVATE! Magic Mirror² config
## install

```sh
cd ~/MagicMirror

git clone git@github.com:shin10/.MM-config.git

$(
  cd .MM-config &&
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

Unfortunately environment variables can't be used that simple in `config.js` since it's used in FE and BE as well. See: https://github.com/MichMich/MagicMirror/issues/1756

Running the following startup script in the MagicMirror² base directory will use `envsubst` to substitute variables defined in`.env` within the content of `config.template.js` to create the final `config.js`.

```sh
./mm.sh
```

### practical tip

```sh
echo ".env" > ~/.gitignore
git config --global core.excludesFile '~/.gitignore'
```
