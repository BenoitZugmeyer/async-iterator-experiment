#!/bin/bash

set -euo pipefail

for dir in basic-event weather; do
    echo "Build $dir..."
    rm -rf docs/$dir
    cp -r $dir docs/$dir
    rm docs/$dir/*.js
    rollup -c -i $dir/index.js -o docs/$dir/index.js
done
