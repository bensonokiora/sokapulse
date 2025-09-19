// PWA Initialization for SokaPulse 
// This file loads the service worker and handles app installation

// Add the fixPwaCardCSS function to window for global access
window.fixPwaCardCSS = function(elementId) {
  const id = elementId || 'sokapulse-pwa-install-button';
  const card = document.getElementById(id);
  if (!card) return "PWA card element not found";
  
  // Force correct positioning with important inline styles
  const cardStyle = `
    position: static !important;
    pointer-events: auto !important;
    background-color: #ffffff !important;
    border-radius: 10px !important;
    box-shadow: 0 3px 12px rgba(0, 0, 0, 0.15) !important;
    max-width: 90% !important;
    width: 320px !important;
    overflow: hidden !important;
    display: block !important;
    border: 1px solid #e0e0e0 !important;
    opacity: 1 !important;
    margin: 0 !important;
    padding: 0 !important;
    z-index: 999999 !important;
  `;
  
  // Check if container exists, if not create it
  let container = document.getElementById('sokapulse-pwa-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'sokapulse-pwa-container';
    document.body.appendChild(container);
    
    // Add card to container if it's not already there
    if (card.parentNode !== container) {
      container.appendChild(card);
    }
  }
  
  // Style the container
  container.style.cssText = `
    position: fixed !important;
    bottom: 20px !important;
    left: 0 !important;
    right: 0 !important;
    width: 100% !important;
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    pointer-events: none !important;
    z-index: 999999 !important;
    margin: 0 !important;
    padding: 0 !important;
  `;
  
  // Style the card
  card.style.cssText = cardStyle;
  card.classList.add('show');
  
  return "PWA card fixed";
};

// Immediately reserve space for elements that might cause layout shifts
(function preventLayoutShifts() {
  // Create a style element with minimal critical CSS for layout stability
  const criticalStyle = document.createElement('style');
  criticalStyle.id = 'pwa-critical-styles';
  criticalStyle.textContent = `
    /* Reserve space for PWA installation prompt to prevent layout shifts */
    body::after {
      content: '';
      display: block;
      height: 100px;
      visibility: hidden;
      pointer-events: none;
    }
    
    /* Fixed height containers to prevent shifts on content load */
    @media (max-width: 768px) {
      .pwa-install-prompt {
        contain: layout style size;
        contain-intrinsic-size: 0 68px;
      }
      
      /* Ensure the right amount of space is reserved */
      .soka-seo-content-description {
        min-height: 120px !important;
        contain: layout style;
        content-visibility: auto;
      }
    }
  `;
  
  // Append to head immediately 
  if (document.head) {
    document.head.appendChild(criticalStyle);
  } else {
    // If head isn't available yet, use onload
    window.addEventListener('DOMContentLoaded', function() {
      document.head.appendChild(criticalStyle);
    }, { once: true });
  }
})();

