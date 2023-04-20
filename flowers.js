'use strict';
const Chance = require('chance');
const chance = new Chance();

const { subscribe, trigger } = require('./client');

let payload = {
  store: '1-800-flowers',
  customer: chance.name(),
  orderId: chance.guid(),
  address: chance.address(),
};

subscribe('join-room, console.log');
subscribe('in-transit', (payload) => {
  console.log('Your order is on its way', payload);
});
subscribe('delivered', console.log);
trigger('join-room', payload);
trigger('pickup', payload);

module.exports = {
  subscribe,
  trigger,
};