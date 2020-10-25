import React from 'react';

import { gql } from '@apollo/client';
import { Query } from '@apollo/react-components';

import RepositoryList, { REPOSITORY_FRAGMENT } from '../Repository';
import Loading from '../Loading';
import ErrorMessage from '../Error';

const GET_REPOSITORIES_OF_ORGANIZATION = gql`
  query($organizationName: String!, $cursor: String) {
    organization(login: $organizationName) {
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

const Organization = ({ organizationName }) =>
  <Query
    query={GET_REPOSITORIES_OF_ORGANIZATION}
    variables={{
      organizationName
    }}
    skip={organizationName === ''}
    notifyOnNetworkStatusChange={true}
  >
    {({ data, loading, error, fetchMore }) => {
      if (error) {
        return <ErrorMessage error={error} />
      }

      if (loading && !data) {
        return <Loading />
      }

      const { organization } = data;

      return (
        <RepositoryList
          repositories={organization.repositories}
          fetchMore={fetchMore}
          loading={loading}
          entry={'organization'}
        />
      )
    }}
  </Query>

export default Organization;