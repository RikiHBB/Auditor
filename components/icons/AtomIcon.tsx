import React from 'react';

export const AtomIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="-10 -10 120 120" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g fill="none" stroke="currentColor" strokeWidth="5">
      {/* Orbit 1 */}
      <ellipse cx="50" cy="50" rx="50" ry="25" />
      {/* Orbit 2 */}
      <ellipse cx="50" cy="50" rx="50" ry="25" transform="rotate(60 50 50)" />
      {/* Orbit 3 */}
      <ellipse cx="50" cy="50" rx="50" ry="25" transform="rotate(120 50 50)" />
    </g>
    {/* Nucleus */}
    <circle cx="50" cy="50" r="12" fill="currentColor" />
  </svg>
);