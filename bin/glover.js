#!/usr/bin/env node

/**
 * Main CLI entrypoint POC
 *
 * @name glover
 */

/* GENERAL CLI FLOW (for purposes of testing our assumptions, Lando 4 flow may differ)
 *
 *   1. Bootstrap config for CLI (eg Lando server settings)
 *   2. Gather context (in Lando this would be "app" vs "global"), do we need to know other config here eg Landofile names? get from server?
 *   3. Get raw user input eg command and options passed into the cli but not interactive questions
 *   4. Send context and raw user input to SERVER
       * Do we want to ping to ensure up first? throw an error if server is off? etc
     5. If additional user input is required for the command activate the interactive command call loop until all needed input is gathered
     6. Execute command with user input on SERVER side
     7. Stream relevant SERVER output to the CLI
     8. Write exit code and end process
 *
 */

/*
 * Other CLI feature considerations/improvements over Lando 3 or general notes to remember
 *
 * * Use of the -- seperator if you want explicit option separation, see: https://github.com/lando/lando/pull/2572
 * * Smart delegation of --help and --verbose by default
 * * Some apps like platform.sh ones can have more than one cached menus per lando app
 *
 */

'use strict';

// MODULES
const _ = require('lodash');
const path = require('path');
const parser = require('yargs-parser');
const yargs = require('yargs');
const { createLogger, format, transports } = require('winston');

// LOG
const logLevels = {
  '0': 'error',
  '1': 'warn',
  '2': 'info',
  '3': 'verbose',
  '4': 'debug',
  '5': 'silly',
};

// SERVER
const LANDO_HOST = process.env.LANDO_HOST;
const LANDO_PORT = process.env.LANDO_PORT;
const LANDO_SOCKET = process.env.LANDO_SOCKET;

// YARGS
const parserConfig = {'populate--': true};
const verboseOptions = {
  alias: 'v',
  describe: 'Runs with extra verbosity',
  type: 'count',
};
yargs.parserConfiguration(parserConfig);

// Get user input and context
// @TODO: do we want config/context to be provided beyond hardcoded values?
// eg looking for a config file and loading it A LA the landofile?
const config = {};
const context = 'app';
const rawInput = process.argv.slice(2);
const parsedInput = parser(process.argv.slice(2), {
  count: ['v'],
  alias: {verbose: ['v']},
  configuration: parserConfig,
});

// Calculate console log level
const logLevel = parsedInput.v ? logLevels[parsedInput.verbose + 2] : 'info';
// Create the logger
const log = createLogger({
  level: logLevel,
  format: format.combine(format.colorize(), format.splat(), format.simple()),
  transports: [new transports.Console()],
});

// Merge all our stuff together
const data = {config, context, raw: rawInput, input: parsedInput, logLevel};

// Start the runtime
log.verbose('log level set to %s', logLevel);
log.verbose('context set to %s', context);
log.verbose('config discovered %j', config);
log.verbose('raw user input %j', rawInput);
log.verbose('parsed user input %j', parsedInput);
log.debug('combined data payload to be sent to server %j', data);

/* SEND DATA TO SERVER ENDPOINT THAT STARTS COMMAND CALL FLOW, THREE THINGS CAN HAPPEN HERE:
 *
 * 1. Sent is good and requires no additional input from user, execute command and stream output until exit code
 * 2. Sent data requires additional input from user, begins inquirer prompt loop
 * 3. No command is sent, data is returned so CLI menu can be rendered
 */

// Yargs!
yargs.usage('Usage: glover <command> [args] [options]')
  .demandCommand(1, 'You need at least one command before moving on')
  .example('glover start', 'Run glover start')
  .middleware([(argv => {
    argv.lando = data;
  })])
  .recommendCommands()
  .wrap(yargs.terminalWidth() * 0.70)
  .help(true)
  .option('verbose', verboseOptions)
  .version(false);


// Loop through the tasks and add them to the CLI
/*
_.forEach(_.sortBy(tasks, 'command'), task => {
  if (_.has(task, 'handler')) yargs.command(task);
  else yargs.command(this.parseToYargs(task));
});
*/

// YARGZ MATEY
yargs.argv;
