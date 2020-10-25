import React from 'react';

import FetchMore from '../../FetchMore';
import RepositoryItem from '../RepositoryItem';
import Issues from '../../Issue';

import '../style.css';

const getUpdateQuery = (entry) => (
  previousResult,
  { fetchMoreResult }
) => {
  if (!fetchMoreResult) {
    return previousResult;
  }

  return {
    ...previousResult,
    [entry]: {
      ...previousResult[entry],
      repositories: {
        ...previousResult[entry].repositories,
        ...fetchMoreResult[entry].repositories,
        edges: [
          ...previousResult[entry].repositories.edges,
          ...fetchMoreResult[entry].repositories.edges
        ]
      }
    }
  }
}

const RepositoryList = ({
  repositories,
  fetchMore,
  loading,
  entry
}) => (
    <div className='repository-list'>
      {repositories.edges.map(({ node }) => (
        <div
          className='repository-list__item'
          key={node.id}
        >
          <RepositoryItem {...node} />

          <Issues
            repositoryName={node.name}
            repositoryOwner={node.owner.login}
          />
        </div>
      ))}

      <FetchMore
        loading={loading}
        hasNextPage={repositories.pageInfo.hasNextPage}
        variables={{
          cursor: repositories.pageInfo.endCursor
        }}
        updateQuery={getUpdateQuery(entry)}
        fetchMore={fetchMore}
      >
        More Repositories
    </FetchMore>
    </div>
  )

export default RepositoryList;