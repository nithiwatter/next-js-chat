import { decorate, observable } from 'mobx';

class User {
  constructor(rootStore, user) {
    console.log('creating user store');
    console.log(user);
    this.rootStore = rootStore;

    this._id = user._id;
    this.slug = user.slug;
    this.email = user.email;
    this.displayName = user.displayName;
    this.avatarUrl = user.avatarUrl;
  }
}

decorate(User, {
  slug: observable,
  email: observable,
  displayName: observable,
  avatarUrl: observable,
});

export { User };
