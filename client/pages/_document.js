import Document, { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'

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
            href="//db.onlinewebfonts.com/c/0c5e6f133b0b25edfed47aca4ab57676?family=Segoe+UI+Historic"
            rel="stylesheet"
          />
        </Head>
        <body>
          <Main />
          <Script
            src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/js/bootstrap.bundle.min.js"
            integrity="sha384-ygbV9kiqUc6oa4msXn9868pTtWMgiQaeYH7/t7LECLbyPA2x65Kgf80OJFdroafW"
            crossorigin="anonymous"
          />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
