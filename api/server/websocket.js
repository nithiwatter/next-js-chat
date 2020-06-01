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
      const { _id } = jwt.verify(token, process.env.JWT_SECRET_KEY);
      socket.userId = _id;
      next();
    } catch (err) {
      next(new Error('Authentication failed: no token/wrong token'));
      console.log('Authentication failed: no token/wrong token');
    }
  }).on('connection', (socket) => {
    console.log(`New connection from user ${socket.userId}`);
    const connectedClients = Object.keys(io.sockets.sockets);
    console.log(
      `A total of ${connectedClients.length} users currently connected`
    );

    // room for invitations
    socket.on('login', (userId) => {
      socket.userId = userId;
      socket.join(userId);
    });

    // for invitation notifications
    socket.on('invite', (invitation) => {
      socket.join(invitation.userId);
      socket.to(invitation.userId).emit('invited', invitation);
    });

    //[invitationId, teamId]
    socket.on('acceptInvitation', (invitationArray) => {
      socket.to(socket.userId).emit('accepted', invitationArray);
    });

    socket.on('rejectInvitation', (invitationId) => {
      console.log('yay');
      socket.to(socket.userId).emit('rejected', invitationId);
    });

    // initially subscribe to all possible teams when first logged in
    socket.on('subscribe', (teamId) => {
      socket.join('teamId');
    });

    // meesageArray[0] contains the teamId, ...[1] is the message obj with channelId
    socket.on('message', (messageArray) => {
      socket.to(messageArray[0]).emit('new-message', messageArray[1]);
    });

    socket.on('disconnect', () => {
      const nowConnected = Object.keys(io.sockets.sockets);
      console.log(
        `A total of ${nowConnected.length} users currently connected`
      );
    });
  });
};
