import React from 'react';

import './style.css';

const ErrorMessage = ({ error }) =>
  <p className='error-message'>
    {error.toString()}
  </p>

export default ErrorMessage;