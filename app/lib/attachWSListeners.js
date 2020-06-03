function attachListeners(socket, userId, teams) {
  socket.on('connect', () => {
    console.log('Successfully establish ws connection...');
  });

  // subscribe to your own id (so can receive notifications for invitations)
  socket.emit('login', userId);

  // subscribe to all teams (to receive notifications for messages)
  for (let team of teams) {
    socket.emit('subscribe', team._id);
  }

  // online to the first team
  if (teams.length > 0) {
    socket.emit('online', [teams[0]._id, userId]);
  }

  socket.on('someone-is-online', (thePersonJustOnline) => {
    socket.rootStore.onlineStatus(thePersonJustOnline, true);
  });

  // result = [ userIds... ]
  socket.on('all-online', (result) => {
    socket.rootStore.onlineStatus(result, false);
  });

  // { teamId: userId }
  socket.on('someone-is-offline', (thePersonJustOffline) => {
    socket.rootStore.offlineStatus(thePersonJustOffline);
  });

  // need to handle this better (currently broadcasted to all users)
  socket.on('someone-is-disconnected', (userId) => {
    socket.rootStore.offlineStatus(userId);
  });

  socket.on('invited', (invitation) => {
    socket.rootStore.newInvitation(invitation);
  });

  // [invitationId, teamId, userId]
  socket.on('accepted', (invitationArray) => {
    // only leave this user room if this is the last pending acceptance
    const count = countInvitations(
      invitationArray[2],
      socket.rootStore.pendingAcceptances
    );
    if (count === 1) {
      socket.emit('leave-inv', invitationArray[2]);
    }
    socket.rootStore.acceptedInvitation(
      invitationArray[0],
      invitationArray[1],
      invitationArray[2]
    );
  });

  // [invitationId, userId]
  socket.on('rejected', (invitationArray) => {
    // only leave this user room if this is the last pending acceptance
    const count = countInvitations(
      invitationArray[1],
      socket.rootStore.pendingAcceptances
    );
    if (count === 1) {
      socket.emit('leave-inv', invitationArray[1]);
    }
    socket.rootStore.rejectedInvitation(invitationArray[0]);
    socket.emit('leave-inv', invitationArray[1]);
  });

  socket.on('deletedTeam', (teamId) => {
    socket.rootStore.deleteTeam(teamId);
  });

  socket.on('addedChannel', (channel) => {
    if (channel.teamId === socket.rootStore.currentTeam._id) {
      socket.rootStore.addChannel(channel, true);
    }
  });

  socket.on('deletedChannel', (channelId) => {
    socket.rootStore.deleteChannel(channelId);
  });

  // [teamId, messageObj]
  socket.on('receive-message', (messageArray) => {
    if (messageArray[0] === socket.rootStore.currentTeam._id) {
      socket.rootStore.receiveMessage(messageArray[1]);
    }
  });

  socket.on('error', (err) => {
    console.log(err);
  });
}

function countInvitations(userId, invitations) {
  let count = 0;
  for (let invitation of invitations) {
    if (invitation.userId === userId) {
      count++;
    }
  }
  return count;
}

export default attachListeners;
