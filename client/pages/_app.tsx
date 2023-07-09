import '../styles/globals.css'
import '../styles/nprogress.css'
import { Layout } from '../components'
import { AppProps } from 'next/app'
import { ApolloProvider, useQuery } from '@apollo/client'
import client from '../apollo-client'
import { Toaster } from 'react-hot-toast'
import { StateContextProvider } from '../context/StateContext'
import { Provider } from 'react-redux'
import Router from 'next/router'
import nProgress from 'nprogress'
import { store, persistor } from '../redux/store'
import { PersistGate } from 'redux-persist/integration/react'
import { SkeletonTheme } from 'react-loading-skeleton'
import { GetServerSideProps } from 'next'
import { CookiesProvider } from 'react-cookie'
import { QueryClientProvider, QueryClient } from 'react-query'

Router.events.on('routeChangeStart', nProgress.start)
Router.events.on('routeChangeError', nProgress.done)
Router.events.on('routeChangeComplete', nProgress.done)

const rqclient = new QueryClient()

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <CookiesProvider>
      <QueryClientProvider client={rqclient}>
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
      </QueryClientProvider>
    </CookiesProvider>
  )
}

export default MyApp
