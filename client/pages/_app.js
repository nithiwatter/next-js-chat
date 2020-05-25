import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/styles';
import { themeLight, themeDark } from '../lib/theme';
import isMobile from '../lib/isMobile';
import App from 'next/app';
import React from 'react';

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

    if (Component.getInitialProps) {
      Object.assign(pageProps, await Component.getInitialProps(ctx));
    }

    return { pageProps };
  }

  render() {
    // component is the active page being rendered; page props are props gotten from getInitialProps()
    const { Component, pageProps } = this.props;

    return (
      <React.Fragment>
        <ThemeProvider theme={true ? themeDark : themeLight}>
          <CssBaseline />
          <Component {...pageProps} />
        </ThemeProvider>
      </React.Fragment>
    );
  }
}

export default MyApp;
