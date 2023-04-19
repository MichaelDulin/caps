'use strict';

module.exxports = {
  sendPickup: function (socket, payload) {
    socket.emit('pickup', payload);
  },
  generatePayload: () => {
    return {
      store: '1-206-flowers',
      orderId: 'xxxxxx-xxxxxxxx-xxxxxxx',
      customer: 'Michael Dulin',
      address: '227 161st St SE',
    };
  },
  handleDelivered: (payload) => {
    console.log('Thank you for your order, ', payload('customer'));
    process.exit();
  },
};