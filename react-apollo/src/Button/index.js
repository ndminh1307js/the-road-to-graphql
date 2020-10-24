import React from 'react';

import './style.css';

const Button = ({
  children,
  className,
  color = 'black',
  type = 'button',
  ...rest
}) => (
    <button
      className={`${className} btn btn--${color}`}
      type={type}
      {...rest}
    >
      {children}
    </button>
  )

export default Button;