#!/usr/bin/env node

/**
 * Main CLI entrypoint POC
 *
 * @name glover
 */

'use strict';

// Minimal modules we need to get the cli rolling
// const _ = require('lodash');


// Allow envvars to override a few core things
const LOGLEVELCONSOLE = process.env.LANDO_CORE_LOGLEVELCONSOLE;
const ENVPREFIX = process.env.LANDO_CORE_ENVPREFIX;
const USERCONFROOT = process.env.LANDO_CORE_USERCONFROOT;

console.log("WHATUP YO");
