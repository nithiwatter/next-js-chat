import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import { observer } from 'mobx-react';

const styles = (theme) => ({
  root: {
    display: 'flex',
    width: '100%',
    padding: theme.spacing(1, 0),
    alignItems: 'center',
  },
  inputTextWrapper: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    width: '95%',
  },
  icon: {
    opacity: 0,
  },
  iconOnFocus: {
    opacity: 100,
  },
});

class TodosTextContent extends Component {
  constructor(props) {
    super(props);
    this.state = { active: false };
    this.handleActive = this.handleActive.bind(this);
    this.handleDisactive = this.handleDisactive.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleInputChange(e) {
    const newValue = e.target.value;
    const id = e.target.id;
    this.props.todosStore.changeTextContent(
      id,
      newValue,
      this.props.creating,
      this.props.mainIdx,
      this.props.idx
    );
  }

  handleActive() {
    this.setState({ active: true });
  }

  handleDisactive() {
    this.setState({ active: false });
  }

  handleDelete(id) {
    this.props.todosStore.deleteContent(
      id,
      this.props.creating,
      this.props.mainIdx,
      this.props.idx
    );
  }

  render() {
    const { classes, todo, id, creating, content } = this.props;
    const { active } = this.state;
    console.log('text');
    if (creating) {
      return (
        <div className={classes.root}>
          <InputBase
            id={id}
            placeholder="Take a note"
            classes={{ root: classes.inputTextWrapper }}
            value={todo.content}
            onChange={this.handleInputChange}
            onFocus={this.handleActive}
            onBlur={this.handleDisactive}
            multiline
          ></InputBase>

          {active ? (
            <div style={{ marginLeft: 'auto', marginRight: '1rem' }}>
              <IconButton
                size="small"
                onMouseDown={(e) => {
                  e.preventDefault();
                }}
                onClick={() => {
                  this.handleDelete(id);
                }}
              >
                <DeleteIcon></DeleteIcon>
              </IconButton>
            </div>
          ) : null}
        </div>
      );
    } else {
      return (
        <div className={classes.root}>
          <InputBase
            id={id}
            placeholder="Take a note"
            classes={{ root: classes.inputTextWrapper }}
            value={content.textContent}
            onChange={this.handleInputChange}
            onFocus={this.handleActive}
            onBlur={this.handleDisactive}
            multiline
          ></InputBase>
          {active ? (
            <div style={{ marginLeft: 'auto', marginRight: '1rem' }}>
              <IconButton
                size="small"
                onMouseDown={(e) => {
                  e.preventDefault();
                }}
                onClick={() => {
                  this.handleDelete(id);
                }}
              >
                <DeleteIcon></DeleteIcon>
              </IconButton>
            </div>
          ) : null}
        </div>
      );
    }
  }
}

export default withStyles(styles)(observer(TodosTextContent));
