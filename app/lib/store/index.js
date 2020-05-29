import { decorate, observable, configure, action, runInAction } from 'mobx';
import { useStaticRendering } from 'mobx-react';
import { User } from './userStore';
import { findIndex } from 'lodash';
import axios from 'axios';

// disable keeping a clone of the mob store/leaking memory when on the server side
useStaticRendering(typeof window === 'undefined');
configure({ enforceActions: 'observed' });

// a single source of store - will exist only once in server (no clone), then deleted; once on client (reused across multiple pages, so no leaks)
let store;

class Store {
  constructor(initialState) {
    console.log('creating store');
    this.userStore = new User(this, { ...initialState.user });
    this.teams = initialState.teams;
    this.channels = initialState.channels;
    this.currentTeam = null;
    this.currentChannel = null;
    if (this.teams.length > 0) this.currentTeam = this.teams[0];
    if (this.channels.length > 0) this.currentChannel = this.channels[0];
    this.currentUrl = initialState.currentUrl;
    this.darkTheme = true;
    this.changeTheme = this.changeTheme.bind(this);
  }

  changeCurrentUrl(currentUrl) {
    this.currentUrl = currentUrl;
  }

  changeTheme() {
    this.darkTheme = !this.darkTheme;
  }

  addTeam(newTeam) {
    this.teams.push(newTeam);
    this.currentTeam = newTeam;
  }

  addChannel(newChannel) {
    this.channels.push(newChannel);
    this.currentChannel = newChannel;
  }

  async selectTeam(teamId) {
    const idx = findIndex(this.teams, (team) => team._id === teamId);
    const { data } = await await axios.post(
      `${process.env.URL_API}/api/v1/team-member/get-channels`,
      {
        teamId: this.teams[idx]._id,
      }
    );
    const channels = data.channels;
    runInAction(() => {
      this.currentTeam = this.teams[idx];
      this.channels = channels;
      if (channels.length > 0) {
        this.currentChannel = channels[0];
      } else {
        this.currentChannel = null;
      }
    });
  }

  selectChannel(channelId) {
    const idx = findIndex(
      this.channels,
      (channel) => channel._id === channelId
    );
    this.currentChannel = this.channels[idx];
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
  teams: observable,
  currentTeam: observable,
  channels: observable,
  currentChannel: observable,
  changeCurrentUrl: action,
  changeTheme: action,
  addTeam: action,
  addChannel: action,
  selectTeam: action,
  selectChannel: action,
});

export { initializeStore, getStore };
