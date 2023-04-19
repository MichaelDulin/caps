'use strict';

const { Server } = require('socket.io');
const PORT = process.env.PORT || 3001;

const io = new Server(PORT);