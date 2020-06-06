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
});

class Index extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { firstGridItem, rootStore, user, classes } = this.props;
    return (
      <Layout firstGridItem={firstGridItem} rootStore={rootStore} user={user}>
        <div className={classes.root}>
          <TodosCreate todosStore={rootStore.todosStore}></TodosCreate>
          <MainArea
            notes={rootStore.todosStore.notes}
            todosStore={rootStore.todosStore}
          ></MainArea>
        </div>
      </Layout>
    );
  }
}

export default withAuth(withStyles(styles)(Index), {
  loginRequired: true,
  logoutRequired: false,
});
