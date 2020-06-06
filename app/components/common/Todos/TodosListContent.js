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
class TodosListContent extends Component {
  state = {};

  constructor(props) {
    super(props);
    this.state = { active: false };
    this.handleActive = this.handleActive.bind(this);
    this.handleDisactive = this.handleDisactive.bind(this);
  }

  handleActive() {
    this.setState({ active: true });
  }

  handleDisactive() {
    this.setState({ active: false });
  }

  render() {
    const { classes, todosStore, todo, id } = this.props;
    const { active } = this.state;

    return (
      <div
        className={classes.root}
        onMouseOver={this.handleActive}
        onMouseLeave={this.handleDisactive}
      >
        <div style={{ width: '95%', paddingLeft: '2rem' }}>
          {todo.content.map((item, idx) =>
            renderItem(item, todosStore, idx, id)
          )}
        </div>
        {active ? (
          <div style={{ marginLeft: 'auto', marginRight: '1rem' }}>
            <IconButton
              size="small"
              onClick={() => todosStore.deleteContent(id)}
            >
              <DeleteIcon></DeleteIcon>
            </IconButton>
          </div>
        ) : null}
      </div>
    );
  }
}

export default withStyles(styles)(observer(TodosListContent));
