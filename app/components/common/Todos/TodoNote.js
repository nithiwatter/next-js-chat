import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Collapse from '@material-ui/core/Collapse';
import { withStyles } from '@material-ui/core/styles';
import TodosContentWrapper from './TodosContentWrapper';
import TodosCreateContent from './TodosCreateContent';
import TodosCreateActions from './TodosCreateActions';
import Button from '@material-ui/core/Button';
import PinDropIcon from '@material-ui/icons/PinDrop';
import IconButton from '@material-ui/core/IconButton';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { observer } from 'mobx-react';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import Fade from '@material-ui/core/Fade';
import Grow from '@material-ui/core/Grow';
import Modal from '@material-ui/core/Modal';

const styles = (theme) => ({
  root: {
    border: '1px solid',
    borderColor: theme.palette.border.main,
    width: '100%',
    borderRadius: 8,
    paddingTop: theme.spacing(1),
  },
  rootPop: {
    position: 'fixed',
    top: '25%',
    left: '30%',
    borderRadius: 8,
    width: '50vw',
    zIndex: 100,
  },
  inputTitleWrapper: {
    padding: theme.spacing(0.5, 2),
    width: '100%',
  },
  inputTitle: {
    fontWeight: 500,
    fontSize: '1rem',
  },
  optionsWrapper: {
    width: '100%',
    display: 'flex',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
});

class TodoNote extends Component {
  constructor(props) {
    super(props);
    this.state = { editing: false, focused: false, hovered: false };
    this.handleOnFocus = this.handleOnFocus.bind(this);
    this.handleOffFocus = this.handleOffFocus.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleHoverIn = this.handleHoverIn.bind(this);
    this.handleHoverOut = this.handleHoverOut.bind(this);
    this.handleEditing = this.handleEditing.bind(this);
    this.handleNotEditing = this.handleNotEditing.bind(this);
  }

  handleEditing() {
    if (!this.state.editing) {
      this.setState({ editing: true });
    }
  }

  handleNotEditing() {
    if (this.state.editing) {
      this.setState({ editing: false });
    }
  }

  handleOnFocus() {
    this.setState({ focused: true, hovered: true });
  }

  handleOffFocus() {
    this.setState({ focused: false, hovered: false });
  }

  handleInputChange(e) {
    this.props.todosStore.editTitleTodo(e.target.value, this.props.note._id);
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
    const { classes, note, mainIdx, todosStore } = this.props;
    const { editing, focused, hovered } = this.state;
    console.log('render', editing);
    return (
      <React.Fragment>
        <Paper
          classes={{ root: classes.root }}
          // onMouseEnter={this.handleHoverIn}
          // onMouseLeave={this.handleHoverOut}
          onClick={this.handleEditing}
          elevation={2}
        >
          <InputBase
            placeholder="Title"
            value={note.title}
            classes={{
              root: classes.inputTitleWrapper,
              input: classes.inputTitle,
            }}
          ></InputBase>

          <div>
            <TodosContentWrapper
              todosStore={todosStore}
              note={note.contentId}
              creating={false}
            ></TodosContentWrapper>
          </div>

          {/* <Fade in={hovered}>
          <div className={classes.optionsWrapper}>
            <TodosCreateActions
              todosStore={todosStore}
              creating={false}
              mainId={mainId}
              mainIdx={mainIdx}
            ></TodosCreateActions>
          </div>
        </Fade> */}
        </Paper>
        <Modal open={editing} onClose={this.handleNotEditing}>
          <div>Hello</div>
        </Modal>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(observer(TodoNote));
