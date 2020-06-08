import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import CloseIcon from '@material-ui/icons/Close';
import { observer } from 'mobx-react';

const styles = (theme) => ({
  root: {
    display: 'flex',
    width: '100%',
    padding: theme.spacing(1, 0),
    alignItems: 'center',
  },
  // rootBorders: {
  //   display: 'flex',
  //   width: '100%',
  //   padding: theme.spacing(1, 0),
  //   alignItems: 'center',
  //   borderColor: theme.palette.grey[400],
  //   borderTop: '1px solid',
  //   borderBottom: '1px solid',
  // },
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
  visible: {
    opacity: 100,
  },
  invisible: {
    opacity: 0,
  },
});

class TodosTextContent extends Component {
  constructor(props) {
    super(props);
    this.state = { active: false, hovered: false };
    this.handleActive = this.handleActive.bind(this);
    this.handleDisactive = this.handleDisactive.bind(this);
    this.handleHoverIn = this.handleHoverIn.bind(this);
    this.handleHoverOut = this.handleHoverOut.bind(this);
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
    if (!this.state.active) {
      this.setState({ active: true });
    }
  }

  handleDisactive() {
    if (this.state.active) {
      this.setState({ active: false });
    }
  }

  handleDelete(id) {
    this.props.todosStore.deleteContent(
      id,
      this.props.creating,
      this.props.mainIdx,
      this.props.idx
    );
  }

  handleHoverIn() {
    if (!this.state.hovered) {
      this.setState({ hovered: true });
    }
  }

  handleHoverOut() {
    if (this.state.hovered) {
      this.setState({ hovered: false });
    }
  }

  render() {
    const { classes, todo, id, creating, content } = this.props;
    const { active, hovered } = this.state;

    if (creating) {
      return (
        <div
          className={classes.root}
          onMouseOver={this.handleHoverIn}
          onMouseLeave={this.handleHoverOut}
        >
          <InputBase
            id={id}
            placeholder="Take a note"
            classes={{ root: classes.inputTextWrapper }}
            value={todo.content}
            onChange={this.handleInputChange}
            // onFocus={this.handleActive}
            // onBlur={this.handleDisactive}
            multiline
          ></InputBase>

          <div style={{ marginLeft: 'auto', marginRight: '1rem' }}>
            <IconButton
              size="small"
              onMouseDown={(e) => {
                e.preventDefault();
              }}
              onClick={() => {
                this.handleDelete(id);
              }}
              className={hovered ? classes.visible : classes.invisible}
            >
              <CloseIcon></CloseIcon>
            </IconButton>
          </div>
        </div>
      );
    } else {
      return (
        <div
          className={classes.root}
          onMouseOver={this.handleHoverIn}
          onMouseLeave={this.handleHoverOut}
        >
          <InputBase
            id={id.toString()}
            placeholder="Take a note"
            classes={{ root: classes.inputTextWrapper }}
            value={content.textContent}
            onChange={this.handleInputChange}
            // onFocus={this.handleActive}
            // onBlur={this.handleDisactive}
            multiline
          ></InputBase>
          <div style={{ marginLeft: 'auto', marginRight: '1rem' }}>
            <IconButton
              size="small"
              onMouseDown={(e) => {
                e.preventDefault();
              }}
              onClick={() => {
                this.handleDelete(id);
              }}
              className={hovered ? classes.visible : classes.invisible}
            >
              <CloseIcon></CloseIcon>
            </IconButton>
          </div>
        </div>
      );
    }
  }
}

export default withStyles(styles)(observer(TodosTextContent));
