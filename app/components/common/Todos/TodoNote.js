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
    border: '1px solid red',
    width: '50%',
    // margin: '0 auto',
  },
  //   wrapper: {
  //     display: 'flex',
  //     flexDirection: 'column',
  //   },
  //   inputTitleWrapper: {
  //     padding: theme.spacing(0.5, 2),
  //     width: '100%',
  //   },
  //   inputTitle: {
  //     fontWeight: 500,
  //     fontSize: '1.2rem',
  //   },
  //   optionsWrapper: {
  //     width: '100%',
  //     display: 'flex',
  //   },
});

class TodoNote extends Component {
  constructor(props) {
    super(props);
    this.state = { focused: false };
    // this.handleOnFocus = this.handleOnFocus.bind(this);
    // this.handleOffFocus = this.handleOffFocus.bind(this);
    // this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleOnFocus() {
    this.setState({ focused: true });
  }

  handleOffFocus() {
    this.setState({ focused: false });
  }
  render() {
    const { classes, note } = this.props;
    return (
      //   <ClickAwayListener onClickAway={this.handleOffFocus}>
      <Paper classes={{ root: classes.root }}>
        <Collapse collapsedHeight="3rem" in={false} className={classes.wrapper}>
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
            ></InputBase>
          </div>
        </Collapse>
      </Paper>
      //   </ClickAwayListener>
    );
  }
}

export default withStyles(styles)(TodoNote);
