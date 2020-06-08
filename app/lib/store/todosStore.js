import { decorate, observable, action, runInAction, autorun, toJS } from 'mobx';
import uuid from 'react-uuid';
import axios from 'axios';
import { findIndex } from 'lodash';

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

  editTitleTodo(newValue, id) {
    console.log(1);
    let idx = this.notes.findIndex((note) => note._id === id);
    this.notes[idx].title = newValue;
  }

  addTextContent(creating, mainId, mainIdx) {
    if (creating) {
      this.createdTodosItems[this.id + 1] = { checkbox: false, content: '' };
      this.id++;
    } else {
      this.notes[mainIdx].content.push({
        _id: this.id,
        checkbox: false,
        textContent: '',
      });
      this.id++;
    }
  }

  addListContent() {
    const key = uuid();
    if (
      (this.createdTodosItems[this.id] &&
        !this.createdTodosItems[this.id].checkbox) ||
      Object.keys(this.createdTodosItems).length === 0
    ) {
      this.createdTodosItems[this.id + 1] = {
        checkbox: true,
        content: [{ [key]: '' }],
      };
      this.id += 1;
    } else {
      this.createdTodosItems[this.id].content.push({ [key]: '' });
    }
  }

  deleteContent(id, creating, mainIdx, idx) {
    if (creating) {
      delete this.createdTodosItems[id];
    } else {
      this.notes[mainIdx].content.splice(idx, 1);
    }
  }

  changeTextContent(id, newValue, creating, mainIdx, idx) {
    if (creating) {
      this.createdTodosItems[id].content = newValue;
    } else {
      this.notes[mainIdx].content[idx].textContent = newValue;
    }
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
    if (oldArray.length === 1) {
      delete this.createdTodosItems[id];
      return;
    }
    const newArray = [...oldArray.slice(0, idx), ...oldArray.slice(idx + 1)];
    this.createdTodosItems[id].content = newArray;
  }
}

decorate(Todos, {
  title: observable,
  notes: observable,
  editMode: observable,
  createdTodosItems: observable,
  submit: action,
  editTitleTodo: action,
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
