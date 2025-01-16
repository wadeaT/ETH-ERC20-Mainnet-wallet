'use client';

import React from 'react';

export const Card = ({ children, ...props }) => (
  <div className="bg-white shadow-md rounded-lg" {...props}>
    {children}
  </div>
);

export const CardHeader = ({ children, ...props }) => (
  <div className="px-6 py-4 border-b" {...props}>
    {children}
  </div>
);

export const CardTitle = ({ children, ...props }) => (
  <h2 className="text-lg font-bold" {...props}>
    {children}
  </h2>
);

export const CardContent = ({ children, ...props }) => (
  <div className="px-6 py-4" {...props}>
    {children}
  </div>
);

export const CardFooter = ({ children, ...props }) => (
  <div className="px-6 py-4 border-t" {...props}>
    {children}
  </div>
);