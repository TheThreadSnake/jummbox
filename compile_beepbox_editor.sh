#!/bin/bash
set -e

# Compile src/editor/main.ts into build/src/editor/main.js and dependencies
npx tsc

# Combine build/src/editor/main.js and dependencies into docs/beepbox_editor.js
npx rollup build/src/editor/main.js \
	--file docs/beepbox_editor.js \
	--format iife \
	--output.name beepbox \
	--context exports \
	--sourcemap \
	--plugin rollup-plugin-sourcemaps \
	--plugin @rollup/plugin-node-resolve

# Minify docs/beepbox_editor.js into docs/beepbox_editor.min.js
npx terser \
	docs/beepbox_editor.js \
	--source-map "content='docs/beepbox_editor.js.map',url=beepbox_editor.min.js.map" \
	-o docs/beepbox_editor.min.js \
	--compress \
	--mangle \
	--mangle-props regex="/^_.+/;"

# Combine the html and js into a single file for the offline version
sed \
	-e '/INSERT_BEEPBOX_SOURCE_HERE/{r docs/beepbox_editor.min.js' -e 'd' -e '}' \
	docs/jummbox_offline_template.html \
	> docs/jummbox_offline.html
