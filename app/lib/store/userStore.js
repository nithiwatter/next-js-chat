import { decorate, observable, action, runInAction } from 'mobx';
import { updateProfileApiMethod } from '../api/public';

class User {
  constructor(rootStore, user) {
    this.rootStore = rootStore;

    this._id = user._id;
    this.slug = user.slug;
    this.email = user.email;
    this.displayName = user.displayName;
    this.avatarUrl = user.avatarUrl;
  }

  logOut() {
    this._id = null;
    this.slug = null;
    this.email = null;
    this.displayName = null;
    this.avatarUrl = null;
    this.rootStore.socket.disconnect();
    this.rootStore.socket = null;
  }

  async updateProfile(updatedData) {
    try {
      const { updatedUser } = await updateProfileApiMethod(updatedData);
      runInAction(() => {
        this.displayName = updatedUser.displayName;
        this.avatarUrl = updatedUser.avatarUrl;
        this.slug = updatedUser.slug;
        console.log(this);
      });
    } catch (err) {
      console.log(err);
    }
  }
}

decorate(User, {
  slug: observable,
  email: observable,
  displayName: observable,
  avatarUrl: observable,
  logOut: action,
  updateProfile: action,
});

export { User };
