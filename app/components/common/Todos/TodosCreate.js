import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Collapse from '@material-ui/core/Collapse';
import { withStyles } from '@material-ui/core/styles';
import TodosCreateContent from './TodosCreateContent';
import TodosCreateActions from './TodosCreateActions';
import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

const styles = (theme) => ({
  root: {
    backgroundColor: theme.palette.blue.main,
    width: '80%',
    margin: '0 auto',
  },
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
  },
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
  },
});

class TodosCreate extends Component {
  constructor(props) {
    super(props);
    this.state = { focused: false };
    this.handleOnFocus = this.handleOnFocus.bind(this);
    this.handleOffFocus = this.handleOffFocus.bind(this);
  }

  handleOnFocus() {
    this.setState({ focused: true });
  }

  handleOffFocus() {
    this.setState({ focused: false });
  }

  render() {
    const { classes } = this.props;
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
              }}
            >
              <InputBase
                placeholder="Title"
                classes={{
                  root: classes.inputTitleWrapper,
                  input: classes.inputTitle,
                }}
                onFocus={this.handleOnFocus}
              ></InputBase>
            </div>

            <TodosCreateContent></TodosCreateContent>
            <div className={classes.optionsWrapper}>
              <TodosCreateActions></TodosCreateActions>
              <Button style={{ marginLeft: 'auto' }}>Done</Button>
            </div>
          </Collapse>
        </Paper>
      </ClickAwayListener>
    );
  }
}

export default withStyles(styles)(TodosCreate);
