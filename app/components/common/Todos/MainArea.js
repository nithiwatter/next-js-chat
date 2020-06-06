import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import TodoNote from './TodoNote';

const styles = (theme) => ({
  root: {
    border: '1px solid red',
    width: '100%',
    // height: '70vh',
    // columnGap: '1.5rem',
    columns: 4,
    [theme.breakpoints.down('md')]: {
      columns: 3,
    },
    [theme.breakpoints.down('sm')]: {
      columns: 2,
    },
    [theme.breakpoints.down('xs')]: {
      columns: 1,
    },
  },
  todoWrapper: {
    border: '1px solid red',
    // height: '300px',
    width: '80%',
    display: 'inline-block',
  },
});

class MainArea extends Component {
  state = {};

  render() {
    const { classes, notes } = this.props;
    console.log(notes.length);
    return (
      <div className={classes.root}>
        {notes.map((note) => (
          <div key={note._id} className={classes.todoWrapper}>
            {/* <TodoNote></TodoNote> */}
          </div>
        ))}
      </div>
    );
  }
}

export default withStyles(styles)(MainArea);
