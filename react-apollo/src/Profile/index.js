import React from 'react';

import { gql } from '@apollo/client';
import { Query } from '@apollo/react-components';
// import { graphql } from '@apollo/react-hoc';

import RepositoryList, { REPOSITORY_FRAGMENT } from '../Repository';
import Loading from '../Loading';
import ErrorMessage from '../Error';

const GET_REPOSITORIES_OF_CURRENT_USER = gql`
  query($cursor: String) {
    viewer {
      repositories(
        first: 5
        orderBy: {direction: DESC, field: STARGAZERS}
        after: $cursor
      ) {
        edges {
          node {
            ...repository
          }
        }

        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }

  ${REPOSITORY_FRAGMENT}
`;

const Profile = () =>
  <Query
    query={GET_REPOSITORIES_OF_CURRENT_USER}
    notifyOnNetworkStatusChange={true}
  >
    {({ data, loading, error, fetchMore }) => {
      if (error) {
        return <ErrorMessage error={error} />
      }

      if (loading && !data) {
        return <Loading />
      }

      const { viewer } = data;

      return (
        <RepositoryList
          repositories={viewer.repositories}
          fetchMore={fetchMore}
          loading={loading}
        />
      )
    }}
  </Query>

export default Profile;