import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import TodosListContentItem from './TodosListContentItem';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import { observer } from 'mobx-react';

const styles = (theme) => ({
  root: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
  },
});

function renderItem(item, todosStore, idx, id) {
  const key = Object.keys(item)[0];
  return (
    <TodosListContentItem
      key={key}
      todosStore={todosStore}
      item={item}
      idx={idx}
      id={id}
    ></TodosListContentItem>
  );
}

function renderItemNote(item, todosStore, mainIdx, idx, subIdx, creating) {
  const key = Object.keys(item)[0];
  return (
    <TodosListContentItem
      key={key}
      todosStore={todosStore}
      item={item}
      idx={idx}
      // id={id}
    ></TodosListContentItem>
  );
}

class TodosListContent extends Component {
  state = {};

  render() {
    const {
      classes,
      todosStore,
      todo,
      id,
      creating,
      mainId,
      mainIdx,
      idx,
      content,
    } = this.props;

    if (creating) {
      return (
        <div className={classes.root}>
          <div style={{ width: '100%' }}>
            {todo.content.map((item, idx) =>
              renderItem(item, todosStore, idx, id)
            )}
          </div>
        </div>
      );
    } else {
      return (
        <div className={classes.root}>
          <div style={{ width: '100%' }}>
            {content.listContent.map((item, subIdx) =>
              renderItemNote(item, todosStore, mainIdx, idx, subIdx, creating)
            )}
          </div>
        </div>
      );
    }
  }
}

export default withStyles(styles)(observer(TodosListContent));
