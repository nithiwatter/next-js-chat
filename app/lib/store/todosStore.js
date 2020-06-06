import { decorate, observable, action, runInAction, autorun, toJS } from 'mobx';
import uuid from 'react-uuid';
import axios from 'axios';

class Todos {
  constructor(rootStore, todos) {
    console.log(todos);
    this.rootStore = rootStore;
    this.title = '';
    // Array of either {content: text (todos content)} or {content: array of strings (todos list)}
    this.createdTodosItems = {};
    // for index tracking when mapping
    this.id = -1;
    this.editMode = false;
    this.edit = this.edit.bind(this);
    this.notes = todos;
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

  async submit() {
    const result = [];
    const arrayOfKeys = Object.keys(this.createdTodosItems);

    // formatting to be sent to database
    for (let key of arrayOfKeys) {
      result.push(toJS(this.createdTodosItems[key]));
    }
    console.log(result);
    const { data } = await axios.post(
      `${process.env.URL_API}/api/v1/team-member/add-note`,
      {
        content: result,
        title: this.title,
      },
      { withCredentials: true }
    );
    runInAction(() => {
      this.createdTodosItems = {};
      this.id = -1;
      this.title = '';
    });
  }

  editTitle(newValue) {
    this.title = newValue;
  }

  addTextContent() {
    this.createdTodosItems[this.id + 1] = { checkbox: false, content: '' };
    this.id++;
  }

  addListContent() {
    const key = uuid();
    this.createdTodosItems[this.id + 1] = {
      checkbox: true,
      content: [{ [key]: '' }],
    };
    this.id += 1;
  }

  deleteContent(id) {
    delete this.createdTodosItems[id];
  }

  changeTextContent(id, newValue) {
    this.createdTodosItems[id].content = newValue;
  }

  addListItemContent(id, idx) {
    const key = uuid();
    const oldArray = this.createdTodosItems[id].content;
    const newArray = [
      ...oldArray.slice(0, idx + 1),
      { [key]: '' },
      ...oldArray.slice(idx + 1),
    ];
    this.createdTodosItems[id].content = newArray;
    this.id++;
  }

  editListItemContent(id, idx, newValue) {
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
  submit: action,
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
