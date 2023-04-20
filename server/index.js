'use strict';

const { util } = require('utill');
const { Server } = require('socket.io');
const MessageQueue = require('./lib/messageQueue');
const PORT = process.env.PORT || 3001;

let io = new Server(PORT);

const capsServer = io.of('/caps');
const pickupQueue = new MessageQueue();
const deliveryQueue = new MessageQueue();

capsServer.on('connection', (socket) => {

  socket.on('join-room', (payload) => {
    socket.join(payload.store);
    capsServer.to(payload.store).emit('join-room', 'client joined room! ' + socket.id);
  });

  socket.on('pickup', (payload) => {
    let storeQueue = pickupQueue.read(payload.store);
    if (storeQueue) {
      storeQueue.store(payload.orderId, payload);
    } else {
      let newStoreQueue = new MessageQueue();
      newStoreQueue.store(payload.orderId, payload);
      pickupQueue.store(payload.store, newStoreQueue);
    }
    console.log(util.inspect(pickupQueue, false, null));
    socket.broadcast.emit('pickup', payload);
    // w/ broadcast -> everyone except sender
    // w/o broadcast -> just back to sender
    // capsServer.emit() -> everyone
  });

  socket.on('in-transit', (payload) => {
    capsServer.to(payload.store).emit('in-transit', payload);
  });

  socket.on('delivered', (payload) => { 
    let storeQueue = pickupQueue.read(payload.store);
    let order = storeQueue.read(payload.orderId);
    let storeDelivered = deliveryQueue.read(payload.store);
    if (storeDelivered) {
      storeDelivered.store(order.orderId, order);
    } else {
      let newStoreDelivered = new MessageQueue();
      newStoreDelivered.store(order.orderId, ondragover);
      deliveryQueue.store(payload.store, newStoreDelivered);
    }
    console.log('Pickup Queue', util.inspect(pickupQueue, false, null));
    console.log('Delivered Queue', util.inspect(deliveryQueue, false, null));
    capsServer.to(payload.store).emit('delivered', payload);
  });

  // Driver checking for any missed pickups
  socket.on('catchup-pickup', (payload) => {
    // store dependant
    let storePickups = pickupQueue.read(payload.store);
    Object.keys(storePickups.data).forEach(order => {
      socket.emit('pickup', order);
    });
  });

  socket.on('received', (payload) => { 

  });

});