import React, { Component } from 'react';
import TodosListContent from './TodosListContent';
import TodosTextContent from './TodosTextContent';

class TodosContentWrapper extends Component {
  state = {};

  render() {
    const { createdTodosItems, id, todosStore } = this.props;

    return (
      <div>
        {createdTodosItems[id].checkbox ? (
          <TodosListContent
            todosStore={todosStore}
            id={id}
            todo={createdTodosItems[id]}
          ></TodosListContent>
        ) : (
          <TodosTextContent
            todosStore={todosStore}
            id={id}
            todo={createdTodosItems[id]}
          ></TodosTextContent>
        )}
      </div>
    );
  }
}

export default TodosContentWrapper;
