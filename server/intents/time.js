'use strict';

const logger = require('../../lib/logger');
const request = require('superagent');

module.exports.process = function process(intentData, cb) {

    if(intentData.intent[0].value !== 'time') {
        return cb(new Error(`Expected Time intent, but got ${intentData.intent[0].value} instead`))
    }

    if(!intentData.location) {
        return cb(new Error(`Missing location in time intent`));
    }

    const location = intentData.location[0].value.replace(/,.?maya/i, '');
    request.get(`http://localhost:3010/time/${location}`, (err, res) => {
        if(err || res.statusCode != 200 || !res.body.result) {
            logger.info(err);
            logger.info(res.body);

            return cb(false, `I had a problem finding out the time in ${location}`);
        }
        const timeFormat = res.body.result;
        //return cb(false, `In ${location}, time is now ${timeFormat.time}`);
        return cb(false, `In ${location}, it is ${timeFormat.dateTime}`);
    });

};