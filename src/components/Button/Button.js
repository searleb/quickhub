import React from 'react';
import cn from 'classnames';

const Button = ({ onClick, small, text }) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      ' text-blue-900 transition-colors duration-200 bg-gray-200 border rounded hover:bg-gray-400',
      {
        'p-2': !small,
        'px-1': small,
      },
    )}
  >
    {text}
  </button>
);

export default Button;
