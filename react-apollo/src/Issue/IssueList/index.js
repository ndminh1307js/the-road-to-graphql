import React, { Component } from 'react';
import { Query } from '@apollo/react-components';
import { gql } from '@apollo/client';
import { withState } from 'recompose';

import IssueItem from '../IssueItem';
import Loading from '../../Loading';
import ErrorMesssage from '../../Error';
import FetchMore from '../../FetchMore';

import './style.css';

const GET_ISSUES_OF_REPOSITORY = gql`
  query(
    $repositoryOwner: String!,
    $repositoryName: String!,
    $issueState: IssueState!,
    $cursor: String
  ) {
    repository(name: $repositoryName, owner: $repositoryOwner) {
      issues(first: 5, after: $cursor, states: [$issueState]) {
        edges {
          node {
            id
            number
            state
            title
            url
            bodyHTML
          }
        }

        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }
`;

const ISSUE_STATES = {
  NONE: 'NONE',
  OPEN: 'OPEN',
  CLOSED: 'CLOSED'
};

const isShow = issueState => issueState !== ISSUE_STATES.NONE;

const TRANSITION_LABELS = {
  [ISSUE_STATES.NONE]: 'Show Open Issues',
  [ISSUE_STATES.OPEN]: 'Show Closed Issues',
  [ISSUE_STATES.CLOSED]: 'Hide Issues'
};

const TRANSITION_STATES = {
  [ISSUE_STATES.NONE]: ISSUE_STATES.OPEN,
  [ISSUE_STATES.OPEN]: ISSUE_STATES.CLOSED,
  [ISSUE_STATES.CLOSED]: ISSUE_STATES.NONE
};

const updateQuery = (previousResult, { fetchMoreResult }) => {
  if (!fetchMoreResult) {
    return previousResult;
  }

  return {
    ...previousResult,
    repository: {
      ...previousResult.repository,
      issues: {
        ...previousResult.repository.issues,
        ...fetchMoreResult.repository.issues,
        edges: [
          ...previousResult.repository.issues.edges,
          ...fetchMoreResult.repository.issues.edges
        ]
      }
    }
  }
}

class Issues extends Component {
  state = {
    issueState: ISSUE_STATES.NONE
  }

  render() {
    const { repositoryName, repositoryOwner } = this.props;
    const { issueState } = this.state;

    return (
      <div className='issues'>
        {isShow(issueState) && (
          <Query
            query={GET_ISSUES_OF_REPOSITORY}
            variables={{
              repositoryName,
              repositoryOwner,
              issueState
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

              const filteredRepository = {
                issues: {
                  edges: repository.issues.edges.filter(
                    issue => issue.node.state === issueState
                  )
                }
              }

              if (!filteredRepository.issues.edges.length) {
                return <p>No Issues...</p>
              }

              return (
                <IssueList
                  issues={filteredRepository.issues}
                  loading={loading}
                  fetchMore={fetchMore}
                />
              )
            }}
          </Query>
        )}
      </div>
    )
  }
}

const IssueList = ({ issues, loading, fetchMore }) => (
  <div className='issue-list'>
    {issues.edges.map(({ node }) => (
      <IssueItem key={node.id} issue={node} />
    ))}

    <FetchMore
      loading={loading}
      hasNextPage={issues.pageInfo.hasNextPage}
      variables={{
        cursor: issues.pageInfo.endCursor
      }}
      updateQuery={updateQuery}
      fetchMore={fetchMore}
    >
      More Issues
    </FetchMore>
  </div>
)

export default withState(
  'issueState',
  'onChangeIssueState',
  ISSUE_STATES.NONE
)(Issues);