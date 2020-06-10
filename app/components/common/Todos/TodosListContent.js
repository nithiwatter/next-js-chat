import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import TodosListContentItem from './TodosListContentItem';
import TodosAddListContentItem from './TodosAddListContentItem';
import { observer } from 'mobx-react';

const styles = (theme) => ({
  root: {
    width: '100%',
  },
  itemWrapper: {
    width: '100%',
  },
});

class TodosListContent extends Component {
  constructor(props) {
    super(props);
    this.textInput = React.createRef();
    this.handleOnEnterFocus = this.handleOnEnterFocus.bind(this);
  }

  handleOnEnterFocus() {
    this.textInput.current.focus();
  }

  render() {
    const { classes, todosStore, note, creating } = this.props;

    return (
      <div className={classes.root}>
        {note.listContent.map((item, idx) => (
          <TodosListContentItem
            key={item._id}
            item={item}
            note={note}
            idx={idx}
            todosStore={todosStore}
            creating={creating}
            focus={this.handleOnEnterFocus}
          ></TodosListContentItem>
        ))}
        <TodosAddListContentItem
          note={note}
          todosStore={todosStore}
          inputRef={this.textInput}
        ></TodosAddListContentItem>
      </div>
    );
  }
}

export default withStyles(styles)(observer(TodosListContent));
