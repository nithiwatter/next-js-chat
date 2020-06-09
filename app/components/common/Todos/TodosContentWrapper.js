import React, { Component } from 'react';
import TodosListContent from './TodosListContent';
import TodosTextContent from './TodosTextContent';
import { observer } from 'mobx-react';

class TodosContentWrapper extends Component {
  state = {};

  render() {
    const { todosStore, note, creating } = this.props;

    if (note.checkbox) {
      return (
        <TodosListContent
          todosStore={todosStore}
          note={note}
          creating={creating}
        ></TodosListContent>
      );
    }
    return (
      <TodosTextContent
        todosStore={todosStore}
        note={note}
        creating={creating}
      ></TodosTextContent>
    );
  }
}

export default observer(TodosContentWrapper);
