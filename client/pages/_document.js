import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)

    return initialProps
  }

  render() {
    return (
      <Html>
        <Head>
          <link
            // href="https://fonts.googleapis.com/css2?family=PT+Sans&family=Roboto&family=Rubik&family=Ubuntu&display=swap"
            // href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap"
            // href="https://fonts.googleapis.com/css2?family=Inter&family=PT+Sans&family=Roboto&family=Rubik&family=Ubuntu&display=swap"
            href="//db.onlinewebfonts.com/c/0c5e6f133b0b25edfed47aca4ab57676?family=Segoe+UI+Historic"
            rel="stylesheet"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