// Wrap everything in an IIFE to avoid polluting global scope and prevent redeclarations
(function() {
  // Check if script has already been executed
  if (window.PWA_INIT_LOADED) {
    return;
  }
  
  // Helper function to detect mobile devices
  const isMobileDevice = function() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  };
  
  // Only run PWA code on mobile devices
  if (!isMobileDevice()) {
    // Set the flag to prevent other scripts from running
    window.PWA_INIT_LOADED = true;
    return;
  }
  
  // Mark as loaded
  window.PWA_INIT_LOADED = true;

  // Add debugging utility
  const DEBUG = true;
  function logDebug(message, obj = null) {
    if (DEBUG) {
      if (obj) {
        //console.log(`[PWA Debug] ${message}`, obj);
      } else {
        //console.log(`[PWA Debug] ${message}`);
      }
    }
  }

  logDebug('PWA initialization started');

  // Variables for installation
  let deferredPrompt;
  let installButton;

  // Create the installation button immediately, don't wait for DOMContentLoaded
  createInstallButton();

  // Register service worker with improved error handling
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      logDebug('Window loaded, checking service worker');
      
      // First, check for any existing failed registrations and unregister them
      navigator.serviceWorker.getRegistrations().then(function(registrations) {
        logDebug('Current service worker registrations:', registrations);
        for(let registration of registrations) {
          // Check if the service worker is in a failed state (redundant)
          if (registration.active && registration.active.state === 'redundant') {
            logDebug('Found a failed service worker, unregistering it');
            registration.unregister().then(function() {
              logDebug('Successfully unregistered failed service worker');
            });
          }
        }
      }).catch(function(err) {
        console.error('Error checking existing service workers:', err);
      });

      // Now register the service worker with retry logic
      let retryCount = 0;
      const maxRetries = 3;
      
      function registerServiceWorker() {
        logDebug('Attempting to register service worker');
        navigator.serviceWorker.register('/service-worker.js', {
          // Add scope if needed
          // scope: '/'
        })
        .then(function(registration) {
          logDebug('Service Worker registered with scope:', registration.scope);
          
          // Add update handling
          registration.addEventListener('updatefound', function() {
            const newWorker = registration.installing;
            logDebug('New service worker installing', newWorker);
            
            newWorker.addEventListener('statechange', function() {
              logDebug('Service worker state:', newWorker.state);
            });
          });
        })
        .catch(function(error) {
          console.error('Service Worker registration failed:', error);
          
          // Retry registration with exponential backoff
          if (retryCount < maxRetries) {
            retryCount++;
            const delay = Math.pow(2, retryCount) * 1000;
            logDebug(`Retrying service worker registration in ${delay}ms (attempt ${retryCount}/${maxRetries})`);
            
            setTimeout(function() {
              registerServiceWorker();
            }, delay);
          } else {
            console.error('Service Worker registration failed after maximum retries');
          }
        });
      }
      
      // Start the registration process
      registerServiceWorker();
    });
  } else {
    logDebug('Service Worker API not available in this browser');
  }

  // Create and append the install button to the body
  function createInstallButton() {
    logDebug('Creating install button');
    
    // Instead of a placeholder, create a wrapper to ensure proper positioning
    function createWrapper() {
      if (!document.getElementById('sokapulse-pwa-container')) {
        // Create container to avoid inheritance issues
        const container = document.createElement('div');
        container.id = 'sokapulse-pwa-container';
        
        // Use inline styles to avoid CSS conflicts
        container.style.cssText = `
          position: fixed !important;
          bottom: 20px !important;
          left: 0 !important;
          right: 0 !important;
          width: 100% !important;
          display: flex !important;
          justify-content: center !important;
          align-items: center !important;
          pointer-events: none !important;
          z-index: 999999 !important;
        `;
        
        if (document.body) {
          document.body.appendChild(container);
          logDebug('Added PWA container with reliable centering');
        } else {
          setTimeout(createWrapper, 100);
        }
        
        return container;
      }
      
      return document.getElementById('sokapulse-pwa-container');
    }
    
    // Create the wrapper immediately
    const wrapper = createWrapper();

    // Create the button element
    installButton = document.createElement('div');
    installButton.id = 'sokapulse-pwa-install-button';
    installButton.className = 'sokapulse-pwa-install-prompt';
    
    // Set pointer-events explicitly to override the container's setting
    installButton.style.pointerEvents = 'auto';
    
    // Create inner container to avoid styling conflicts
    installButton.innerHTML = `
      <div class="sokapulse-pwa-prompt-content">
        <span class="sokapulse-pwa-prompt-message">Install SokaPulse App</span>
        <div class="sokapulse-pwa-prompt-actions">
          <button class="sokapulse-pwa-prompt-btn">Install</button>
          <button class="sokapulse-pwa-prompt-close" aria-label="Close">&times;</button>
        </div>
      </div>
    `;
    
    // Append to the container
    function appendButton() {
      const container = document.getElementById('sokapulse-pwa-container');
      
      if (container) {
        if (!document.getElementById('sokapulse-pwa-install-button')) {
          // Append to the container, not directly to body
          container.appendChild(installButton);
          
          // Add event listeners
          const installBtn = installButton.querySelector('.sokapulse-pwa-prompt-btn');
          if (installBtn) {
            installBtn.addEventListener('click', installPWA);
          }
    
          const closeBtn = installButton.querySelector('.sokapulse-pwa-prompt-close');
          if (closeBtn) {
            closeBtn.addEventListener('click', function() {
              hideInstallPrompt();
              // Store preference in localStorage to not show again for 7 days
              const expiryTime = Date.now() + (7 * 24 * 60 * 60 * 1000); // 7 days
              localStorage.setItem('pwaPromptDismissed', expiryTime);
            });
          }
          
          logDebug('Install button added to container');
        }
      } else {
        // If container isn't available yet, try again later
        setTimeout(appendButton, 100);
      }
    }
    
    // Start the process of appending the button
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', appendButton);
    } else {
      appendButton();
    }
  }

  // Show the installation prompt
  function showInstallPrompt() {
    // Get the button from DOM if it exists but our reference is lost
    if (!installButton) {
      installButton = document.getElementById('sokapulse-pwa-install-button');
    }
    
    if (installButton) {
      logDebug('Showing install prompt');
      
      // Check if user previously dismissed
      const dismissedUntil = localStorage.getItem('pwaPromptDismissed');
      if (dismissedUntil && parseInt(dismissedUntil) > Date.now()) {
        logDebug('Prompt was previously dismissed, not showing');
        return; // Still in dismissal period
      }
      
      // Check if this is a mobile device
      const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      logDebug('Is mobile device:', isMobile);
      
      // Check if this is iOS Safari (which doesn't support standard PWA install)
      const isIOSSafari = /iPhone|iPad|iPod/.test(navigator.userAgent) && !window.MSStream && /Safari/i.test(navigator.userAgent);
      logDebug('Is iOS Safari:', isIOSSafari);
      
      // Show on all platforms except iOS Safari, and make sure to show on desktop too
      if (!isIOSSafari) {
        // ALWAYS use the reliable fixPwaCardCSS approach that we know works
        window.fixPwaCardCSS();
        logDebug('Applied fixPwaCardCSS to ensure proper display');
        
        // Auto-hide after 15 seconds if no interaction
        setTimeout(function() {
          hideInstallPrompt();
        }, 15000);
      } else {
        logDebug('Not showing install prompt on iOS Safari');
      }
    } else {
      logDebug('Install button not found');
      // Try to create it if it doesn't exist
      createInstallButton();
      // And try showing again after a small delay
      setTimeout(showInstallPrompt, 100);
    }
  }

  // Hide the installation prompt
  function hideInstallPrompt() {
    if (installButton) {
      // First remove the show class to trigger animation
      installButton.classList.remove('show');
      
      // Then hide the element after animation completes
      setTimeout(() => {
        installButton.style.display = 'none';
        logDebug('Install prompt hidden with animation');
      }, 300); // Match the transition duration in CSS
    }
  }

  // Add a manual install button for testing
  function addManualInstallButton() {
    const manualBtn = document.createElement('button');
    manualBtn.textContent = 'Test Install PWA';
    manualBtn.style.position = 'fixed';
    manualBtn.style.bottom = '70px';
    manualBtn.style.right = '20px';
    manualBtn.style.zIndex = '9999';
    manualBtn.style.padding = '10px';
    manualBtn.style.backgroundColor = '#f44336';
    manualBtn.style.color = 'white';
    manualBtn.style.border = 'none';
    manualBtn.style.borderRadius = '4px';
    manualBtn.style.cursor = 'pointer';
    
    manualBtn.addEventListener('click', function() {
      logDebug('Manual install button clicked');
      if (deferredPrompt) {
        showInstallPrompt();
      } else {
        alert('Installation prompt not available. Make sure your app meets all PWA criteria.');
        logDebug('No deferred prompt available for manual install');
      }
    });
    
    document.body.appendChild(manualBtn);
    logDebug('Manual install test button added');
  }
  
  // Add manual test button in development or with URL parameter
  if (window.location.hostname === 'localhost' || window.location.hostname === '192.168.100.240' || window.location.search.includes('pwa-test')) {
    window.addEventListener('load', addManualInstallButton);
  }

  // Handle the beforeinstallprompt event
  window.addEventListener('beforeinstallprompt', function(e) {
    logDebug('beforeinstallprompt event fired', e);
    
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    
    // Stash the event so it can be triggered later
    deferredPrompt = e;
    
    // Ensure install button exists
    if (!installButton || !document.getElementById('sokapulse-pwa-install-button')) {
      createInstallButton();
    }
    
    // Show the install button
    showInstallPrompt();
  });

  // Handle the appinstalled event
  window.addEventListener('appinstalled', function(evt) {
    // Log app install event
    logDebug('SokaPulse App was installed', evt);
    
    // Hide the install button
    hideInstallPrompt();
    
    // Clear the deferredPrompt
    deferredPrompt = null;
  });

  // Check if the app is already installed
  if (window.matchMedia('(display-mode: standalone)').matches) {
    logDebug('App is already installed and running in standalone mode');
  }

  // Install the PWA
  function installPWA() {
    if (!deferredPrompt) {
      logDebug('No installation prompt available');
      return;
    }
    
    logDebug('Showing install prompt');
    
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice
      .then(function(choiceResult) {
        if (choiceResult.outcome === 'accepted') {
          logDebug('User accepted the install prompt');
        } else {
          logDebug('User dismissed the install prompt');
        }
        
        // We no longer need the prompt
        deferredPrompt = null;
        
        // Hide the install button
        hideInstallPrompt();
      });
  }
  
  // Check and fix PWA card positioning
  function checkPwaCardPosition() {
    const card = document.getElementById('sokapulse-pwa-install-button');
    if (card) {
      // Ensure proper centering and initial state
      card.style.display = 'none';
      card.classList.remove('show');
      
      // Add a manual debug/fix button in development
      if (window.location.hostname === 'localhost' || 
          window.location.hostname === '192.168.100.240' || 
          window.location.search.includes('pwa-debug')) {
        
        // Use the already defined window.fixPwaCardCSS function - no need to redefine it here
        
        const fixBtn = document.createElement('button');
        fixBtn.textContent = 'Fix PWA Card';
        fixBtn.style.position = 'fixed';
        fixBtn.style.bottom = '110px';
        fixBtn.style.right = '20px';
        fixBtn.style.zIndex = '999999';
        fixBtn.style.padding = '8px';
        fixBtn.style.backgroundColor = '#4CAF50';
        fixBtn.style.color = 'white';
        fixBtn.style.border = 'none';
        fixBtn.style.borderRadius = '4px';
        fixBtn.style.cursor = 'pointer';
        
        fixBtn.addEventListener('click', function() {
          // Force correct display using the global fixPwaCardCSS function
          window.fixPwaCardCSS();
        });
        
        document.body.appendChild(fixBtn);
        
        // Add a CSS conflict detector button
        const debugBtn = document.createElement('button');
        debugBtn.textContent = 'Debug PWA CSS';
        debugBtn.style.position = 'fixed';
        debugBtn.style.bottom = '150px';
        debugBtn.style.right = '20px';
        debugBtn.style.zIndex = '999999';
        debugBtn.style.padding = '8px';
        debugBtn.style.backgroundColor = '#ff9800';
        debugBtn.style.color = 'white';
        debugBtn.style.border = 'none';
        debugBtn.style.borderRadius = '4px';
        debugBtn.style.cursor = 'pointer';
        
        debugBtn.addEventListener('click', function() {
          // Check for conflicting styles
          try {
            const allSheets = Array.from(document.styleSheets);
            let conflicts = [];
            
            allSheets.forEach(sheet => {
              try {
                if (sheet.cssRules) {
                  Array.from(sheet.cssRules).forEach(rule => {
                    const selector = rule.selectorText;
                    if (selector && 
                       (selector.includes('fixed') || 
                        selector.includes('pwa') ||
                        selector.includes('install'))) {
                      conflicts.push({
                        selector: selector,
                        cssText: rule.cssText,
                        source: sheet.href || 'inline style'
                      });
                    }
                  });
                }
              } catch (e) {
                // CORS errors are common when accessing external stylesheets
                console.log('Could not check stylesheet:', sheet.href);
              }
            });
            
            console.log('Potential CSS conflicts:', conflicts);
            alert(`Found ${conflicts.length} potential CSS conflicts. Check console for details.`);
          } catch (e) {
            console.error('Error finding CSS conflicts:', e);
          }
        });
        
        document.body.appendChild(debugBtn);
      }
    } else {
      logDebug('PWA install button not found');
    }
  }
  
  // Run the check when the page is fully loaded
  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', checkPwaCardPosition);
  } else {
    checkPwaCardPosition();
  }
})(); // End of IIFE 