'use strict';

const eventEmitter = require('../eventPool.js');
const { generatePayload, handledelivered } = require('./handlers.js');

eventEmitter.on('delivered', handledelivered);

eventEmitter.emit('pickup', generatePayload());
