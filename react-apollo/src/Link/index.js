import React from 'react';

import './style.css';

const Link = ({ children, ...rest }) => (
  <a
    {...rest}
    className='link'
    target='_blank'
    rel='noopener noreferrer'
  >
    {children}
  </a>
)

export default Link;