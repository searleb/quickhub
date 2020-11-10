import React from 'react';

const Button = ({ children, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="p-2 text-blue-900 transition-colors duration-200 bg-gray-200 border rounded hover:bg-gray-300"
  >
    {children}
  </button>
);

export default Button;
