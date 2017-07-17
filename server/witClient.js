'use strict';

const logger = require('../lib/logger');
// Superagent - Simplifies the HTTP requests from Node
const request = require('superagent');

function handleWitResponse(res) {
    logger.info('Wit Response: %j', res.entities);
    return res.entities;
}

module.exports = function witClient(token) {
    const ask = function ask(message, cbErr) {
        logger.info(`Ask Message - ${message}`);
        logger.info(`Wit Token - ${token}`);
        request.get('https://api.wit.ai/message')
            .set('Authorization', 'Bearer ' + token)
            .query({v: '13/07/2017'})
            .query({q: message})
            .end((err, res) => {
                // Wit Responded with Error, not a valid response
                if (err) cbErr(err);

                // Wit Responded with Not OK
                if (res.statusCode != 200) {
                    return cbErr('Expected Status Code 200, but got ' + res.statusCode);
                }
                const witResponse = handleWitResponse(res.body);
                return cbErr(null, witResponse);
            })
        ;
    }

    return {
        ask: ask
    }
};