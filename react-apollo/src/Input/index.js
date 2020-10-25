import React from 'react';

import './style.css';

const Input = ({
  color = 'white',
  type = 'text',
  ...rest
}) => (
    <input
      className={`input input--${color}`}
      type={type}
      {...rest}
    />
  )

export default Input;