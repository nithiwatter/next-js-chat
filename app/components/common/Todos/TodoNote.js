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

const styles = (theme) => ({
  root: {
    // backgroundColor: theme.palette.tbg.main,
    border: '1px solid',
    borderColor: theme.palette.border.main,
    width: '100%',
    borderRadius: 8,
    // margin: '0 auto',
  },
  //   wrapper: {
  //     display: 'flex',
  //     flexDirection: 'column',
  //   },
  inputTitleWrapper: {
    padding: theme.spacing(0.5, 2),
    width: '100%',
  },
  inputTitle: {
    fontWeight: 500,
    fontSize: '1.2rem',
  },
  optionsWrapper: {
    width: '100%',
    display: 'flex',
    marginBottom: theme.spacing(1),
  },
});

class TodoNote extends Component {
  constructor(props) {
    super(props);
    this.state = { focused: false, hovered: false };
    this.handleOnFocus = this.handleOnFocus.bind(this);
    this.handleOffFocus = this.handleOffFocus.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleHoverIn = this.handleHoverIn.bind(this);
    this.handleHoverOut = this.handleHoverOut.bind(this);
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
    if (this.state.focused && !this.state.hovered) {
      this.setState({ hovered: true });
    }
  }

  handleHoverOut() {
    if (this.state.focused) {
      this.setState({ hovered: false });
    }
  }

  render() {
    const { classes, note, mainId, mainIdx, todosStore } = this.props;
    const { focused, hovered } = this.state;
    console.log('render', mainId);
    return (
      // <ClickAwayListener onClickAway={this.handleOffFocus}>
      <Paper
        classes={{ root: classes.root }}
        onMouseEnter={this.handleHoverIn}
        onMouseLeave={this.handleHoverOut}
        elevation={4}
      >
        <Collapse collapsedHeight="4rem" in={true} className={classes.wrapper}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              minHeight: '4rem',
            }}
          >
            <InputBase
              placeholder="Title"
              value={note.title}
              onChange={this.handleInputChange}
              classes={{
                root: classes.inputTitleWrapper,
                input: classes.inputTitle,
              }}
              onFocus={!focused ? this.handleOnFocus : null}
              multiline
              rowsMax={2}
            ></InputBase>

            <IconButton
              size="small"
              style={{ marginLeft: '0.5rem', marginRight: '0.5rem' }}
              onClick={focused ? this.handleOffFocus : this.handleOnFocus}
            >
              {focused ? (
                <ArrowDropUpIcon></ArrowDropUpIcon>
              ) : (
                <ArrowDropDownIcon></ArrowDropDownIcon>
              )}
            </IconButton>
          </div>
          <div>
            {note.content.map((el, idx) => (
              <TodosContentWrapper
                key={el._id}
                creating={false}
                idx={idx}
                todosStore={todosStore}
                mainId={mainId}
                mainIdx={mainIdx}
                id={el._id}
                content={el}
              ></TodosContentWrapper>
            ))}
          </div>
          <Fade in={hovered}>
            <div className={classes.optionsWrapper}>
              <TodosCreateActions
                todosStore={todosStore}
                creating={false}
                mainId={mainId}
                mainIdx={mainIdx}
              ></TodosCreateActions>
            </div>
          </Fade>
        </Collapse>
      </Paper>
      // </ClickAwayListener>
    );
  }
}

export default withStyles(styles)(observer(TodoNote));
