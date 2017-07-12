'use strict';

const winston = require('winston');
var RtmClient = require('@slack/client').RtmClient;
var CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
var RTM_EVENTS = require('@slack/client').RTM_EVENTS;
let channel;
let rtm;

function handleAuthenticated(rtmStartData) {
    for (const c of rtmStartData.channels) {
        if (c.is_member && c.name ==='general') { channel = c.id }
    }
    winston.info(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not yet connected to a channel`);
}
function handleRtmConnectionOpened() {
    // you need to wait for the client to fully connect before you can send messages
    rtm.sendMessage("Hello..! My name is Maya and i am a Bot.", channel);
}
function handleRtmMessage() {
    rtm.sendMessage("Hi there. Guess am not alone", channel);
}

function addAuthenticatedHandler(rtm, handler) {
    rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, handler);
}
function addRtmConnectionOpenedHandler(rtm, handler) {
    rtm.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, handler);
}
function addRtmMessageHandler(rtm, handler) {
    rtm.on(RTM_EVENTS.MESSAGE, handler);
}


module.exports.init = function slackClient(botToken, logLevel) {
    rtm = new RtmClient(botToken, {logLevel: logLevel});
    addAuthenticatedHandler(rtm, handleAuthenticated);
    addRtmConnectionOpenedHandler(rtm, handleRtmConnectionOpened);
    addRtmMessageHandler(rtm, handleRtmMessage);
    return rtm;
};
module.exports.addAuthenticatedHandler = addAuthenticatedHandler;
module.exports.addRtmConnectionOpenedHandler = addRtmConnectionOpenedHandler;
module.exports.addRtmMessageHandler = addRtmMessageHandler;