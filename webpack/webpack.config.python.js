'use strict';

var compose = require('ramda').compose;

var babel = require('./partials/babel');
var defineEnv = require('./partials/defineEnv');
var shellPlugin = require('./partials/shellPlugin');
var entryDev = require('./partials/entryDev')
var outputDev = require('./partials/outputDev');
var sourceMapDev = require('./partials/sourceMapDev');
var baseConfig = require('./webpack.config');

module.exports = compose(
    babel,
    defineEnv,
    shellPlugin,
    entryDev,
    outputDev,
    sourceMapDev
)(baseConfig);
