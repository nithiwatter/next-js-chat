import { decorate, observable, action, runInAction, autorun, toJS } from 'mobx';
import uuid from 'react-uuid';
import axios from 'axios';
import { findIndex } from 'lodash';

class Todos {
  constructor(rootStore, todos) {
    this.rootStore = rootStore;
    this.title = '';
    // { checkbox: boolean, textContent: '', listContent: [{ uuid: '', text: '' }]}
    this.createdNote = {
      checkbox: false,
      textContent: '',
      listContent: [],
    };
    this.editMode = false;

    this.edit = this.edit.bind(this);
    this.editWithList = this.editWithList.bind(this);
    this.notEdit = this.notEdit.bind(this);
    this.notes = todos;
    this.submit = this.submit.bind(this);
  }

  edit() {
    this.editMode = true;
  }

  editWithList() {
    if (!this.editMode && !this.createdNote.checkbox) {
      this.editMode = true;
      this.createdNote.checkbox = true;
      let newListContent = this.createdNote.textContent.split('\n');
      newListContent = newListContent.map((el) => {
        return { _id: uuid(), text: el };
      });
      newListContent = newListContent.filter((el) => el.text !== '');
      this.createdNote.listContent = newListContent;
    } else {
      this.editMode = true;
    }
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
    // const { data } = await axios.post(
    //   `${process.env.URL_API}/api/v1/team-member/add-note`,
    //   {
    //     content: result,
    //     title: this.title,
    //   },
    //   { withCredentials: true }
    // );
    // runInAction(() => {
    //   this.createdTodosItems = {};
    //   this.id = -1;
    //   this.title = '';
    // });
  }

  editTitle(newValue) {
    this.title = newValue;
  }

  changeTextContent(newValue, creating) {
    if (creating) {
      this.createdNote.textContent = newValue;
    }
  }

  switchContent(note) {
    if (note.checkbox) {
      let newTextContent = note.listContent.filter((el) => el.text !== '');
      newTextContent = newTextContent.map((el) => el.text);
      newTextContent = newTextContent.join('\n');
      note.textContent = newTextContent;
    } else {
      let newListContent = note.textContent.split('\n');
      newListContent = newListContent.map((el) => {
        return { _id: uuid(), text: el };
      });
      newListContent = newListContent.filter((el) => el.text !== '');
      note.listContent = newListContent;
    }
    note.checkbox = !note.checkbox;
  }

  addListItemContent(note, idx, focus) {
    if (idx === note.listContent.length - 1) {
      focus();
      return;
    }
    const key = uuid();
    const oldArray = note.listContent;
    const newArray = [
      ...oldArray.slice(0, idx + 1),
      { _id: key, text: '' },
      ...oldArray.slice(idx + 1),
    ];
    note.listContent = newArray;
  }

  addListItemContentViaIcon(note, newValue) {
    const key = uuid();
    note.listContent.push({ _id: key, text: newValue });
  }

  editListItemContent(note, idx, newValue) {
    note.listContent[idx].text = newValue;
  }

  deleteListItemContent(note, idx) {
    const oldArray = note.listContent;
    const newArray = [...oldArray.slice(0, idx), ...oldArray.slice(idx + 1)];
    note.listContent = newArray;
  }
}

decorate(Todos, {
  title: observable,
  notes: observable,
  editMode: observable,
  createdNote: observable,
  submit: action,
  changeTextContent: action,
  switchContent: action,
  deleteContent: action,
  addListItemContent: action,
  addListItemContentViaIcon: action,
  editListItemContent: action,
  deleteListItemContent: action,
  edit: action,
  editWithList: action,
  notEdit: action,
  editTitle: action,
});

export { Todos };
