'use client';

import React from 'react';

/**
 * TailwindIsolator component
 * This component is used to isolate Tailwind CSS styles to a specific part of the app
 * It wraps the component that needs Tailwind with a div that has a specific class
 * The Tailwind prefix in the config will ensure styles only apply within this wrapper
 */
export default function TailwindIsolator({ children }) {
  return (
    <div className="tailwind-isolated-scope payment-form-wrapper">
      {children}
    </div>
  );
} 