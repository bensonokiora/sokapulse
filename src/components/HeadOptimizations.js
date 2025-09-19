'use client';

import { useEffect } from 'react';
import Script from 'next/script';

/**
 * Optimization component that adds preload hints for important resources
 * and sets up priorities for LCP optimization
 */
export default function HeadOptimizations() {
  // Add priority hints programmatically
  useEffect(() => {
    // Find the main heading element and prioritize it
    const mainHeading = document.getElementById('main-heading');
    if (mainHeading) {
      mainHeading.setAttribute('importance', 'high');
      mainHeading.setAttribute('fetchPriority', 'high');
    }

    // Find the seo-content-title element and prioritize it for mobile
    const seoTitles = document.querySelectorAll('.soka-seo-content-title');
    seoTitles.forEach(title => {
      title.setAttribute('importance', 'high');
      title.setAttribute('fetchPriority', 'high');
      title.setAttribute('data-lcp', 'true');
      title.style.contentVisibility = 'auto';
      title.style.display = 'block';
    });

    // NEW: Prioritize the paragraph which is now the LCP on mobile
    const seoDescriptions = document.querySelectorAll('.soka-seo-content-description');
    seoDescriptions.forEach(desc => {
      // Add high priority attributes
      desc.setAttribute('importance', 'high');
      desc.setAttribute('fetchPriority', 'high');
      desc.setAttribute('data-lcp', 'true');
      desc.setAttribute('elementtiming', 'description-lcp');
      
      // Apply performance-focused styles
      desc.style.contentVisibility = 'auto';
      desc.style.display = 'block';
      desc.style.maxWidth = '100%';
      desc.style.textRendering = 'optimizeSpeed';
    });

    // Ensure NavigationRow loads quickly
    const navRow = document.querySelector('.navigation-row');
    if (navRow) {
      navRow.setAttribute('importance', 'high');
    }

    // Defer low-priority elements
    const lowPriorityElements = document.querySelectorAll('.soka-seo-content-container, .soka-seo-links-container');
    lowPriorityElements.forEach(el => {
      el.setAttribute('loading', 'lazy');
      el.setAttribute('importance', 'low');
    });

    // Add preload links programmatically since we can't use Head in app directory
    const addPreloadLink = (href, as, priority = 'high') => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = href;
      link.as = as;
      link.fetchPriority = priority;
      document.head.appendChild(link);
    };

    // Add preconnect links
    const addPreconnect = (href, crossOrigin = '') => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = href;
      if (crossOrigin) {
        link.crossOrigin = crossOrigin;
      }
      document.head.appendChild(link);
    };

    // Add critical resource hints
    addPreconnect('https://fonts.googleapis.com');
    addPreconnect('https://fonts.gstatic.com', 'anonymous');
    addPreloadLink('/styles/custom.css', 'style');
    
    // Check if on mobile
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      // Add specific optimizations for mobile
      document.querySelectorAll('[data-lcp="true"]').forEach(el => {
        el.style.visibility = 'visible';
        el.style.contentVisibility = 'auto';
        
        // Specific optimizations for the paragraph
        if (el.classList.contains('soka-seo-content-description')) {
          // Apply mobile-specific styles for better rendering
          el.style.fontSize = '15px';
          el.style.lineHeight = '1.4';
          el.style.margin = '0.5em 0 1em';
          el.style.fontWeight = '400';
          el.style.color = '#333';
          el.style.contain = 'content';
          el.style.containIntrinsicSize = '0 100px';
        } else if (el.classList.contains('soka-seo-content-title')) {
          el.style.fontSize = 'clamp(16px, 4vw, 24px)';
          el.style.margin = '0.5em 0';
        }
      });
    }

    // NEW: Add anti-layout shift styles
    const addLayoutStabilityStyles = () => {
      // Create a style element for layout stability
      const stabilityStyle = document.createElement('style');
      stabilityStyle.id = 'layout-stability-styles';
      stabilityStyle.textContent = `
        /* Prevent PWA-related layout shifts */
        body {
          overflow-x: hidden;
        }
        
        /* Ensure proper content container dimensions */
        .soka-seo-content-container {
          min-height: 200px;
          contain: content;
          content-visibility: auto;
        }
        
        @media (max-width: 768px) {
          /* Reserve space for the paragraph element */
          .soka-seo-content-description {
            min-height: 120px;
            height: auto;
            width: 100%;
          }
          
          /* Reserve space for the navigation elements */
          .navigation-row {
            height: 40px;
            contain: layout style;
          }
        }
      `;
      document.head.appendChild(stabilityStyle);
    };

    // Run this early to avoid layout shifts
    addLayoutStabilityStyles();
  }, []);

  // Add a script to optimize the LCP element as early as possible
  return (
    <Script id="lcp-optimization" strategy="beforeInteractive">
      {`
        // Inline script to prioritize LCP elements before React hydration
        (function() {
          // Create a style element to add critical CSS early
          const style = document.createElement('style');
          style.textContent = \`
            .soka-seo-content-description {
              display: block !important;
              visibility: visible !important;
              content-visibility: auto;
              font-size: 15px;
              line-height: 1.4;
              margin: 0.5em 0 1em;
              color: #333;
              contain: content;
              contain-intrinsic-size: 0 100px;
              max-width: 100%;
              text-rendering: optimizeSpeed;
            }
            
            @media (max-width: 768px) {
              .soka-seo-content-description {
                font-size: 15px !important;
                line-height: 1.4 !important;
                opacity: 1 !important;
              }
            }
          \`;
          document.head.appendChild(style);
          
          const observer = new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
              if (entry.entryType === 'largest-contentful-paint') {
                const target = entry.element;
                if (target) {
                  target.style.visibility = 'visible';
                  target.style.contentVisibility = 'visible';
                  
                  // If it's the paragraph with class soka-seo-content-description
                  if (target.tagName === 'P' && target.classList.contains('soka-seo-content-description')) {
                    target.style.fontSize = '15px';
                    target.style.lineHeight = '1.4';
                    target.style.margin = '0.5em 0 1em';
                    target.style.fontWeight = '400';
                    target.style.color = '#333';
                    target.style.contain = 'content';
                    target.style.containIntrinsicSize = '0 100px';
                    target.setAttribute('data-lcp', 'true');
                  }
                  // If it's the h2 with class soka-seo-content-title
                  else if (target.tagName === 'H2' && target.classList.contains('soka-seo-content-title')) {
                    target.style.fontSize = 'clamp(16px, 4vw, 24px)';
                    target.style.margin = '0.5em 0';
                    target.setAttribute('data-lcp', 'true');
                  }
                }
              }
            }
          });
          
          observer.observe({ type: 'largest-contentful-paint', buffered: true });
          
          // Early initialization for mobile
          const isMobile = window.innerWidth <= 768;
          if (isMobile) {
            // Pre-optimize the description paragraph (current LCP element on mobile)
            document.addEventListener('DOMContentLoaded', () => {
              const seoDescriptions = document.querySelectorAll('.soka-seo-content-description');
              seoDescriptions.forEach(desc => {
                desc.setAttribute('importance', 'high');
                desc.setAttribute('fetchPriority', 'high');
                desc.style.contentVisibility = 'auto';
                desc.style.visibility = 'visible';
                desc.style.opacity = '1';
                desc.style.fontSize = '15px';
                desc.style.lineHeight = '1.4';
                desc.style.margin = '0.5em 0 1em';
                desc.style.color = '#333';
                desc.style.contain = 'content';
              });
            });
          }
        })();
      `}
    </Script>
  );
} 