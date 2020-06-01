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

  socket.on('invited', (invitation) => {
    console.log(invitation);
    socket.rootStore.newInvitation(invitation);
  });

  // [invitationId, teamId, userId]
  socket.on('accepted', (invitationArray) => {
    console.log('accepted');
    socket.rootStore.acceptedInvitation(invitationArray[0], invitationArray[1]);
    socket.emit('leave-inv', invitationArray[2]);
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

  socket.on('error', (err) => {
    console.log(err);
  });
}

export default attachListeners;
