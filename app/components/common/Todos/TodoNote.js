import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Collapse from '@material-ui/core/Collapse';
import { withStyles } from '@material-ui/core/styles';
import TodosCreateContent from './TodosCreateContent';
import TodosCreateActions from './TodosCreateActions';
import Button from '@material-ui/core/Button';
import PinDropIcon from '@material-ui/icons/PinDrop';
import IconButton from '@material-ui/core/IconButton';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { observer } from 'mobx-react';

const styles = (theme) => ({
  root: {
    // backgroundColor: '#f5f5f5',
    border: '1px solid',
    borderColor: theme.palette.border.main,
    width: '100%',
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
  //   optionsWrapper: {
  //     width: '100%',
  //     display: 'flex',
  //   },
});

class TodoNote extends Component {
  constructor(props) {
    super(props);
    this.state = { focused: false };
    this.handleOnFocus = this.handleOnFocus.bind(this);
    this.handleOffFocus = this.handleOffFocus.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleOnFocus() {
    this.setState({ focused: true });
  }

  handleOffFocus() {
    this.setState({ focused: false });
  }

  handleInputChange(e) {
    this.props.todosStore.editTitleTodo(e.target.value, this.props.note._id);
  }

  render() {
    const { classes, note } = this.props;
    const { focused } = this.state;
    return (
      //   <ClickAwayListener onClickAway={this.handleOffFocus}>
      <Paper classes={{ root: classes.root }}>
        <Collapse
          collapsedHeight="4rem"
          in={focused}
          className={classes.wrapper}
        >
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
              onFocus={this.handleOnFocus}
              onBlur={this.handleOffFocus}
              multiline
              rowsMax={2}
            ></InputBase>
            <IconButton
              size="small"
              style={{ marginLeft: '0.5rem', marginRight: '0.5rem' }}
            >
              <PinDropIcon></PinDropIcon>
            </IconButton>
          </div>
          <div>Hello</div>
        </Collapse>
      </Paper>
      //   </ClickAwayListener>
    );
  }
}

export default withStyles(styles)(observer(TodoNote));
