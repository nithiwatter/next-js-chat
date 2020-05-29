import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/styles';
import { themeLight, themeDark } from '../lib/theme';
import { getUserApiMethod } from '../lib/api/public';
import { initializeStore, getStore } from '../lib/store/index';
import isMobile from '../lib/isMobile';
import App from 'next/app';
import React from 'react';
import { StoreContext } from '../lib/context';
import { observer } from 'mobx-react';
import axios from 'axios';

class MyApp extends App {
  componentDidMount() {
    // only called on client side (when mounted as SPA)
    // help remove styles injected by initial SSR CSS injection
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }

  // runs once on the server for populating props for SSR page/then runs every time on the client during SPA navigation
  // later look into this for changes to (newer) getStatic or getServer
  static async getInitialProps({ Component, ctx }) {
    const pageProps = {
      isMobile: isMobile({ req: ctx.req }),
      firstGridItem: true,
    };

    if (ctx.pathname.includes('/login')) {
      pageProps.firstGridItem = false;
    }

    if (Component.getInitialProps) {
      // will call getInitialProps for each page
      Object.assign(pageProps, await Component.getInitialProps(ctx));
    }

    if (getStore()) {
      console.log('already have a store');
      // if there is a store already present, simply return (no need to fecth user again)
      // such as fetch successfully via the server - no need to fetch again
      return { pageProps };
    }

    let userObj = null;
    let teams = null;

    try {
      const { user } = await getUserApiMethod(ctx.req.headers.cookie);
      userObj = user;
      console.log(userObj);
    } catch (err) {
      console.log(err);
    }

    // if there is a user, fetch all initial data regarding teams on client side
    if (userObj) {
      const {
        data,
      } = await axios.post(
        `${process.env.URL_API}/api/v1/team-member/get-initial-data`,
        { userId: userObj._id }
      );
      teams = data.teams;
      console.log(teams);
    }

    return { pageProps, user: userObj, teams: teams, currentUrl: ctx.asPath };
  }

  constructor(props) {
    super(props);
    const { user, teams, currentUrl } = this.props;

    this.rootStore = initializeStore({ user, teams, currentUrl });
  }

  render() {
    // component is the active page being rendered; page props are props gotten from getInitialProps()
    const { Component, pageProps } = this.props;

    return (
      <React.Fragment>
        <ThemeProvider
          theme={this.rootStore.darkTheme ? themeDark : themeLight}
        >
          <CssBaseline />
          <StoreContext.Provider value={this.rootStore}>
            <Component {...pageProps} />
          </StoreContext.Provider>
        </ThemeProvider>
      </React.Fragment>
    );
  }
}

export default observer(MyApp);
