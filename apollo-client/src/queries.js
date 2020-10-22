import { gql } from '@apollo/client';

export const GET_REPOSITORIES_OF_ORGANIZATION = gql`
  query($organization: String!, $cursor: String) {
    organization(login: $organization) {
      name
      url,
      repositories(first: 5, after: $cursor) {
        edges {
          node {
            id
            name
            url
          }
        },
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }
`;