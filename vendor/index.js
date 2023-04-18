'use strict';

const eventEmitter = require('../eventPool.js');
const { generatePayload, handledelivered } = require('./handlers.js');

eventEmitter.on('delivered', () => {
    console.log(`Thank you, ${payload.customer}`);
});

eventEmitter.emit('pickup', {
    "store": chance.company(),
    "orderID": chance.guid(),
    "customer": chance.name(),
    "address": chance.address()
});
