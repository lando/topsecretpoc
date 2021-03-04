#!/usr/bin/env node

/**
 * A mock server to test out electron things
 *
 * @name fake-server
 */

'use strict';


const http = require('http');

const hostname = '127.0.0.1';
const port = 3720;

const server = http.createServer((req, res) => {
  // Good Defaults
  res.setHeader('Content-Type', 'text/plain');
  res.statusCode = 200;

  // Basic ping/pong
  if (req.url === '/ping') {
    res.end('pong');
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
  console.log(`Server running at http://${hostname}:${port}/`);
});
