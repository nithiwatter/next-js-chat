import { runInAction } from 'mobx';
import { sortBy, findIndex } from 'lodash';
import axios from 'axios';

// fromSocket indicates if the function is called for the local cache or from socket
export function addChannel(newChannel, fromSocket) {
  this.switchToGroup();
  const channels = [...this.channels, newChannel];
  this.channels = sortBy(channels, [
    function (channel) {
      return channel.name;
    },
  ]);

  // if the team currently has no channel
  if (fromSocket && this.channels.length === 1) {
    this.currentChannel = newChannel;
  }

  // do not want to mess up the channel/message view for other users via socket
  if (!fromSocket) {
    this.currentChannel = newChannel;
    this.messages = [];
  }
}

export async function selectChannel(channelId) {
  // cannot select twice
  this.switchToGroup();
  if (channelId === this.currentChannel._id) return;
  const idx = findIndex(this.channels, (channel) => channel._id === channelId);
  const { data } = await axios.post(
    `${process.env.URL_API}/api/v1/team-member/get-messages`,
    {
      channelId,
    },
    { withCredentials: true }
  );
  runInAction(() => {
    this.currentChannel = this.channels[idx];
    this.messages = data.messages;
  });
}

export async function deleteChannel(channelId) {
  // deleting something that is not current channel
  const newChannels = this.channels.filter(
    (channel) => channel._id !== channelId
  );
  if (channelId !== this.currentChannel._id) {
    this.channels = newChannels;
    return;
  }
  let messages = [];
  let channels = [];
  let currentChannel = null;

  if (newChannels.length > 0) {
    const { data } = await axios.post(
      `${process.env.URL_API}/api/v1/team-member/get-messages`,
      {
        channelId: newChannels[0]._id,
      },
      { withCredentials: true }
    );
    messages = data.messages;
    currentChannel = newChannels[0];
    channels = newChannels;
  }

  runInAction(() => {
    this.messages = messages;
    this.currentChannel = currentChannel;
    this.channels = channels;
  });
}
