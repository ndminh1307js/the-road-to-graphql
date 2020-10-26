import React from 'react';

import './style.css';

const FetchMore = ({
  loading,
  hasNextPage,
  variables,
  updateQuery,
  fetchMore,
  children
}) => {
  if (!hasNextPage) {
    return <p className='fetchmore__end'>
      End Of Results
    </p>
  }

  return (
    <button
      className='fetchmore__btn'
      type='button'
      onClick={() => fetchMore({
        variables,
        updateQuery
      })}
    >
      {loading ? 'Loading...' : children}
    </button>
  )
}

export default FetchMore;