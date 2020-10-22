import React, { Component } from 'react';

import client from './client';
import { GET_REPOSITORIES_OF_ORGANIZATION } from './queries';
import { ADD_STAR, REMOVE_STAR } from './mutations';

client
  .query({
    query: GET_REPOSITORIES_OF_ORGANIZATION,
    variables: {
      organization: "the-road-to-learn-react"
    }
  })
  .then(console.log);

// client
//   .query({
//     query: GET_REPOSITORIES_OF_ORGANIZATION,
//     variables: {
//       organization: "the-road-to-learn-react",
//       cursor: 'Y3Vyc29yOnYyOpHOBl03nA=='
//     }
//   })
//   .then(console.log);

client
  .mutate({
    mutation: ADD_STAR,
    variables: {
      repositoryId: "MDEwOlJlcG9zaXRvcnk2MzM1MjkwNw=="
    }
  })
  .then(console.log);

client
  .mutate({
    mutation: REMOVE_STAR,
    variables: {
      repositoryId: "MDEwOlJlcG9zaXRvcnk2MzM1MjkwNw=="
    }
  })
  .then(console.log);

export default class App extends Component {
  render() {
    return (
      <div></div>
    );
  }
}
