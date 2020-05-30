import React, { Component } from 'react';
import Layout from '../components/layout';
import withAuth from '../lib/withAuth';
import Typography from '@material-ui/core/Typography';
import { withRouter } from 'next/router';
import { observer } from 'mobx-react';

class ViewTeam extends Component {
  state = {};
  render() {
    const { router, rootStore } = this.props;
    if (rootStore.teams.length === 0)
      return (
        <Layout {...this.props}>
          <div
            style={{
              height: '100%',
              padding: '2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography
              variant="h2"
              align="center"
              style={{ marginTop: '1rem' }}
            >
              You have no team yet. Create one.
            </Typography>
          </div>
        </Layout>
      );
    return (
      <Layout {...this.props}>
        <div>Team</div>
      </Layout>
    );
  }
}

export default withAuth(withRouter(observer(ViewTeam)), {
  loginRequired: true,
  logoutRequired: false,
});
