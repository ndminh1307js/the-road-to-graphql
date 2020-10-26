import React from 'react';

import './style.css';

import { formatDate } from '../../utils';

const CommentItem = ({ comment }) => (
  <div className='comment-item'>
    <div className='comment-item__date'>
      {formatDate(comment.createdAt)}
    </div>
    <div className='comment-item__text'>
      <span className='comment-item__author'>
        {comment.author.login}:
      </span>
      <div
        className='comment-item__body'
        dangerouslySetInnerHTML={{ __html: comment.bodyHTML }}
      />
    </div>
  </div>
)

export default CommentItem;