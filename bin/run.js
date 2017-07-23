'use strict';

const service = require('../server/service');
const constants = require('../lib/constants');
const http = require('http');
const server = http.createServer(service);
const logger = require('../lib/logger');
const slackClient = require('../server/slackClient');
const witClient = require('../server/witClient')(constants.WIT_API_TOKEN);
const serviceRegistry = service.get('serviceRegistry');

const rtm = slackClient.init(constants.SLACK_BOT_TOKEN, constants.SLACK_LOG_LEVEL, witClient, serviceRegistry);
rtm.start();
slackClient.addAuthenticatedHandler(rtm, () => server.listen(3010));

server.on('listening', function () {
    logger.info(`MAYA is listening on port ${server.address().port} in ${service.get('env')} mode...`)
});

