'use client';

import React from 'react';

export const Button = ({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  ...props
}) => (
  <button
    className={` 
      ${variant === 'primary' ? 'bg-blue-500 hover:bg-blue-700 text-white' : ''}
      ${variant === 'secondary' ? 'bg-gray-500 hover:bg-gray-700 text-white' : ''}
      ${variant === 'ghost' ? 'bg-transparent hover:bg-gray-200 text-gray-700' : ''}
      ${size === 'sm' ? 'px-4 py-2 text-sm' : ''}
      ${size === 'md' ? 'px-6 py-3 text-base' : ''}
      ${size === 'lg' ? 'px-8 py-4 text-lg' : ''}
      font-medium rounded-md transition-colors duration-300 ${className}
    `}
    {...props}
  >
    {children}
  </button>
);