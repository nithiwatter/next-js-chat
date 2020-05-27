import React, { Component } from 'react';
import { getUserApiMethod } from './api/public';
import Router from 'next/router';

export default function withAuth(
  WrappedComponent,
  { loginRequired, logoutRequired }
) {
  return class extends Component {
    static async getInitialProps(ctx) {
      const { req, res } = ctx;
      let pageComponentProps = {};
      let user;

      // getiing the props of the wrapped component
      if (WrappedComponent.getInitialProps) {
        pageComponentProps = await WrappedComponent.getInitialProps(ctx);
      }

      if (typeof window !== 'undefined') {
        // rendering in CSR/client needs to send cookie with CORS
        console.log('render CSR');
        let data = await getUserApiMethod();
        user = data.user;
      } else {
        // rendering in SSR/server; the original req already has the cookie attached -> send this server-to-server to API
        console.log('render SSR');
        if (req.headers.cookie) {
          let data = await getUserApiMethod(req.headers.cookie);
          user = data.user;
        }
      }

      console.log(user);

      // trying to access protected page without having a token/or with faulty token (so user is null)
      if (loginRequired && !logoutRequired && !user) {
        // redirect to login page
        console.log('redirect to login page');
        if (res) {
          res.writeHead(302, {
            Location: `${process.env.URL_APP}/login`,
          });
          res.end();
        } else {
          Router.push('/login');
        }
      }

      // trying to access login page when already logged in
      if (!loginRequired && logoutRequired && user) {
        // redirect to index page
        console.log('redirect to index page');
        if (res) {
          res.writeHead(302, {
            Location: process.env.URL_APP,
          });
          res.end();
        } else {
          Router.push('/');
        }
      }

      // reaching this point means you are either supposed to be in log in or protected pages
      return { ...pageComponentProps, user };
    }

    render() {
      // isMobile and firsGridItem would have already been passed to this component by App HOC
      return <WrappedComponent {...this.props}></WrappedComponent>;
    }
  };
}
