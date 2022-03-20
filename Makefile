SHELL:=/bin/bash
mmroot:=~/MagicMirror

help: ## This help.
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+[a-zA-Z0-9_-]+:.*?## / {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

stow: ## stow config and styles
	@for i in ${mmroot}/config/config.js ${mmroot}/css/custom.css; do echo $$([ -f ./$${i} ] && mv --backup=numbered ./$${i} ./$${i}.pre-stow); done
	@stow -t ${mmroot} MagicMirror

install-modules: ## clone module repos and run npm install
	@for i in $$(cat modules.list); do $$(cd ${mmroot}/modules && git clone $${i}); done;
	@for i in ${mmroot}/modules/[^default]*; do [ -f ./$${i}/package.json ] && $$(cd $${i} && npm i && npm audit fix); done;

update-modules: ## pull modules and re-run npm install
	@for i in ${mmroot}/modules/[^default]*; do $$(cd $${i} && git pull; [ -f ./$${i}/package.json ] && $$(cd $${i} && npm i && npm audit fix)); done;

save-modules: ## write list of the installed module repositories
	@touch .tmp.modules.list;
	@for i in ${mmroot}/modules/[^default]*; do echo $$(cd $${i} && git remote get-url origin) >> .tmp.modules.list; done;
	@mv -f .tmp.modules.list modules.list;

git-diff: ## git status of all installed modules
	@export CD=$(shell pwd); \
	for i in ${mmroot}/modules/[^default]*; do cd $${i}; if [[ $$(git status --short) != "" ]]; then echo; echo -e "\e[7m$${i}\e[0m"; git diff; fi; cd $${CD}; done;

git-status: ## git status of all installed modules
	@export CD=$(shell pwd); \
	for i in ${mmroot}/modules/[^default]*; do cd $${i}; if [[ $$(git status --short) != "" ]]; then echo; echo -e "\e[7m$${i}\e[0m"; git status --short; fi; cd $${CD}; done;

PHONY: help stow install-modules update-modules save-modules git-status
