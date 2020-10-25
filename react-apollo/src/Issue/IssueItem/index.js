import React from 'react';

import Link from '../../Link';

import './style.css';

const IssueItem = ({ issue }) => (
  <div className='issue-item'>

    <div className='issue-item__content'>
      <h3>
        <Link href={issue.url}>
          {issue.title}
        </Link>
      </h3>

      <div dangerouslySetInnerHTML={{ __html: issue.bodyHTML }} />
    </div>
  </div>
)

export default IssueItem;