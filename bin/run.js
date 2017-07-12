'use strict';

const service = require('../server/service');
const constants = require('../lib/constants');
const http = require('http');
const server = http.createServer(service);
const winston = require('winston');
const slackClient = require('../server/slackClient');

const rtm = slackClient.init(constants.SLACK_BOT_TOKEN, constants.SLACK_LOG_LEVEL);
rtm.start();
slackClient.addAuthenticatedHandler(rtm, () => server.listen(3000));


server.on('listening', function() {
    winston.info(`MAYA is listening on port ${server.address().port} in ${service.get('env')} mode...`)
});

