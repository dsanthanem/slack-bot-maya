'use strict';

const logger = require('../lib/logger');
var RtmClient = require('@slack/client').RtmClient;
var CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
var RTM_EVENTS = require('@slack/client').RTM_EVENTS;
let rtm;
let nlp;
let registry;

function handleOnAuthenticated(rtmStartData) {
    logger.info(`Logged in as '${rtmStartData.self.name.toUpperCase()}' of team "${rtmStartData.team.name}", but not yet connected to a channel`);
}
function handleOnRtmMessage(message) {

    if (message.text.toLowerCase().includes('maya')) {
        nlp.ask(message.text, (err, res) => {
            if (err) {
                logger.exception(err);
                return;
            }

            try {
                if (!res.intent || !res.intent[0] || !res.intent[0].value) {
                    throw new Error("Could not extract 'intent'");
                }

                const intent = require('./intents/' + res.intent[0].value);
                intent.process(res, registry, function (error, response) {
                    if (error) {
                        logger.error(error.message);
                        return;
                    }

                    return rtm.sendMessage(response, message.channel);
                });
            } catch (err) {
                logger.error(err);
                logger.error(res);
                return rtm.sendMessage("Sorry, I don't know what you are talking about", message.channel);
            }
        });
    } else {
        return rtm.sendMessage("Are you talking to me? (Include 'Maya' in your question)", message.channel);
    }

}


function addAuthenticatedHandler(rtm, handler) {
    rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, handler);
}
function addRtmMessageHandler(rtm, handler) {
    rtm.on(RTM_EVENTS.MESSAGE, handler);
}


module.exports.init = function slackClient(botToken, logLevel, nlpClient, serviceRegistry) {
    rtm = new RtmClient(botToken, {logLevel: logLevel});
    nlp = nlpClient;
    registry = serviceRegistry;
    addAuthenticatedHandler(rtm, handleOnAuthenticated);
    addRtmMessageHandler(rtm, handleOnRtmMessage);
    return rtm;
};
module.exports.addAuthenticatedHandler = addAuthenticatedHandler;
module.exports.addRtmMessageHandler = addRtmMessageHandler;