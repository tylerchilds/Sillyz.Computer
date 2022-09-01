DENO_VERSION := 1.25.0
DENO_INSTALL := third_party
include deno.mk

.PHONY: all
all: compile

compile: $(DENO_BIN)
	# compile
	$(call deno, compile \
		--unstable \
		-A \
		--output=Sillyz.Computer \
		server.js)
