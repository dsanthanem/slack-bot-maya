'use strict';

const logger = require('../lib/logger');

class ServiceRegistry {

    constructor() {
        this._services = [];
        this._timeout = 30;
    }

    add(intent, ip, port) {
        const key = intent + ip + port;
        if(!this._services[key]) {
            this._services[key] = {};
            this._services[key].timestamp = Math.floor(new Date() / 1000);
            this._services[key].intent = intent;
            this._services[key].ip = ip;
            this._services[key].port = port;

            logger.info(`Added Service for intent '${intent}' on '${ip}:${port}'`);
            this._cleanup();
            return;
        }

        this._services[key].timestamp = Math.floor(new Date() / 1000);
        logger.info(`Updated Service for intent '${intent}' on '${ip}:${port}'`);
        this._cleanup();
    }

    remove(intent, ip, port) {
        const key = intent + ip + port;
        delete this._services[key];
        logger.info(`Deleted Service for intent '${intent}' on '${ip}:${port}'`);
    }

    get(intent) {
        this._cleanup();
        for(let key in this._services) {
            if(this._services[key].intent == intent) return this._services[key];
        }
        return null;
    }

    _cleanup() {
        const currTimestamp = Math.floor(new Date() / 1000);

        for(let key in this._services) {
            if(this._services[key].timestamp + this._timeout < currTimestamp) {
                remove(this._services[key].intent, this._services[key].ip, this._services[key].port);
            }
        }
    }

}

module.exports = ServiceRegistry;