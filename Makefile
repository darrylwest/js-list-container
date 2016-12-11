JSFILES=index.js lib/*.js test/*.js
TESTFILES=test/*.js
JSHINT=node_modules/.bin/jshint
MOCHA=node_modules/.bin/mocha

all:
	@make test

npm:
	@( npm install )

jshint:
	@( [ -d node_modules ] || make npm )
	@( $(JSHINT) --verbose --reporter node_modules/jshint-stylish/ $(JSFILES) )

test:
	@( [ -d node_modules ] || make npm )
	@( $(MOCHA) $(TESTFILES) )
	@( $(JSHINT) --reporter node_modules/jshint-stylish/ $(JSFILES) )

watch:
	@( ./watcher.js )


.PHONY: jshint
.PHONY: npm
.PHONY: test
.PHONY: watch
.PHONY: build
