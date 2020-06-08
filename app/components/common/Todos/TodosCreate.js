import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Collapse from '@material-ui/core/Collapse';
import { withStyles } from '@material-ui/core/styles';
import TodosCreateContent from './TodosCreateContent';
import TodosCreateActions from './TodosCreateActions';
import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { observer } from 'mobx-react';

const styles = (theme) => ({
  root: {
    backgroundColor: theme.palette.blue.main,

    width: '80%',
    margin: '0 auto',
    marginBottom: theme.spacing(4),
  },
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
  },
  inputTitleWrapper: {
    color: 'white',
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
  },
});

class TodosCreate extends Component {
  constructor(props) {
    super(props);
    this.state = { focused: false };
    this.handleOnFocus = this.handleOnFocus.bind(this);
    this.handleOffFocus = this.handleOffFocus.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleOnFocus() {
    if (!this.state.focused) {
      this.setState({ focused: true });
    }
  }

  handleOffFocus() {
    if (this.state.focused) {
      this.setState({ focused: false });
    }
  }

  handleInputChange(e) {
    this.props.todosStore.editTitle(e.target.value);
  }

  render() {
    const { classes, todosStore } = this.props;
    const { focused } = this.state;

    return (
      <ClickAwayListener onClickAway={this.handleOffFocus}>
        <Paper classes={{ root: classes.root }}>
          <Collapse
            collapsedHeight="3rem"
            in={focused}
            className={classes.wrapper}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                height: '3rem',
                marginBottom: '0.1rem',
              }}
            >
              <InputBase
                placeholder="Title"
                value={todosStore.title}
                classes={{
                  root: classes.inputTitleWrapper,
                  input: classes.inputTitle,
                }}
                onChange={this.handleInputChange}
                onFocus={this.handleOnFocus}
              ></InputBase>
            </div>
            <div>
              <TodosCreateContent todosStore={todosStore}></TodosCreateContent>
            </div>

            <div className={classes.optionsWrapper}>
              <TodosCreateActions
                todosStore={todosStore}
                creating={true}
              ></TodosCreateActions>
              <Button
                style={{ marginLeft: 'auto', color: 'white' }}
                onClick={todosStore.submit}
              >
                Done
              </Button>
            </div>
          </Collapse>
        </Paper>
      </ClickAwayListener>
    );
  }
}

export default withStyles(styles)(observer(TodosCreate));
