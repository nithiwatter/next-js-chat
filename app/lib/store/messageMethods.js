import { findIndex } from 'lodash';
import axios from 'axios';
import { runInAction } from 'mobx';

// need to think about handling change photos for messages
export function receiveMessage(message, directMessage) {
  // for normal channel communication
  if (!directMessage) {
    if (message.channelId === this.currentChannel._id) {
      this.messages.push(message);
    }

    const idx = findIndex(
      this.channels,
      (channel) => channel._id === message.channelId
    );
    this.channels[idx].messages = message;
  } // for DM
  else {
    this.messages.push(message);
  }
}

export async function switchToDM(userId, userDisplayName, userEmail) {
  // cannot click twice
  if (this.DM && this.DMUserEmail === userEmail) return;
  console.log(this.DMUserEmail);
  this.DM = true;
  this.DMUser = userDisplayName;
  this.DMUserEmail = userEmail;
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

  // fetching messages data
  const { data } = await axios.post(
    `${process.env.URL_API}/api/v1/team-member/get-direct-messages`,
    {
      userId: this.userStore._id,
      receiverId: this.DMUserId,
      teamId: this.currentTeam._id,
    },
    { withCredentials: true }
  );
  runInAction(() => {
    this.messages = data.messages;
  });
}
