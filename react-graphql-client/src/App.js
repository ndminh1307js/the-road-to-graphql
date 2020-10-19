import React, { Component } from 'react';
import axios from 'axios';

const axiosGithubGraphQL = axios.create({
  baseURL: 'https://api.github.com/graphql',
  headers: {
    Authorization: `bearer ${process.env.REACT_APP_GITHUB_ACCESS_TOKEN}`
  }
});

const TITLE = 'React GraphQL Github Client';

const GET_ISSUES_OF_REPOSITORY = `
query (
  $organization: String!,
  $repository: String!,
  $cursor: String
) {
  organization(login: $organization) {
    name
    url
    repository(name: $repository) {
      id
      name
      url
      stargazers {
        totalCount
      }
      viewerHasStarred
      issues(last: 5, after: $cursor, states: [OPEN]) {
        edges {
          node {
            id
            title
            url
            reactions(last: 3) {
              edges {
                node {
                  id
                  content
                }
              }
            }
          }
        }
        totalCount
          pageInfo {
            endCursor
            hasNextPage
        }
      }
    }
  }
}
`;

const getIssuesOfRepository = (path, cursor) => {
  const [organization, repository] = path.split('/');

  return axiosGithubGraphQL
    .post('', {
      query: GET_ISSUES_OF_REPOSITORY,
      variables: {
        organization,
        repository,
        cursor
      }
    })
}

const resolveIssuesQuery = (queryResult, cursor) => state => {
  const { data, errors } = queryResult.data;

  if (!cursor) {
    return {
      organization: data.organization,
      errors
    };
  }

  const { edges: oldIssues } = state.organization.repository.issues;
  const { edges: newIssues } = data.organization.repository.issues;
  const updatedIssues = [...oldIssues, ...newIssues];

  return {
    organization: {
      ...data.organization,
      repository: {
        ...data.organization.repository,
        issues: {
          ...data.organization.repository.issues,
          edges: updatedIssues
        }
      }
    },
    errors
  }
}

const ADD_STAR = `
mutation ($repositoryId: ID!) {
  addStar(input: {starrableId: $repositoryId}) {
    starrable {
      viewerHasStarred
    }
  }
}
`;

const REMOVE_STAR = `
mutation ($repositoryId: ID!) {
  removeStar(input: {starrableId: $repositoryId}) {
    starrable {
      viewerHasStarred
    }
  }
}
`;

const addStarToRepository = (repositoryId) => {
  return axiosGithubGraphQL.post('', {
    query: ADD_STAR,
    variables: {
      repositoryId
    }
  })
}

const removeStarFromRepository = (repositoryId) => {
  return axiosGithubGraphQL.post('', {
    query: REMOVE_STAR,
    variables: {
      repositoryId
    }
  })
}

const resolveAddStarMutation = (mutationResult) => state => {
  const {
    viewerHasStarred
  } = mutationResult.data.data.addStar.starrable;
  const { totalCount } = state.organization.repository.stargazers;

  return {
    ...state,
    organization: {
      ...state.organization,
      repository: {
        ...state.organization.repository,
        viewerHasStarred,
        stargazers: {
          totalCount: totalCount + 1
        }
      }
    }
  }
}

const resolveRemoveStarMutation = (mutationResult) => state => {
  const {
    viewerHasStarred
  } = mutationResult.data.data.removeStar.starrable;
  const { totalCount } = state.organization.repository.stargazers;

  return {
    ...state,
    organization: {
      ...state.organization,
      repository: {
        ...state.organization.repository,
        viewerHasStarred,
        stargazers: {
          totalCount: totalCount - 1
        }
      }
    }
  }
}

export default class App extends Component {
  state = {
    path: 'the-road-to-learn-react/the-road-to-learn-react',
    organization: null,
    errors: null
  }

  componentDidMount() {
    this.onFetchFromGithub(this.state.path);
  }

  onChange = (evt) => {
    this.setState({ path: evt.target.value });
  }

  onSubmit = (evt) => {
    evt.preventDefault();
  }

  onFetchFromGithub = (path, cursor) => {
    getIssuesOfRepository(path, cursor).then(result => {
      this.setState(resolveIssuesQuery(result, cursor));
    });
  }

  onFetchMoreIssues = () => {
    const { endCursor } = this.state.organization.repository.issues.pageInfo;

    this.onFetchFromGithub(this.state.path, endCursor);
  }

  onStarRepository = (repositoryId) => {
    addStarToRepository(repositoryId).then(result => {
      this.setState(resolveAddStarMutation(result))
    });
  }

  onUnstarRepository = (repositoryId) => {
    removeStarFromRepository(repositoryId).then(result => {
      this.setState(resolveRemoveStarMutation(result))
    });
  }

  render() {
    const { path, organization, errors } = this.state;

    return (
      <div>
        <h1>{TITLE}</h1>

        <form onSubmit={this.onSubmit}>
          <label htmlFor="url">
            Show open issues for https
          </label>

          <input
            id='url'
            type='text'
            value={path}
            onChange={this.onChange}
            style={{ width: '30rem' }} />
          <button type='submit'>
            Search
          </button>
        </form>

        <hr />

        {
          organization ? (
            <Organization
              organization={organization}
              errors={errors}
              onFetchMoreIssues={this.onFetchMoreIssues}
              onStarRepository={this.onStarRepository}
              onUnstarRepository={this.onUnstarRepository}
            />
          ) : (
              <p>No information yet...</p>
            )
        }
      </div>
    );
  }
}

const Organization = ({
  organization,
  errors,
  onFetchMoreIssues,
  onStarRepository,
  onUnstarRepository
}) => {
  if (errors) {
    return (
      <p>
        <strong>Something went wrong</strong>
        <span>{errors[0].message}</span>
      </p>
    )
  }
  return (
    <div>
      <p>
        <strong>Issues from Organization:</strong>
        <a href={organization.url}>{organization.name}</a>
      </p>
      <Repository
        repository={organization.repository}
        onFetchMoreIssues={onFetchMoreIssues}
        onStarRepository={onStarRepository}
        onUnstarRepository={onUnstarRepository}
      />
    </div>
  )
}

const Repository = ({
  repository,
  onFetchMoreIssues,
  onStarRepository,
  onUnstarRepository
}) => (
    <div>
      <p>
        <strong>In Repository:</strong>
        <a href={repository.url}>{repository.name}</a>
      </p>

      <button
        type='button'
        onClick={() => {
          if (repository.viewerHasStarred) {
            return onUnstarRepository(
              repository.id,
              repository.viewerHasStarred
            )
          }

          return onStarRepository(
            repository.id,
            repository.viewerHasStarred
          )
        }}
      >
        {repository.stargazers.totalCount}{' | '}
        {repository.viewerHasStarred ? 'Unstar' : 'Star'}
      </button>

      <ul>
        {repository.issues.edges.map(issue => (
          <li key={issue.node.id}>
            <a href={issue.node.url}>{issue.node.title}</a>

            <ul>
              {issue.node.reactions.edges.map(reaction => (
                <li key={reaction.node.id}>{reaction.node.content}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      <hr />

      {repository.issues.pageInfo.hasNextPage && (
        <button onClick={onFetchMoreIssues}>
          More
        </button>
      )}
    </div>
  )