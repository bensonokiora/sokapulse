// OptimizedTitle.js - Component dedicated to optimizing the main heading for LCP

'use client';
import { useEffect, useRef } from 'react';

export default function OptimizedTitle({ title, className = '', style = {} }) {
  const headingRef = useRef(null);

  // This useEffect ensures the heading is prioritized for rendering
  useEffect(() => {
    if (headingRef.current) {
      // Mark this element as high priority for the browser
      if ('setAttribute' in headingRef.current) {
        headingRef.current.setAttribute('importance', 'high');
        
        // If browser supports it, use elementTiming attribute to measure LCP
        headingRef.current.setAttribute('elementtiming', 'main-heading-lcp');
        
        // Force a layout/paint to prioritize this element
        headingRef.current.getBoundingClientRect();
      }
    }
  }, []);

  const defaultStyles = {
    fontSize: '14px',
    fontWeight: 'bold',
    display: 'block',
    contentVisibility: 'auto',
    contain: 'layout style paint',
    visibility: 'visible',
    margin: '0.5em 0',
  };

  const mergedStyles = { ...defaultStyles, ...style };

  return (
    <h1
      ref={headingRef}
      id="main-heading"
      className={className}
      style={mergedStyles}
    >
      {title}
    </h1>
  );
} 