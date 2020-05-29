import React, { Component } from 'react';
import { observer } from 'mobx-react';
import Router from 'next/router';
import { StoreContext } from './context';

export default function withAuth(
  WrappedComponent,
  { loginRequired, logoutRequired }
) {
  class WithAuth extends Component {
    static contextType = StoreContext;

    static async getInitialProps(ctx) {
      let pageComponentProps = {};
      // let user;

      // // getiing the props of the wrapped component
      // if (WrappedComponent.getInitialProps) {
      //   pageComponentProps = await WrappedComponent.getInitialProps(ctx);
      // }

      // if (typeof window !== 'undefined') {
      //   // rendering in CSR/client needs to send cookie with CORS
      //   let data = await getUserApiMethod();
      //   user = data.user;
      // } else {
      //   // rendering in SSR/server; the original req already has the cookie attached -> send this server-to-server to API
      //   if (req.headers.cookie) {
      //     let data = await getUserApiMethod(req.headers.cookie);
      //     user = data.user;
      //   }
      // }

      // // trying to access protected page without having a token/or with faulty token (so user is null)
      // if (loginRequired && !logoutRequired && !user) {
      //   // redirect to login page
      //   console.log('redirect to login page');
      //   if (res) {
      //     res.writeHead(302, {
      //       Location: `${process.env.URL_APP}/login`,
      //     });
      //     res.end();
      //   } else {
      //     Router.push('/login');
      //   }
      // }

      // // trying to access login page when already logged in
      // if (!loginRequired && logoutRequired && user) {
      //   // redirect to index page
      //   console.log('redirect to index page');
      //   if (res) {
      //     res.writeHead(302, {
      //       Location: process.env.URL_APP,
      //     });
      //     res.end();
      //   } else {
      //     Router.push('/');
      //   }
      // }

      // reaching this point means you are either supposed to be in log in or protected pages
      return { ...pageComponentProps };
    }

    componentDidMount() {
      const user = this.context.userStore;

      if (loginRequired && !logoutRequired && !user._id) {
        Router.push('/login');
        return;
      }

      if (!loginRequired && logoutRequired && user._id) {
        Router.push('/');
        return;
      }
    }

    render() {
      // isMobile and firsGridItem would have already been passed to this component by App HOC
      const user = this.context.userStore;
      const rootStore = this.context;

      // prevent serving protected users when not logged in from SSR
      if (loginRequired && !logoutRequired && !user._id) {
        return null;
      }

      if (!loginRequired && logoutRequired && user._id) {
        return null;
      }

      return (
        <WrappedComponent
          {...this.props}
          user={user}
          rootStore={rootStore}
        ></WrappedComponent>
      );
    }
  }

  return WithAuth;
}
