import '../styles/globals.css'
import '../styles/nprogress.css'
import { Layout } from '../components'
import { AppProps } from 'next/app'
import { ApolloProvider } from '@apollo/client'
import client from '../apollo-client'
import { Toaster } from 'react-hot-toast'
import { StateContextProvider } from '../context/StateContext'
import Router from 'next/router'
import nProgress from 'nprogress'

Router.events.on('routeChangeStart', nProgress.start)
Router.events.on('routeChangeError', nProgress.done)
Router.events.on('routeChangeComplete', nProgress.done)

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <StateContextProvider>
        <Toaster />
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </StateContextProvider>
    </ApolloProvider>
  )
}

export default MyApp
