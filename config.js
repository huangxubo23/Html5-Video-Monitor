'use strict';

/**
 * Module dependencies.
 */

const version = require('./package.json').version;

let config = {
    version: version,
    debug: process.env.NODE_ENV !== 'production',
    port: process.env.PORT || 3080
};

module.exports = config;