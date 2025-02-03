// src/lib/utils/styles.js
let clsx;
let twMerge;

try {
  clsx = require('clsx').clsx;
  twMerge = require('tailwind-merge').twMerge;
} catch (e) {
  // Fallback if packages are not available
  clsx = (...args) => args.filter(Boolean).join(' ');
  twMerge = (className) => className;
}

export const cn = (...inputs) => {
  return twMerge(clsx(inputs));
};