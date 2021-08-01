#!/bin/bash
set -e

# Compile src/player/main.ts into build/src/player/main.js and dependencies
npx tsc -p tsconfig_player.json

# Combine build/src/player/main.js and dependencies into docs/player/beepbox_player.js
npx rollup build/src/player/main.js \
	--file docs/player/beepbox_player.js \
	--format iife \
	--output.name beepbox \
	--context exports \
	--sourcemap \
	--plugin rollup-plugin-sourcemaps \
	--plugin @rollup/plugin-node-resolve

# Minify docs/player/beepbox_player.js into docs/player/beepbox_player.min.js
npx terser \
	docs/player/beepbox_player.js \
	--source-map "content='docs/player/beepbox_player.js.map',url=beepbox_player.min.js.map" \
	-o docs/player/beepbox_player.min.js \
	--compress \
	--mangle \
	--mangle-props regex="/^_.+/;"
