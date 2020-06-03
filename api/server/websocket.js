const socketio = require('socket.io');
const cookieParser = require('cookie');
const jwt = require('jsonwebtoken');

function getAllUserIdsInARoom(sockets, io) {
  const result = [];
  for (let socketId of sockets) {
    result.push(io.sockets.connected[socketId].userId);
  }
  return result;
}

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

    // initially subscribe to all possible teams when first logged in
    socket.on('subscribe', (teamId) => {
      socket.join(teamId);
    });

    // [teamId, userId]
    socket.on('online', (onlineArray) => {
      const onlineTeam = 'online-' + onlineArray[0]; // online-teamId
      socket.join(onlineTeam);

      const sockets = Object.keys(io.sockets.adapter.rooms[onlineTeam].sockets);
      const result = getAllUserIdsInARoom(sockets, io);
      console.log(`Cuurrently online in team ${onlineArray[0]}: `, result);

      // to everyone else already online
      socket.to(onlineTeam).emit('someone-is-online', onlineArray[1]);

      // to the person just online
      socket.emit('all-online', result);
    });

    // [teamId, userId]
    socket.on('offline', (offlineArray) => {
      const onlineTeam = 'online-' + offlineArray[0];
      socket.leave(onlineTeam);
      io.to(onlineTeam).emit('someone-is-offline', offlineArray[1]);
    });

    socket.on('disconnect', () => {
      const nowConnected = Object.keys(io.sockets.sockets);
      io.emit('someone-is-disconnected', socket.userId);
      console.log(
        `A total of ${nowConnected.length} users currently connected`
      );
    });

    // for invitation notifications
    socket.on('invite', (invitation) => {
      socket.join(invitation.userId);
      socket.to(invitation.userId).emit('invited', invitation);
    });

    //[invitationId, teamId, userId]
    socket.on('acceptInvitation', (invitationArray) => {
      socket.to(socket.userId).emit('accepted', invitationArray);
    });

    //[invitationId, userId]
    socket.on('rejectInvitation', (invitationArray) => {
      socket.to(socket.userId).emit('rejected', invitationArray);
    });

    socket.on('leave-inv', (userId) => {
      socket.leave(userId);
    });

    socket.on('delete-team', (teamId) => {
      socket.to(teamId).emit('deletedTeam', teamId);
    });

    socket.on('add-channel', (channel) => {
      socket.to(channel.teamId).emit('addedChannel', channel);
    });

    // [channelId, teamId]
    socket.on('delete-channel', (channelArray) => {
      socket.to(channelArray[1]).emit('deletedChannel', channelArray[0]);
    });

    socket.on('leave-team', (teamId) => {
      socket.leave('online-' + teamId);
      socket.leave(teamId);
    });

    // [teamId, messageObj]
    socket.on('message', (messageArray) => {
      io.to(messageArray[0]).emit('receive-message', messageArray);
    });
  });
};
