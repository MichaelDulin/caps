'use strict';
//lab13

const io = require('socket.io-client');
const Chance = require('chance');
const SERVER_URL = process.env.SERVER_URL || 'http://localhost:3001';

const chance = new Chance();

const socket = io(SERVER_URL + '/messages');

let message = {
  text: 'Hi!',
  recipientId: 'Michael',
  messageId: chance.guid(),
};

let message2 = {
  text: 'Hello there!',
  recipientId: 'Michael',
  messageId: chance.guid(),
};

socket.emit('send', message);
socket.emit('send', message2);