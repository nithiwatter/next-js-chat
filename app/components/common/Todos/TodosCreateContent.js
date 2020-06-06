import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { observer } from 'mobx-react';
import TodosContentWrapper from './TodosContentWrapper';

const styles = (theme) => ({
  inputTextWrapper: {
    padding: theme.spacing(0.5, 2),
  },
});

// function renderTodos(todoKey, todo, todosStore) {
//   if (todo && !todo.checkbox) {
//     return (
//       <TodosTextContent
//         key={todoKey}
//         todo={todo}
//         id={todoKey}
//         todosStore={todosStore}
//       ></TodosTextContent>
//     );
//   } else if (todo && todo.content.length !== 0) {
//     return (
//       <TodosListContent
//         key={todoKey}
//         id={todoKey}
//         todosStore={todosStore}
//         content={todo.content}
//       ></TodosListContent>
//     );
//   } else {
//     console.log(1);
//     return null;
//   }
// }

class TodosCreateContent extends Component {
  state = {};
  render() {
    const { classes, todosStore } = this.props;
    return (
      <div>
        {Object.keys(todosStore.createdTodosItems).map((todoKey) => (
          <TodosContentWrapper
            key={todoKey}
            id={todoKey}
            todosStore={todosStore}
            createdTodosItems={todosStore.createdTodosItems}
          ></TodosContentWrapper>
        ))}
      </div>
    );
  }
}

export default withStyles(styles)(observer(TodosCreateContent));
