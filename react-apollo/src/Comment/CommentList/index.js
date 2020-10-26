import React from 'react';
import { gql } from '@apollo/client';
import { Query } from '@apollo/react-components';

import CommentItem from '../CommentItem';
import CommentAdd from '../CommentAdd';
import Loading from '../../Loading';
import ErrorMesssage from '../../Error';
import FetchMore from '../../FetchMore';

const GET_COMMENTS_OF_ISSUE = gql`
  query(
    $repositoryName: String!,
    $repositoryOwner: String!,
    $number: Int!,
    $cursor: String
  ) {
    repository(name: $repositoryName, owner: $repositoryOwner) {
      issue(number: $number) {
        id
        comments(first: 5, after: $cursor) {
          edges {
            node {
              id
              url
              author {
                login
              }
              bodyHTML
              createdAt
            }
          }

          pageInfo {
            endCursor
            hasNextPage
          }
        }
      }
    }
  }
`;

const updateQuery = (previousResult, { fetchMoreResult }) => {
  if (!fetchMoreResult) {
    return previousResult;
  }

  return {
    ...previousResult,
    repository: {
      ...previousResult.repository,
      issue: {
        ...previousResult.repository.issue,
        ...fetchMoreResult.repository.issue,
        comments: {
          ...previousResult.repository.issue.comments,
          ...fetchMoreResult.repository.issue.comments,
          edges: [
            ...previousResult.repository.issue.comments.edges,
            ...fetchMoreResult.repository.issue.comments.edges
          ]
        }
      }
    }
  };
};

const Comments = ({ repositoryName, repositoryOwner, issue }) => (
  <div className='comments'>
    <Query
      query={GET_COMMENTS_OF_ISSUE}
      variables={{
        repositoryName,
        repositoryOwner,
        number: issue.number
      }}
    >
      {({ data, loading, error, fetchMore }) => {
        if (error) {
          return <ErrorMesssage error={error} />
        }

        if (loading && !data) {
          return <Loading />
        }

        const { repository } = data;

        return (
          <React.Fragment>
            {repository.issue.comments.edges.length
              ? (
                <CommentList
                  repositoryName={repositoryName}
                  repositoryOwner={repositoryOwner}
                  number={issue.number}
                  comments={repository.issue.comments}
                  loading={loading}
                  fetchMore={fetchMore}
                />
              ) : (
                <p>No comments...</p>
              )
            }

            <CommentAdd issueId={issue.id} />
          </React.Fragment>
        )
      }}
    </Query>
  </div>
)

const CommentList = ({
  repositoryName,
  repositoryOwner,
  number,
  comments,
  loading,
  fetchMore
}) => (
    <div className='comment-list'>
      {comments.edges.map(({ node }) => (
        <CommentItem key={node.id} comment={node} />
      ))}

      <FetchMore
        loading={loading}
        hasNextPage={comments.pageInfo.hasNextPage}
        variables={{
          repositoryName,
          repositoryOwner,
          number,
          cursor: comments.pageInfo.endCursor
        }}
        updateQuery={updateQuery}
        fetchMore={fetchMore}
      >
        More Comments
      </FetchMore>
    </div>
  )

export default Comments;