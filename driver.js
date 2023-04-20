'use strict';

const { subscribe, trigger } = require('./client');

subscribe('join-room', console.log);
trigger('catchup-pickup', { store: '1-800-flowers' });

subscribe('pickup', (payload) => {
  console.log('Pickup Received', payload);
  trigger('join-room', payload);

  setTimeout(() => {
    trigger('in-transit', payload);
  }, 200);

  setTimeout(() => {
    trigger('in-transit', payload);
  }, 10000);
});