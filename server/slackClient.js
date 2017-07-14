'use strict';

const logger = require('../lib/logger');
var RtmClient = require('@slack/client').RtmClient;
var CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
var RTM_EVENTS = require('@slack/client').RTM_EVENTS;
let rtm;
let nlp;

function handleOnAuthenticated(rtmStartData) {
    logger.info(`Logged in as '${rtmStartData.self.name.toUpperCase()}' of team "${rtmStartData.team.name}", but not yet connected to a channel`);
}
function handleOnRtmMessage(message) {
    nlp.ask(message.text, (err, res) => {
        if(err) {
            logger.exception(err);
            return;
        }

        if(!res.intent) {
            return rtm.sendMessage("Sorry, I don't understand", message.channel);

        }

        if(res.intent[0].value == 'time' && res.location) {
            return rtm.sendMessage(`I don't yet know the time in ${res.location[0].value}`, message.channel);
        } else {
            return rtm.sendMessage("Sorry, I don't understand", message.channel);
        }

        rtm.sendMessage("Sorry, I don't understand", message.channel);
    });
}


function addAuthenticatedHandler(rtm, handler) {
    rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, handler);
}
function addRtmMessageHandler(rtm, handler) {
    rtm.on(RTM_EVENTS.MESSAGE, handler);
}


module.exports.init = function slackClient(botToken, logLevel, nlpClient) {
    rtm = new RtmClient(botToken, {logLevel: logLevel});
    nlp = nlpClient;
    addAuthenticatedHandler(rtm, handleOnAuthenticated);
    addRtmMessageHandler(rtm, handleOnRtmMessage);
    return rtm;
};
module.exports.addAuthenticatedHandler = addAuthenticatedHandler;
module.exports.addRtmMessageHandler = addRtmMessageHandler;