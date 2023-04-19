'use strict';

const { emitter } = require('../eventPool');
const { sendPickup, generatePayload, handleDelivery } = require('./handler');


describe('Testing our vendor functions', () => {
  test('Can the vendor generate a payload object', () => {
    let payload = generatePayload();
    expect(payload.store).toBeTruthy();
    expect(payload.customer).toBeTruthy();
    expect(payload.address).toBeTruthy();
    expect(payload.orderId).toBeTruthy();
  });

  test('Can handle a delivery', () => {
    let payload = generatePayload();
    expect(console.log).toHaveBeenCalled();
  });
});