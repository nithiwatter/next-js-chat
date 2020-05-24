import Document, { Head, Html, Main, NextScript } from "next/document";
import React from "react";
import { ServerStyleSheets } from "@material-ui/styles";

class MyDocument extends Document {
  static getInitialProps = async (ctx) => {
    // function for server-side CSS injection
    const sheets = new ServerStyleSheets();
    const originalRenderPage = ctx.renderPage;

    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: (App) => (props) => sheets.collect(<App {...props} />),
      });

    // plain HTML object with no style set
    const initialProps = await Document.getInitialProps(ctx);

    // passed to be rendered into HTML (server-side)
    return {
      ...initialProps,
      styles: [
        ...React.Children.toArray(initialProps.styles),
        // style related to material-ui now injected
        sheets.getStyleElement(),
      ],
    };
  };

  render() {
    return (
      <Html lang="eng">
        <Head>
          <meta charSet="utf-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <meta name="google" content="notranslate" />
          <meta name="theme-color" content="#303030" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
