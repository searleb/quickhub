import React from 'react';
import cn from 'classnames';

const Button = ({
  onClick, small, text, className, active,
}) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      className,
      ' text-blue-900 transition-colors duration-200 bg-gray-200 border rounded hover:bg-gray-400 whitespace-no-wrap leading-none',
      {
        'p-2': !small,
        'px-1': small,
        'shadow-outline': active,
      },
    )}
  >
    {text}
  </button>
);

export default Button;
