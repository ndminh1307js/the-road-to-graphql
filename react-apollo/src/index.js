import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import { ApolloProvider } from '@apollo/react-components';
import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from '@apollo/client';
import { onError } from '@apollo/client/link/error';

const GITHUB_BASE_URL = 'https://api.github.com/graphql';
const token = process.env.REACT_APP_GITHUB_PERSONAL_ACCESS_TOKEN;

const httpLink = new HttpLink({
  uri: GITHUB_BASE_URL,
  headers: {
    Authorization: `bearer ${token}`
  }
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.map(({ message, locations, path }) =>
      console.log(`
      [GraphQL error]:
        Message: ${message}
        Location: ${locations}
        Path: ${path}
      `)
    );
  if (networkError) {
    console.log(`[Network error]: ${networkError}`)
  };
});

const link = ApolloLink.from([errorLink, httpLink]);

const cache = new InMemoryCache();

const client = new ApolloClient({
  link,
  cache
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
