import Document, { Html, Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
  render() {
    // Only add head tags that will be the same across all pages
    // For tags that change, use Head from'next/head' in _app or specific page
    return (
      <Html lang="en">
        <Head>
          <script async src="https://use.fortawesome.com/978e158e.js" />
          <link rel="shortcut icon" href="/favicon.ico" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
