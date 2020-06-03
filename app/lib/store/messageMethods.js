import { findIndex } from 'lodash';

export function receiveMessage(message) {
  if (message.channelId === this.currentChannel._id) {
    this.messages.push(message);
  }

  const idx = findIndex(
    this.channels,
    (channel) => channel._id === message.channelId
  );
  this.channels[idx].messages = message;
}

export function switchToDM(userId, userDisplayName, userEmail) {
  this.DM = true;
  this.DMUser = userDisplayName;
  if (userId) {
    this.DMUserId = userId;
  } else {
    const idx = findIndex(
      this.currentUsers,
      (user) => user.email === userEmail
    );
    this.DMUser = this.currentUsers[idx].displayName;
    this.DMUserId = this.currentUsers[idx]._id;
  }
}
