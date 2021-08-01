#!/bin/bash
set -e

# Compile src/synth/synth.ts into build/src/synth/synth.js and dependencies
npx tsc -p tsconfig_synth_only.json

# Combine build/src/synth/synth.js and dependencies into docs/beepbox_synth.js
npx rollup build/src/synth/synth.js \
	--file docs/beepbox_synth.js \
	--format iife \
	--output.name beepbox \
	--context exports \
	--sourcemap \
	--plugin rollup-plugin-sourcemaps \
	--plugin @rollup/plugin-node-resolve

# Minify docs/beepbox_synth.js into docs/beepbox_synth.min.js
npx terser \
	docs/beepbox_synth.js \
	--source-map "content='docs/beepbox_synth.js.map',url=beepbox_synth.min.js.map" \
	-o docs/beepbox_synth.min.js \
	--compress \
	--mangle \
	--mangle-props regex="/^_.+/;"
