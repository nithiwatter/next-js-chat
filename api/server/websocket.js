const socketio = require('socket.io');
const cookieParser = require('cookie');
const jwt = require('jsonwebtoken');

exports.setUpWS = function (server) {
  const io = socketio(server);

  io.use((socket, next) => {
    try {
      const token = cookieParser.parse(socket.request.headers.cookie)[
        'async-chat-app'
      ];
      jwt.verify(token, process.env.JWT_SECRET_KEY);
      next();
    } catch (err) {
      next(new Error('Authentication failed: no token/wrong token'));
      console.log('Authentication failed: no token/wrong token');
    }
  }).on('connection', (socket) => {
    console.log('New connection...');

    socket.on('disconnect', () => {
      console.log('Bye...');
    });
  });
};
