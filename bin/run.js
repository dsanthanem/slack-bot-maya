/**
 * Created by dinesh on 10/7/17.
 */

'use strict';

const service = require('../server/service');
const http = require('http');
const winston = require('winston');
// winston.log('debug', 'Now my debug messages');
const server = http.createServer(service);

server.on('listening', function() {
    winston.log('info', `MAYA is listening on port ${server.address().port} in ${service.get('env')} mode...`)
}).listen(3000);