'use strict';

const eventemitter = require('./eventPool.js');

const logEvent = (eventName) => (payload) => {
    console.log(`
        EVENT: {
            event: ${eventName},
            time: ${new Date()},
            payload: ${payload}
        }
    `);
}

eventemitter.on('pickup', logEvent('pickup'));
eventemitter.on('in-transit', logEvent('in-transit'));
eventemitter.on('delivered', logEvent('delivered'));

requirwe('./driver');
require('./vendor');