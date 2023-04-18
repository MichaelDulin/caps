'use strict';

const handlePickup = require('./handler');
const eventEmitter = require('../eventPool');

jest.mock('../eventPool', () => {{
    on: jest.fn(),
    emit: jest.fn()
}});

describe('Testing the driver functionality', () => {
    test('Should console log the payload and call event emitter with proper names', () => {
        console.log = jest.fn();
        handlePickup({orderId: 'test'});
        expect(console.log).toHavebeenCalledTimes(2);
        expect(eventEmitter.emit).toHavebeenCalledTimes(2);
    })
})