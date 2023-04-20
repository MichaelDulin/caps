'use strict';
// lab13

const { Server } = require('socket.io');
const MessageQueue = require('./lib/messageQueue');
const PORT = process.env.PORT || 3001;

let io = new Server(PORT);

let messages = io.of('/messages');
let inbox = new MessageQueue();

messages.on('connection', (socket) => {

  // client sends a message
  socket.on('send', (payload) => {
    console.log(JSON.stringify(payload));
    let recipientMessages = inbox.read(payload.recipientId);
    if (recipientMessages) {
      recipientMessages.store(payload.messageId, payload);
    } else {
      let recipientMessages = new MessageQueue();
      recipientMessages.store(payload.messageId, payload);
      inbox.store(payload.recipientId, recipientMessages);
    }
    messages.emit('send', payload);
  });

  socket.on('getMessages', (payload) => {
    let message = inbox.read(payload.recipientId);
    // send notification
    socket.emit('getMessages', message);
  });

  socket.on('received', (payload) => {
    try {
      let recipientMessages = inbox.read(payload.recipientId);
      let message = recipientMessages.remove(payload.messageId);
      console.log(message);
      socket.emit('confirm-received', message);
    } catch (e) {
      socket.emit('received-error', 'Couldnt remove message');
    }
  });
});