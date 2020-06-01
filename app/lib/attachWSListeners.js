function attachListeners(socket, userId, teams) {
  // subscribe to your own id (so can receive notifications for invitations)
  socket.emit('login', userId);

  // subscribe to all teams

  socket.on('connect', () => {
    console.log('Successfully establish ws connection...');
  });

  socket.on('invited', (invitation) => {
    console.log(invitation);
    socket.rootStore.newInvitation(invitation);
  });

  // [invitationId, teamId]
  socket.on('accepted', (invitationArray) => {
    console.log('accepted');
    socket.rootStore.acceptedInvitation(invitationArray[0], invitationArray[1]);
  });

  socket.on('rejected', (invitationId) => {
    console.log('rejected');
    socket.rootStore.rejectedInvitation(invitationId);
  });

  socket.on('error', (err) => {
    console.log(err);
  });
}

export default attachListeners;
