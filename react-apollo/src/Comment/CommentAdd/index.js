import React, { Component } from 'react';

import { gql } from '@apollo/client';
import { Mutation } from '@apollo/react-components';

import TextArea from '../../TextArea';
import Button from '../../Button';
import ErrorMessage from '../../Error';

const ADD_COMMENT = gql`
  mutation($subjectId: ID!, $body: String!) {
    addComment(input: {subjectId: $subjectId, body: $body}) {
      commentEdge {
        node {
          body
        }
      }
    }
  }
`;

class CommentAdd extends Component {

  state = {
    value: ''
  }

  onChange = (evt) => {
    this.setState({ value: evt.target.value });
  }

  onSubmit = (evt, addComment) => {
    evt.preventDefault();
    addComment().then(() => this.setState({ value: '' }));
  }

  render() {
    const { issueId } = this.props;
    const { value } = this.state;

    return (
      <Mutation
        mutation={ADD_COMMENT}
        variables={{
          subjectId: issueId,
          body: value
        }}
      >
        {(addComment, { data, loading, error }) => (
          <div>
            {error && <ErrorMessage error={error} />}

            <form onSubmit={(evt) => this.onSubmit(evt, addComment)}>
              <TextArea
                name='body'
                value={value}
                onChange={this.onChange}
                placeholder='Leave a comment'
              />
              <Button
                color='gray'
                type='submit'
              >
                Comment
              </Button>
            </form>
          </div>
        )}
      </Mutation>
    )
  }
}

export default CommentAdd;