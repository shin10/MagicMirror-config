include .env
export

SHELL:=/bin/bash
mmroot:=$$(bash -c "eval echo $$MAGIC_MIRROR_ROOT_DIR")

help: ## This help.
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+[a-zA-Z0-9_-]+:.*?## / {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

create-config-from-template: ## substitute vars in config.template.js with .envs
	@if [ -f .env ]; then \
		vars=$$(echo $$(cat .env | sed 's/#.*//g' | sed -r 's/(.*)=.*/$$\1/g' )); \
		envsubst "'$$vars'" < ${mmroot}/config/config.template.js > ${mmroot}/config/config.js; \
		envsubst "'$$vars'" < ${mmroot}/css/custom.template.scss > ${mmroot}/css/custom.scss; \
	fi

start: ## create config from template and start mirror
	make create-config-from-template
	cd ${mmroot} && DISPLAY=:0 npm start

stow: ## stow config and styles
	@for i in ${mmroot}/config/config.js ${mmroot}/css/custom.css; do echo $$([ -f $${i} ] && mv --backup=numbered $${i} $${i}.pre-stow); done
	@stow -t ${mmroot} MagicMirror

stow-delete: ## unstow config and styles
	@stow -D -t ${mmroot} MagicMirror

install-modules: ## clone module repos and run npm install
	@$$(<modules.list xargs -d $$'\n' -t -i bash -c "cd ${mmroot}/modules && git clone -b {}")
	@export modules=${mmroot}/modules/[^default]* && \
	for i in $${modules}; do echo -e "\e[7m$${i}\e[0m"; [ -f $${i}/package.json ] && echo $$(sh -c "cd $${i} && (npm i && npm audit fix)") && echo "OK" || echo ""; done;
	# make sure python points to python3
	@echo -e "\e[7mlink python to python3\e[0"
	@sudo ln -s -i python3 /usr/bin/python
	# use raspberry version of grove gesture script
	@echo -e "\e[7mpick grove gesture script to match platform\e[0m"
	@ if (grep -q Raspbian /etc/os-release) && [[ -f ${mmroot}/modules/MMM-GroveGestures/py/grove_gesture_sensor.py.RPI ]]; then echo "rename py file" && cp -u -i ${mmroot}/modules/MMM-GroveGestures/py/grove_gesture_sensor.py.RPI ${mmroot}/modules/MMM-GroveGestures/py/grove_gesture_sensor.py; fi;

update-modules: ## pull modules and re-run npm install
	@export modules=${mmroot}/modules/[^default]* && \
	for i in $${modules}; do echo -e "\e[7m$${i}\e[0m"; echo $$(sh -c "cd $${i} && git pull; [ -f package.json ] && npm i && npm audit fix"); done;

force-audit-fix-modules: ## pull modules and re-run npm install
	@export modules=${mmroot}/modules/[^default]* && \
	for i in $${modules}; do echo -e "\e[7m$${i}\e[0m"; [ -f $${i}/package.json ] && echo $$(sh -c "cd $${i} && (npm audit fix --force)") && echo "done" || echo ""; done;

save-modules: ## write list of the installed module repositories
	@touch .tmp.modules.list;
	@export modules=${mmroot}/modules/[^default]* && \
	for i in $${modules}; do echo $$(cd $${i} && git branch --show-current --no-color && git remote get-url origin) >> .tmp.modules.list; done;
	@mv -f .tmp.modules.list modules.list;

git-diff: ## git status of all installed modules
	@export CD=$(shell pwd); \
	export modules=${mmroot}/modules/[^default]* && \
	for i in $${modules}; do cd $${i} && if [[ $$(git status --short) != "" ]]; then echo; echo -e "\e[7m$${i}\e[0m"; git diff; fi && cd $${CD}; done;

git-diff-s: ## git diff of all installed modules w/o whitespace
	@export CD=$(shell pwd); \
	export modules=${mmroot}/modules/[^default]* && \
	for i in $${modules}; do cd $${i} && if [[ $$(git status --short) != "" ]]; then echo; echo -e "\e[7m$${i}\e[0m"; git diff -s; fi && cd $${CD}; done;

git-status: ## git status of all installed modules
	@export CD=$$(pwd) && \
	export modules=${mmroot}/modules/[^default]* && \
	for i in $${modules}; do cd $${i} && if [[ $$(git status --short) != "" ]]; then echo; echo -e "\e[7m$${i}\e[0m"; git status --short; fi && cd $${CD}; done;

PHONY: help stow stow-delete create-config-from-template start install-modules update-modules save-modules git-diff git-diff-s git-status
