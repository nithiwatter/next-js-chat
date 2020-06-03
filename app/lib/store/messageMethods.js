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
