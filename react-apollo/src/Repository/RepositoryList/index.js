import React from 'react';

import FetchMore from '../../FetchMore';
import RepositoryItem from '../RepositoryItem';

import '../style.css';

const updateQuery = (previousResult, { fetchMoreResult }) => {
  if (!fetchMoreResult) {
    return previousResult;
  }

  return {
    ...previousResult,
    viewer: {
      ...previousResult.viewer,
      repositories: {
        ...previousResult.viewer.repositories,
        ...fetchMoreResult.viewer.repositories,
        edges: [
          ...previousResult.viewer.repositories.edges,
          ...fetchMoreResult.viewer.repositories.edges
        ]
      }
    }
  }
}

const RepositoryList = ({ repositories, fetchMore, loading }) => (
  <div className='repository-list'>
    {repositories.edges.map(({ node }) => (
      <RepositoryItem key={node.id} {...node} />
    ))}

    <FetchMore
      loading={loading}
      hasNextPage={repositories.pageInfo.hasNextPage}
      variables={{
        cursor: repositories.pageInfo.endCursor
      }}
      updateQuery={updateQuery}
      fetchMore={fetchMore}
    >
      More Repositories
    </FetchMore>
  </div>
)

export default RepositoryList;