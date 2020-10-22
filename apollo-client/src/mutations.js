import { gql } from '@apollo/client';

export const ADD_STAR = gql`
  mutation AddStar($repositoryId: String!) {
    addStar(input: {starrableId: $repositoryId}) {
      starrable {
        id
        viewerHasStarred
      }
    }
  }
`;

export const REMOVE_STAR = gql`
  mutation RemoveStar($repositoryId: String!) {
    removeStar(input: {starrableId: $repositoryId}) {
      starrable {
        id
        viewerHasStarred
      }
    }
  }
`;