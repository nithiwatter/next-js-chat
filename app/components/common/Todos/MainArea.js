import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import TodoNote from './TodoNote';
import Masonry from 'react-masonry-css';

const breakpointColumnsObj = {
  default: 4,
  1100: 3,
  700: 2,
  500: 1,
};

const styles = (theme) => ({
  root: {
    width: '100%',
    height: '70vh',
    // columnGap: '1.5rem',
    // columns: 3,
    // [theme.breakpoints.down('md')]: {
    //   columnCount: 3,
    // },
    // [theme.breakpoints.down('sm')]: {
    //   columnCount: 2,
    // },
    // [theme.breakpoints.down('xs')]: {
    //   columnCount: 1,
    // },
  },
  masonWrapper: {
    display: 'flex',
    marginLeft: -theme.spacing(2) /* gutter size offset */,
    width: 'auto',
  },
  columnMasonWrapper: {
    paddingLeft: theme.spacing(2) /* gutter size */,
    backgroundClip: 'padding-box',
  },
  todoWrapper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
});

class MainArea extends Component {
  state = {};

  render() {
    const { classes, notes, todosStore } = this.props;

    return (
      <div className={classes.root}>
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className={classes.masonWrapper}
          columnClassName={classes.columnMasonWrapper}
        >
          {/* {notes.map((note, idx) => (
            <div key={note._id} className={classes.todoWrapper}>
              <TodoNote
                note={note}
                mainId={note._id}
                mainIdx={idx}
                todosStore={todosStore}
              ></TodoNote>
            </div>
          ))} */}
        </Masonry>
      </div>
    );
  }
}

export default withStyles(styles)(MainArea);
