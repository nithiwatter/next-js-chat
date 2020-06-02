import { decorate, observable, configure, action, runInAction } from 'mobx';
import { useStaticRendering } from 'mobx-react';
import { User } from './userStore';
import { findIndex, sortBy } from 'lodash';
import axios from 'axios';
import io from 'socket.io-client';
import attachWSListeners from '../attachWSListeners';
import notify from '../notify';

// disable keeping a clone of the mob store/leaking memory when on the server side
useStaticRendering(typeof window === 'undefined');
configure({ enforceActions: 'observed' });

// a single source of store - will exist only once in server (no clone), then deleted; once on client (reused across multiple pages, so no leaks)
let store;

class Store {
  constructor(initialState) {
    console.log('creating store');
    // for next dev refresh
    this.teams = [];
    this.channels = [];
    this.currentUsers = [];
    //
    this.userStore = new User(this, { ...initialState.user });
    this.pendingAcceptances = initialState.pendingAcceptances;
    this.pendingInvitations = initialState.pendingInvitations;
    this.teams = initialState.teams;
    this.channels = initialState.channels;
    this.currentTeam = null;
    this.currentChannel = null;
    this.currentUsers = initialState.currentUsers;
    this.messages = initialState.messages;
    this.currentTab = 0;
    if (this.teams.length > 0) this.currentTeam = this.teams[0];
    if (this.channels.length > 0) this.currentChannel = this.channels[0];
    this.currentUrl = initialState.currentUrl;
    this.darkTheme = true;
    this.changeTheme = this.changeTheme.bind(this);
    const isServer = typeof window === 'undefined';
    this.socket === null;

    if (!isServer && this.userStore._id && !this.socket) {
      this.socket = io(process.env.URL_API);
      this.socket.rootStore = this;
      attachWSListeners(this.socket, this.userStore._id, this.teams);
    }
  }

  // unmount() {
  //   if (this.socket !== null) {
  //     this.socket.disconnect();
  //     this.socket = null;
  //   }
  // }

  changeCurrentUrl(currentUrl) {
    this.currentUrl = currentUrl;
  }

  changeTheme() {
    this.darkTheme = !this.darkTheme;
  }

  addTeam(newTeam) {
    const teams = [...this.teams, newTeam];
    this.teams = sortBy(teams, [
      function (team) {
        return team.name;
      },
    ]);
    this.currentTeam = newTeam;
    this.channels = [];
    this.currentChannel = null;
    const currentUser = this.userStore;
    this.currentUsers = [
      {
        _id: currentUser._id,
        displayName: currentUser.displayName,
        email: currentUser.email,
        avatarUrl: currentUser.avatarUrl,
      },
    ];
    this.messages = [];
    this.socket.emit('subscribe', newTeam._id);
  }

  addChannel(newChannel, fromSocket) {
    const channels = [...this.channels, newChannel];
    this.channels = sortBy(channels, [
      function (channel) {
        return channel.name;
      },
    ]);
    console.log(this.channels.length);
    console.log(this.channels[0]);
    console.log(fromSocket);
    // if the team currently has no channel
    if (fromSocket && this.channels.length === 1) {
      this.currentChannel = newChannel;
    }
    if (!fromSocket) {
      this.currentChannel = newChannel;
    }

    this.messages = [];
  }

  async selectTeam(teamId) {
    // cannot click twice
    if (teamId === this.currentTeam._id) return;
    const idx = findIndex(this.teams, (team) => team._id === teamId);
    const result = await Promise.all([
      axios.post(
        `${process.env.URL_API}/api/v1/team-member/get-channels`,
        {
          teamId: this.teams[idx]._id,
        },
        { withCredentials: true }
      ),
      axios.post(
        `${process.env.URL_API}/api/v1/team-member/get-team-members`,
        {
          teamId: this.teams[idx]._id,
        },
        { withCredentials: true }
      ),
    ]);

    let channels = result[0].data.channels;
    let messages = result[0].data.messages;
    channels = sortBy(channels, [
      function (channel) {
        return channel.name;
      },
    ]);
    const currentUsers = result[1].data.currentUsers;

    runInAction(() => {
      this.currentTeam = this.teams[idx];
      this.channels = channels;
      this.currentUsers = currentUsers;
      this.messages = messages;
      if (channels.length > 0) {
        this.currentChannel = channels[0];
      } else {
        this.currentChannel = null;
      }
    });
  }

