import { decorate, observable, action, runInAction, autorun } from 'mobx';

class Todos {
  constructor(rootStore, todos) {
    this.rootStore = rootStore;
    this.title = '';
    // Array of either {content: text (todos content)} or {content: array of strings (todos list)}
    this.createdTodosItems = {};
    // for index tracking when mapping
    this.id = -1;
    this.editMode = false;
    this.edit = this.edit.bind(this);
    this.addTextContent = this.addTextContent.bind(this);
    this.addListContent = this.addListContent.bind(this);
    this.submit = this.submit.bind(this);
  }

  edit() {
    this.editMode = true;
  }

  notEdit() {
    this.editMode = false;
  }

  submit() {
    console.log('uploading');
  }

  editTitle(newValue) {
    this.title = newValue;
  }

  addTextContent() {
    this.createdTodosItems[this.id + 1] = { checkbox: false, content: '' };
    this.id++;
  }

  addListContent() {
    this.createdTodosItems[this.id + 1] = {
      checkbox: true,
      content: [{ [this.id + 2]: '' }],
    };
    this.id += 2;
  }

  deleteContent(id) {
    delete this.createdTodosItems[id];
  }

  changeTextContent(id, newValue) {
    this.createdTodosItems[id].content = newValue;
  }

  addListItemContent(id, idx) {
    const oldArray = this.createdTodosItems[id].content;
    const newArray = [
      ...oldArray.slice(0, idx + 1),
      { [this.id + 1]: '' },
      ...oldArray.slice(idx + 1),
    ];
    this.createdTodosItems[id].content = newArray;
    this.id++;
  }

  editListItemContent(id, idx, newValue) {
    console.log(1);
    const key = Object.keys(this.createdTodosItems[id].content[idx])[0];
    this.createdTodosItems[id].content[idx][key] = newValue;
  }

  deleteListItemContent(id, idx) {
    const oldArray = this.createdTodosItems[id].content;
    if (oldArray.length === 1) return;
    const newArray = [...oldArray.slice(0, idx), ...oldArray.slice(idx + 1)];
    this.createdTodosItems[id].content = newArray;
  }
}

decorate(Todos, {
  title: observable,
  editMode: observable,
  createdTodosItems: observable,
  changeTextContent: action,
  addTextContent: action,
  addListContent: action,
  deleteContent: action,
  addListItemContent: action,
  editListItemContent: action,
  deleteListItemContent: action,
  edit: action,
  notEdit: action,
  editTitle: action,
});

export { Todos };
