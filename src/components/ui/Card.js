// src/components/ui/Card.js
'use client';

import React from 'react';

const cn = (...classes) => classes.filter(Boolean).join(' ');

export const Card = ({ className, ...props }) => (
  <div 
    className={cn("bg-card border border-border rounded-lg shadow-sm", className)} 
    {...props} 
  />
);

export const CardHeader = ({ className, ...props }) => (
  <div 
    className={cn("p-6 border-b border-border", className)} 
    {...props} 
  />
);

export const CardTitle = ({ className, ...props }) => (
  <h3 
    className={cn("text-lg font-semibold text-foreground", className)} 
    {...props} 
  />
);

export const CardContent = ({ className, ...props }) => (
  <div 
    className={cn("p-6", className)} 
    {...props} 
  />
);

export const CardFooter = ({ className, ...props }) => (
  <div 
    className={cn("p-6 border-t border-border", className)} 
    {...props} 
  />
);