'use strict';

const logger = require('../../lib/logger');
const request = require('superagent');

module.exports.process = function process(intentData, registry, cb) {

    if(intentData.intent[0].value !== 'weather') {
        return cb(new Error(`Expected Weather intent, but got ${intentData.intent[0].value} instead`))
    }

    if(!intentData.location) {
        return cb(new Error(`Missing location in weather intent`));
    }

    const service = registry.get('weather');
    if(!service) return cb(false, 'Weather service is not available');
    const location = intentData.location[0].value.replace(/,.?maya/i, '');
    request.get(`http://localhost:${service.port}/weather/${location}`, (err, res) => {

        if(err || res.statusCode != 200 || !res.body.result) {
            logger.info(err);
            return cb(false, `I had a problem finding out the weather in ${location}`);
        }

        return cb(false, `In ${location}, it is ${res.body.result}`);

    });

};