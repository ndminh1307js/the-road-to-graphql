import React from 'react';

import './style.css';

const TextArea = ({ className, children, ...rest }) => (
  <textarea
    className={`${className} textarea`}
    {...rest}
  >
    {children}
  </textarea>
)

export default TextArea;