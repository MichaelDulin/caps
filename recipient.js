'use strict';
//lab13

const io = require('socket.io-client');
const SERVER_URL = process.env.SERVER_URL || 'http://localhost:3001';

const socket = io(SERVER_URL + '/messages');

// Must match static message written in sender.js
socket.emit('getMessages', { recipientId: 'Michael'});

socket.on('getmessage', (payload) => {
  console.log(payload);

  Object.values(payload.data).forEach(message => {
    socket.emit('received', message);
  });
});

socket.on('confirmed-received', (payload) => {
  console.log('Message Removed!', payload.messageId);
});