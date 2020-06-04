import { decorate, observable, configure, action, runInAction } from 'mobx';
import { useStaticRendering } from 'mobx-react';
import { User } from './userStore';
import { addTeam, selectTeam, deleteTeam } from './teamMethods';
import { addChannel, selectChannel, deleteChannel } from './channelMethods';
import {
  invite,
  newInvitation,
  clearPendingInvitation,
  clearPendingAcceptance,
  acceptedInvitation,
  rejectedInvitation,
  getAcceptedTeam,
} from './invitationMethods';
import { receiveMessage, switchToDM } from './messageMethods';
import io from 'socket.io-client';
import attachWSListeners from '../attachWSListeners';

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
    this.isLoading = true;
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
    this.DM = false;
    this.DMUser = '';
    this.DMUserId = 0;
    this.DMUserEmail = '';
    if (this.teams.length > 0) this.currentTeam = this.teams[0];
    if (this.channels.length > 0) this.currentChannel = this.channels[0];
    this.darkTheme = true;

    const isServer = typeof window === 'undefined';
    this.socket === null;

    if (!isServer && this.userStore._id && !this.socket) {
      this.socket = io(process.env.URL_API);
      this.socket.rootStore = this;
      attachWSListeners(this.socket, this.userStore._id, this.teams);
    }

    if (!isServer) {
      setTimeout(() => runInAction(() => (this.isLoading = false)), 1500);
    }
  }

  changeTheme() {
    this.darkTheme = !this.darkTheme;
  }

  switchToGroup() {
    this.DM = false;
    this.DMUser = '';
    this.DMUserId = 0;
    this.DMUserEmail = '';
  }

  // justone = receive only a single userId
  onlineStatus(result, justOne) {
    if (!justOne) {
      let i = 0;
      for (let user of this.currentUsers) {
        if (result.includes(user._id)) {
          user.online = true;
          i++;
        }

        if (i === result.length) return;
      }
    } else {
      for (let user of this.currentUsers) {
        if (result === user._id) {
          user.online = true;
          return;
        }
      }
    }
  }

  offlineStatus(userId) {
    for (let user of this.currentUsers) {
      if (user._id === userId) {
        user.online = false;
        return;
      }
    }
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

Store.prototype.addTeam = action(addTeam);
Store.prototype.selectTeam = action(selectTeam);
Store.prototype.deleteTeam = action(deleteTeam);

Store.prototype.addChannel = action(addChannel);
Store.prototype.selectChannel = action(selectChannel);
Store.prototype.deleteChannel = action(deleteChannel);

Store.prototype.invite = action(invite);
Store.prototype.newInvitation = action(newInvitation);
Store.prototype.clearPendingInvitation = action(clearPendingInvitation);
Store.prototype.clearPendingAcceptance = action(clearPendingAcceptance);
Store.prototype.acceptedInvitation = action(acceptedInvitation);
Store.prototype.rejectedInvitation = action(rejectedInvitation);
Store.prototype.getAcceptedTeam = action(getAcceptedTeam);

Store.prototype.receiveMessage = action(receiveMessage);
Store.prototype.switchToDM = action(switchToDM);

decorate(Store, {
  isLoading: observable,
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
  DM: observable,
  DMUser: observable,
  DMUserId: observable,
  DMUserEmail: observable,
  changeTab: action,
  changeTheme: action,
  receiveMessage: action,
  onlineStatus: action,
  offlineStatus: action,
  switchToGroup: action,
});

export { initializeStore, getStore };
