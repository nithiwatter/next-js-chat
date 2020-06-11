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
import Typography from '@material-ui/core/Typography';
import { Checkbox } from '@material-ui/core';

const styles = (theme) => ({
  root: {
    border: '1px solid',
    borderColor: theme.palette.border.main,
    width: '100%',
    borderRadius: 8,
    padding: theme.spacing(2),
    paddingBottom: theme.spacing(1),
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
    marginTop: theme.spacing(1),
    // marginBottom: theme.spacing(1),
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontWeight: 700,
  },
  contentContainer: {
    marginTop: theme.spacing(1),
  },
  checkboxContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  checkbox: {
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  text: {
    wordWrap: 'break-word',
  },
  textContainer: {
    minWidth: '0',
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
    console.log('hover out');
    if (this.state.hovered) {
      this.setState({ hovered: false });
    }
  }

  render() {
    const { classes, note, mainIdx, todosStore } = this.props;
    const { editing, focused, hovered } = this.state;
    let content;

    if (note.contentId.checkbox) {
      content = note.contentId.listContent.map((el) => (
        <div key={el._id} className={classes.checkboxContainer}>
          <Checkbox
            size="small"
            onClick={(e) => e.stopPropagation()}
          ></Checkbox>
          <div className={classes.textContainer}>
            <Typography variant="body2" className={classes.text}>
              {el.text}
            </Typography>
          </div>
        </div>
      ));
    } else {
      content = (
        <Typography variant="body2" className={classes.text}>
          {note.contentId.textContent}
        </Typography>
      );
    }
    console.log('render');
    return (
      <React.Fragment>
        <Paper
          classes={{ root: classes.root }}
          onMouseOver={this.handleHoverIn}
          onMouseLeave={this.handleHoverOut}
          onClick={this.handleEditing}
          elevation={2}
        >
          <Typography className={classes.title} variant="body1">
            {note.title}
          </Typography>

          <div className={classes.contentContainer}>{content}</div>

          {/* <div>
            <TodosContentWrapper
              todosStore={todosStore}
              note={note.contentId}
              creating={false}
            ></TodosContentWrapper>
          </div> */}

          <Fade in={hovered}>
            <div className={classes.optionsWrapper}>
              <TodosCreateActions
                todosStore={todosStore}
                creating={false}
                note={note.contentId}
                handleHoverOut={this.handleHoverOut}
              ></TodosCreateActions>
            </div>
          </Fade>
        </Paper>
        <Modal
          open={editing}
          onClose={this.handleNotEditing}
          className={classes.modal}
        >
          <Paper
            style={{ height: '80px', width: '80px', outline: 'none' }}
          ></Paper>
        </Modal>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(observer(TodoNote));
