import '../styles/globals.css'
import '../styles/nprogress.css'
import { Layout } from '../components'
import { AppProps } from 'next/app'
import { ApolloProvider } from '@apollo/client'
import client from '../apollo-client'
import { Toaster } from 'react-hot-toast'
import { StateContextProvider } from '../context/StateContext'
import { Provider } from 'react-redux'
import Router from 'next/router'
import nProgress from 'nprogress'
import { store, persistor } from '../redux/store'
import { PersistGate } from 'redux-persist/integration/react'
import { SkeletonTheme } from 'react-loading-skeleton'

Router.events.on('routeChangeStart', nProgress.start)
Router.events.on('routeChangeError', nProgress.done)
Router.events.on('routeChangeComplete', nProgress.done)

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SkeletonTheme baseColor="#202020" highlightColor="#444">
      <ApolloProvider client={client}>
        <Provider store={store}>
          <PersistGate persistor={persistor}>
            <StateContextProvider>
              <Toaster />
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </StateContextProvider>
          </PersistGate>
        </Provider>
      </ApolloProvider>
    </SkeletonTheme>
  )
}

export default MyApp
