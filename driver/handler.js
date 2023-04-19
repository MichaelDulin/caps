'use strict';

const { io } = require('socket.io-client');
const SERVER_URL = process.env.SERVER_URL || 'http://localhost:3001';

const { emitter, eventPool } = require('./../eventPool');

let capsSocket = io(SERVER_URL + '/caps');



function handlePickup(socket) {
  return function (payload) {
    socket.emit('in-transit', payload);
    socket.emit('delivered', payload);
  };
}

capsSocket.om('pickup', handlePickup(capsSocket));
