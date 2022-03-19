help: ## This help.
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+[a-zA-Z0-9_-]+:.*?## / {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

stow: ## stow config and styles
	@for i in ../config/config.js ../css/custom.css; do [ -f ./$${i} ] && mv --backup=numbered ./$${i} ./$${i}.pre-stow; done
	@stow config css start-script

install-modules: ## clone module repos and run npm install
	@for i in $$(cat modules.list); do $$(cd ../modules && git clone $${i}); done;
	@for i in ../modules/[^default]*; do [ -f ./$${i}/package.json ] && $$(cd $${i} && npm i && npm audit fix); done;

update-modules: ## pull modules and re-run npm install
	@for i in ../modules/[^default]*; do $$(cd $${i} && git pull; [ -f ./$${i}/package.json ] && $$(cd $${i} && npm i && npm audit fix)); done;

save-modules: ## write list of the installed module repositories
	@touch .tmp.modules.list;
	@for i in ../modules/[^default]*; do echo $$(cd $${i} && git remote get-url origin) >> .tmp.modules.list; done;
	@mv -f .tmp.modules.list modules.list;

git-status: ## git status of all installed modules
	@export CD=$(shell pwd); \
	for i in ../modules/[^default]*; do echo \\n$${i} && cd $${i} && git status --short; cd $${CD}; done;

PHONY: help stow install-modules update-modules save-modules git-status
