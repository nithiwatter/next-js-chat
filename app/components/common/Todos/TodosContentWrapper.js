import React, { Component } from 'react';
import TodosListContent from './TodosListContent';
import TodosTextContent from './TodosTextContent';

class TodosContentWrapper extends Component {
  state = {};

  render() {
    const {
      createdTodosItems,
      id,
      idx,
      todosStore,
      creating,
      content,
      mainId,
      mainIdx,
    } = this.props;

    if (creating) {
      return (
        <div>
          {createdTodosItems[id].checkbox ? (
            <TodosListContent
              todosStore={todosStore}
              id={id}
              creating={creating}
              todo={createdTodosItems[id]}
            ></TodosListContent>
          ) : (
            <TodosTextContent
              todosStore={todosStore}
              id={id}
              creating={creating}
              todo={createdTodosItems[id]}
            ></TodosTextContent>
          )}
        </div>
      );
    } else {
      return (
        <div>
          {content.checkbox ? (
            <TodosListContent
              todosStore={todosStore}
              creating={creating}
              id={id}
              mainId={mainId}
              mainIdx={mainIdx}
              idx={idx}
              creating={creating}
              content={content}
            ></TodosListContent>
          ) : (
            <TodosTextContent
              creating={creating}
              content={content}
              mainId={mainId}
              id={id}
              todosStore={todosStore}
              idx={idx}
              mainIdx={mainIdx}
            ></TodosTextContent>
          )}
        </div>
      );
    }
  }
}

export default TodosContentWrapper;
