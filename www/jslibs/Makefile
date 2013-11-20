
all:
.PHONY: all

%.min.js: %.js
	uglifyjs -v --lint --source-map $@.map -o $@ $<
