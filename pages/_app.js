import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from "@material-ui/styles";
import { theme } from "../theme.js";
import App from "next/app";
import React from "react";

class MyApp extends App {
  componentDidMount() {
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
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    );
  }
}

export default MyApp;
