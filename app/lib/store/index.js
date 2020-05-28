import { decorate, observable, configure, action } from 'mobx';
import { useStaticRendering } from 'mobx-react';
import { User } from './userStore';

// disable keeping a clone of the mob store/leaking memory when on the server side
useStaticRendering(typeof window === 'undefined');
configure({ enforceActions: 'observed' });

// a single source of store - will exist only once in server (no clone), then deleted; once on client (reused across multiple pages, so no leaks)
let store;

class Store {
  constructor(initialState) {
    console.log(initialState);
    this.userStore = new User(this, { ...initialState.user });
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
  changeCurrentUrl: action,
  changeTheme: action,
});

export { initializeStore, getStore };
