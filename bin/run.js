/**
 * Created by dinesh on 10/7/17.
 */

'use strict';

const service = require('../server/service');
const constants = require('../lib/constants');
const http = require('http');
const server = http.createServer(service);
const winston = require('winston');
const slackClient = require('../server/slackClient');

const rtm = slackClient.init(constants.SLACK_BOT_TOKEN, constants.SLACK_LOG_LEVEL);
rtm.start();



server.on('listening', function() {
    winston.log('info', `MAYA is listening on port ${server.address().port} in ${service.get('env')} mode...`)
}).listen(3000);