  async selectChannel(channelId) {
    if (channelId === this.currentChannel._id) return;
    const idx = findIndex(
      this.channels,
      (channel) => channel._id === channelId
    );
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

  async deleteTeam(teamId) {
    const newTeams = this.teams.filter((team) => team._id !== teamId);
    if (teamId !== this.currentTeam._id) {
      this.teams = newTeams;
      return;
    }
    if (newTeams.length > 0) {
      // get channels information from the first team available
      const { data } = await axios.post(
        `${process.env.URL_API}/api/v1/team-member/get-channels`,
        {
          teamId: newTeams[0]._id,
        },
        { withCredentials: true }
      );
      const channels = data.channels;
      runInAction(() => {
        this.teams = newTeams;
        this.currentTeam = newTeams[0];
        this.channels = channels;
        if (channels.length > 0) {
          this.currentChannel = channels[0];
        } else {
          this.currentChannel = null;
        }
      });
    } else {
      this.teams = [];
      this.currentTeam = null;
      this.channels = [];
      this.currentChannel = null;
    }
    this.socket.emit('leave-team', teamId);
  }

  deleteChannel(channelId) {
    // deleting something that is not current channel
    console.log(this.channels);
    const newChannels = this.channels.filter(
      (channel) => channel._id !== channelId
    );
    if (channelId !== this.currentChannel._id) {
      this.channels = newChannels;
      return;
    }
    if (newChannels.length > 0) {
      this.channels = newChannels;
      this.currentChannel = newChannels[0];
    } else {
      this.channels = [];
      this.currentChannel = null;
    }
    console.log(this.channels);
  }

  invite(invitation) {
    this.pendingAcceptances.push(invitation);
  }

  newInvitation(invitation) {
    this.pendingInvitations.push(invitation);
  }

  clearInvitation(invitationId, acceptance) {
    this.pendingInvitations = this.pendingInvitations.filter(
      (invitation) => invitation._id !== invitationId
    );
    if (acceptance) {
      this.pendingAcceptances = this.pendingAcceptances.filter(
        (invitation) => invitation._id !== invitationId
      );
    }
  }

  async acceptedInvitation(invitationId, teamId) {
    for (let invitation of this.pendingAcceptances) {
      if (invitation._id === invitationId) {
        invitation.accepted = true;
        break;
      }
    }
    notify('Someone accepted your invitation. Please check.');
    if (this.currentTeam._id === teamId) {
      const { data } = await axios.post(
        `${process.env.URL_API}/api/v1/team-member/get-team-members`,
        {
          teamId,
        },
        { withCredentials: true }
      );
      runInAction(() => {
        this.currentUsers = data.currentUsers;
      });
    }
  }

  rejectedInvitation(invitationId) {
    for (let invitation of this.pendingAcceptances) {
      if (invitation._id === invitationId) {
        invitation.rejected = true;
        break;
      }
    }
    notify('Someone just rejected your invitation. :(');
  }

  async getAcceptedTeam(teamId) {
    const { data } = await axios.post(
      `${process.env.URL_API}/api/v1/team-member/get-team`,
      {
        teamId,
      },
      { withCredentials: true }
    );
    runInAction(() => {
      const teams = [...this.teams];
      teams.push(data.team);
      this.teams = sortBy(teams, [
        function (team) {
          return team.name;
        },
      ]);
      this.currentTeam = data.team;
      this.channels = data.channels;
      if (data.channels.length > 0) {
        this.currentChannel = data.channels[0];
      } else {
        this.currentChannel = null;
      }
      this.messages = data.messages;
      this.currentUsers = data.currentUsers;
      this.socket.emit('subscribe', teamId);
    });
  }

  receiveMessage(message) {
    if (message.channelId === this.currentChannel._id) {
      this.messages.push(message);
    }

    const idx = findIndex(
      this.channels,
      (channel) => channel._id === message.channelId
    );
    this.channels[idx].messages = message;
  }

  changeTab(tabValue) {
    if (tabValue === this.currentTab) return;
    this.currentTab = tabValue;
  }
}

// function for the APP HOC to get its store when being constructed
// initialState is for the transition between SSR and CSR -> if already fetched user (on server), then create a store with that user (no need to fetch again)
function initializeStore(initialState) {
  const isServer = typeof window === 'undefined';

  // if store is null (once during server, once during client -> create a new one; else, refer to the same mob store)
  const _store =
    store !== null && store !== undefined
      ? store
      : new Store({ ...initialState, isServer });

  // always a new store for every SSR request
  if (isServer) {
    return _store;
  }

  // if not created yet on client, create and point store to it
  if (!store) {
    store = _store;
  }
  return _store;
}

// function for retrieving the store
function getStore() {
  return store;
}

decorate(Store, {
  currentUrl: observable,
  darkTheme: observable,
  pendingAcceptances: observable,
  pendingInvitations: observable,
  currentUsers: observable,
  teams: observable,
  currentTeam: observable,
  channels: observable,
  messages: observable,
  currentChannel: observable,
  currentTab: observable,
  changeTab: action,
  changeCurrentUrl: action,
  changeTheme: action,
  addTeam: action,
  addChannel: action,
  selectTeam: action,
  selectChannel: action,
  deleteTeam: action,
  deleteChannel: action,
  clearInvitation: action,
  invite: action,
  newInvitation: action,
  acceptedInvitation: action,
  rejectedInvitation: action,
  receiveMessage: action,
});

export { initializeStore, getStore };
