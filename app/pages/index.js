import Layout from '../components/layout/index';
import React, { Component } from 'react';
import withAuth from '../lib/withAuth';
import TodosCreate from '../components/common/Todos/TodosCreate';

import MainArea from '../components/common/Todos/MainArea';
import { withStyles } from '@material-ui/core/styles';

const styles = (theme) => ({
  root: {
    padding: theme.spacing(2),
  },
  backdrop: {
    width: '100vw',
    height: '100vh',
    position: 'fixed',
    backgroundColor: '#e5e5e5',
    top: 0,
    left: 0,
    zIndex: 100,
    opacity: 0.75,
  },
  hiddenBackdrop: {
    display: 'hidden',
    width: '100vw',
    height: '100vh',
    position: 'fixed',
    backgroundColor: '#e5e5e5',
    top: 0,
    left: 0,
    zIndex: -100,
    opacity: 0,
  },
});

class Index extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { firstGridItem, rootStore, user, classes } = this.props;
    return (
      <React.Fragment>
        <div
          className={
            rootStore.todosStore.editNote
              ? classes.backdrop
              : classes.hiddenBackdrop
          }
        ></div>
        <Layout firstGridItem={firstGridItem} rootStore={rootStore} user={user}>
          <div className={classes.root}>
            <TodosCreate todosStore={rootStore.todosStore}></TodosCreate>
            <MainArea todosStore={rootStore.todosStore}></MainArea>
          </div>
        </Layout>
      </React.Fragment>
    );
  }
}

export default withAuth(withStyles(styles)(Index), {
  loginRequired: true,
  logoutRequired: false,
});
