import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';

const styles = (theme) => ({
  inputTextWrapper: {
    padding: theme.spacing(0.5, 2),
  },
});

class TodosCreateContent extends Component {
  state = {};
  render() {
    const { classes } = this.props;
    return (
      <div>
        <InputBase
          placeholder="Take a note"
          classes={{ root: classes.inputTextWrapper }}
        ></InputBase>
      </div>
    );
  }
}

export default withStyles(styles)(TodosCreateContent);
