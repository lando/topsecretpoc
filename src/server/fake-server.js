#!/usr/bin/env node

/**
 * A mock server to test out electron things
 *
 * @name fake-server
 */

'use strict';

// Some stubbed out data to return


// eslint-disable-next-line @typescript-eslint/no-var-requires
const http = require('http');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const data = require('./data');

const hostname = '127.0.0.1';
const port = 3720;

const server = http.createServer((req, res) => {
  // Good Defaults
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.statusCode = 200;

  // A few stubbed out endpoints
  if (req.url === '/ping') {
    res.end('pong');
  }
  // @NOTE:
  // Cannot stringify functions so we probably need to have the server
  // dump command files and then send back a path to the command dir
  else if (req.url === '/commands') {
    res.end(JSON.stringify(data.commands));
  }

  // Everthing else
  else {
    res.statusCode = 501;
    res.end('not implemented');
  }

  // Log
  console.log(`${req.method} request to ${req.url}, response status code ${res.statusCode}`);
  // console.log('Send with headers %j', req.headers);
});

server.listen(port, hostname, () => {
  console.log(`server running at http://${hostname}:${port}/`);
});
