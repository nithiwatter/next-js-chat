import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import withAuth from '../lib/withAuth';
import Layout from '../components/layout/index';
import Head from 'next/head';
import Typography from '@material-ui/core/Typography';

class LogIn extends Component {
  state = {};
  render() {
    return (
      <Layout {...this.props}>
        <div style={{ textAlign: 'center', margin: '0 20px' }}>
          <Head>
            <title>Log in to SaaS boilerplate by Async</title>
            <meta
              name="description"
              content="Login and signup page for SaaS boilerplate demo by Async"
            />
          </Head>
          <Typography variant="h3" style={{ margin: '2rem' }}>
            Log in
          </Typography>
          <Typography variant="h5">
            You’ll be logged in for 14 days unless you log out manually.
          </Typography>

          <Button
            href={`${process.env.URL_API}/api/v1/auth/google`}
            style={{ marginTop: '2rem' }}
            variant="outlined"
          >
            Log in with Google
          </Button>
        </div>
      </Layout>
    );
  }
}

export default withAuth(LogIn, { loginRequired: false, logoutRequired: true });
