function attachListeners(socket, userId, teams) {
  socket.on('connect', () => {
    console.log('Successfully establish ws connection...');
  });

  // subscribe to your own id (so can receive notifications for invitations)
  socket.emit('login', userId);

  // subscribe to all teams
  for (let team of teams) {
    socket.emit('subscribe', team._id);
  }

  // online to the first team
  if (teams.length > 0) {
    socket.emit('online', [teams[0]._id, userId]);
  }

  // need to handle this for better performance
  socket.on('someone-is-online', (result) => {
    console.log(result);
    socket.rootStore.onlineStatus(result);
  });

  socket.on('someone-is-offline', (userId) => {
    console.log('offline');
    socket.rootStore.offlineStatus(userId);
  });

  socket.on('invited', (invitation) => {
    console.log(invitation);
    socket.rootStore.newInvitation(invitation);
  });

  // [invitationId, teamId, userId]
  socket.on('accepted', (invitationArray) => {
    console.log('accepted');
    const count = countInvitations(
      invitationArray[2],
      socket.rootStore.pendingAcceptances
    );
    if (count === 1) {
      socket.emit('leave-inv', invitationArray[2]);
    }
    socket.rootStore.acceptedInvitation(invitationArray[0], invitationArray[1]);
  });

  // [invitationId, userId]
  socket.on('rejected', (invitationArray) => {
    console.log('rejected');
    socket.rootStore.rejectedInvitation(invitationArray[0]);
    socket.emit('leave-inv', invitationArray[1]);
  });

  socket.on('deletedTeam', (teamId) => {
    console.log('from here');
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
      console.log(messageArray[1]);
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
