import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from "@material-ui/styles";
import { themeLight, themeDark } from "../lib/theme.js";
import App from "next/app";
import React from "react";

class MyApp extends App {
  componentDidMount() {
    // only called on client side (when mounted as SPA)
    // help remove styles injected by initial SSR CSS injection
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
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
