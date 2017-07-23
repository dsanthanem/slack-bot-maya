'use strict';

const logger = require('../../lib/logger');

module.exports.process = function process(intentData, registry, cb) {

    if(intentData.intent[0].value !== 'greetings') {
        return cb(new Error(`Expected greetings, but got ${intentData.intent[0].value} instead`));
    }

    if(!intentData.contact || !intentData.contact[0].value) {
        return cb(new Error(`Did you say greetings to me?`));
    }

    return cb(false, `Hello there, ${intentData.contact[0].value}. How are you doing?`);
};