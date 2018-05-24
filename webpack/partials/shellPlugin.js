'use strict';

var partial = require('webpack-partial').default;
var WebpackShellPlugin = require('webpack-shell-plugin')


module.exports = function (config) {
    return partial(config, {
        plugins: [
            new WebpackShellPlugin({
              onBuildEnd: ["/node_modules/.bin/react-docgen --pretty -o lib/metadata.json src/components && node -e \"const fs = require('fs'); const path = require('path'); const m = JSON.parse(fs.readFileSync('./lib/metadata.json')); const r = {}; Object.keys(m).forEach(k => r[k.split(path.sep).join('/')] = m[k]); fs.writeFileSync('./lib/metadata.json', JSON.stringify(r, '\t', 2));\" && echo 'Shellplugin Done'"]
            })
        ]
    });
};
