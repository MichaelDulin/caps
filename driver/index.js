'use strict';

const eventEmitter = require('../eventPool');
const handlePickup = require('./handler');

eventEmitter.on('pickup', handlePickup);