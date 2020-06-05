import { decorate, observable, action, runInAction } from 'mobx';

class Todos {
  constructor(rootStore, todos) {
    this.rootStore = rootStore;

    // Array of either text (todos content) or array of strings (todos list)
    this.createdTodosItems = [];
  }
}

decorate(Todos, { createdTodosItems: observable });

export { Todos };
