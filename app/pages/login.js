import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import withAuth from '../lib/withAuth';
import Layout from '../components/layout/index';
import Head from 'next/head';

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
          <p style={{ margin: '45px auto', fontSize: '44px', fontWeight: 400 }}>
            Log in
          </p>
          <p>You’ll be logged in for 14 days unless you log out manually.</p>

          <Button href={`${process.env.URL_API}/api/v1/auth/google`}>
            Log in with Google
          </Button>
        </div>
      </Layout>
    );
  }
}

export default withAuth(LogIn, { loginRequired: false, logoutRequired: true });
