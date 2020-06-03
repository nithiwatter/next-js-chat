import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import FaceIcon from '@material-ui/icons/Face';

const styles = (theme) => ({
  root: {
    maxHeight: '20vh',
    backgroundColor: theme.palette.tbg.main,
  },
});

class Tags extends Component {
  constructor(props) {
    super(props);

    this.handleClickAway = this.handleClickAway.bind(this);
  }
  state = {};

  handleClickAway() {}

  render() {
    const { classes, rootStore } = this.props;

    return (
      <ClickAwayListener onClickAway={this.props.handleClose}>
        <Paper className={classes.root}>
          <List dense>
            {rootStore.currentUsers.map((user) => (
              <ListItem key={user._id} button>
                <ListItemIcon>
                  <FaceIcon></FaceIcon>
                </ListItemIcon>
                <ListItemText primary={user.displayName}></ListItemText>
              </ListItem>
            ))}
          </List>
        </Paper>
      </ClickAwayListener>
    );
  }
}

export default withStyles(styles)(Tags);
