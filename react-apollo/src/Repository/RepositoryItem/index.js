import React from 'react';
import { gql } from '@apollo/client';
import { Mutation } from '@apollo/react-components';

import REPOSITORY_FRAGMENT from '../fragments';
import Link from '../../Link';
import Button from '../../Button';
import '../style.css';

const STAR_REPOSITORY = gql`
  mutation($id: ID!) {
    addStar(input: { starrableId: $id }) {
      starrable {
        id
        viewerHasStarred
      }
    }
  }
`;

const UNSTAR_REPOSITORY = gql`
  mutation($id: ID!) {
    removeStar(input: { starrableId: $id }) {
      starrable {
        id
        viewerHasStarred
      }
    }
  }
`;

const WATCH_REPOSITORY = gql`
  mutation($id: ID!, $viewerSubscription: SubscriptionState!) {
    updateSubscription(
      input: { state: $viewerSubscription, subscribableId: $id }
    ) {
      subscribable {
        id
        viewerSubscription
      }
    }
  }
`;

const VIEWER_SUBSCRIPTIONS = {
  SUBSCRIBED: 'SUBSCRIBED',
  UNSUBSCRIBED: 'UNSUBSCRIBED'
};

const isWatch = (viewerSubscription) =>
  viewerSubscription === VIEWER_SUBSCRIPTIONS.SUBSCRIBED;

const updateStar = (
  client,
  mutationResult
) => {
  let id;

  if (mutationResult.data.addStar) {
    id = mutationResult.data.addStar.starrable.id;
  } else {
    id = mutationResult.data.removeStar.starrable.id;
  }

  const repository = client.readFragment({
    id: `Repository:${id}`,
    fragment: REPOSITORY_FRAGMENT
  });

  let totalCount;
  const prevTotalCount = repository.stargazers.totalCount;

  if (mutationResult.data.addStar) {
    totalCount = prevTotalCount + 1;
  } else {
    totalCount = prevTotalCount - 1;
  }

  client.writeFragment({
    id: `Repository:${id}`,
    fragment: REPOSITORY_FRAGMENT,
    data: {
      ...repository,
      stargazers: {
        ...repository.stargazers,
        totalCount
      }
    }
  });
}

const updateWatch = (
  client,
  {
    data: {
      updateSubscription: {
        subscribable: {
          id,
          viewerSubscription
        }
      }
    }
  }
) => {
  const repository = client.readFragment({
    id: `Repository:${id}`,
    fragment: REPOSITORY_FRAGMENT
  });

  let { totalCount } = repository.watchers;

  totalCount = isWatch(viewerSubscription)
    ? totalCount + 1
    : totalCount - 1;

  client.writeFragment({
    id: `Repository:${id}`,
    fragment: REPOSITORY_FRAGMENT,
    data: {
      ...repository,
      watchers: {
        ...repository.watchers,
        totalCount
      }
    }
  });
}

const RepositoryItem = ({
  id,
  url,
  name,
  descriptionHTML,
  primaryLanguage,
  owner,
  stargazers,
  watchers,
  viewerSubscription,
  viewerHasStarred
}) => (
    <div className='repository-item'>
      <div className='repository-item__title'>
        <h2>
          <Link href={url}>{name}</Link>
        </h2>

        <div className='repository-item__action'>
          {
            viewerHasStarred ? (
              <Mutation
                mutation={UNSTAR_REPOSITORY}
                variables={{ id }}
                update={updateStar}
              >
                {(removeStar, { data, loading, error }) => (
                  <Button
                    className='repository-item__btn'
                    color='black'
                    onClick={removeStar}
                  >
                    <span>Unstar&nbsp;</span>
                    &#9733; {stargazers.totalCount}
                  </Button>
                )}
              </Mutation>
            ) : (
                <Mutation
                  mutation={STAR_REPOSITORY}
                  variables={{ id }}
                  update={updateStar}
                >
                  {(addStar, { data, loading, error }) => (
                    <Button
                      className='repository-item__btn'
                      color='gray'
                      onClick={addStar}
                    >
                      <span>Star&nbsp;</span>
                      &#9733; {stargazers.totalCount}
                    </Button>
                  )}
                </Mutation>
              )
          }
          {
            <Mutation
              mutation={WATCH_REPOSITORY}
              variables={{
                id,
                viewerSubscription: isWatch(viewerSubscription)
                  ? VIEWER_SUBSCRIPTIONS.UNSUBSCRIBED
                  : VIEWER_SUBSCRIPTIONS.SUBSCRIBED
              }}
              optimisticResponse={{
                updateSubscription: {
                  __typename: 'Mutation',
                  subscribable: {
                    __typename: 'Repository',
                    id,
                    viewerSubscription: isWatch(viewerSubscription)
                      ? VIEWER_SUBSCRIPTIONS.UNSUBSCRIBED
                      : VIEWER_SUBSCRIPTIONS.SUBSCRIBED
                  }
                }
              }}
              update={updateWatch}
            >
              {(updateSubscription, { data, loading, error }) => (
                <Button
                  className={`repository-item__btn btn ${isWatch(viewerSubscription) ? 'btn--black' : 'btn--gray'}`}
                  onClick={updateSubscription}
                >
                  &#128065; {watchers.totalCount}
                </Button>
              )}
            </Mutation>
          }
        </div>
      </div>

      <div className='repository-item__description'>
        <div
          className='repository-item__info'
          dangerouslySetInnerHTML={{ __html: descriptionHTML }}
        />

        <div className='repository-item__details'>
          <div>
            {primaryLanguage && (
              <span>Language: {primaryLanguage.name}</span>
            )}
          </div>
          <div>
            {owner && (
              <span>Owner: <a href={owner.url}>{owner.login}</a></span>
            )}
          </div>
        </div>
      </div>
    </div>
  )

export default RepositoryItem;