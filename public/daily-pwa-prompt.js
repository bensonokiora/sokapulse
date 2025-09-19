// Daily PWA Install Prompt for SokaPulse
// This script shows the PWA install button at most once per day
// Using recommended best practices from web.dev and MDN

(function() {
  // Skip if another PWA script has already run the daily prompt
  if (window.DAILY_PWA_PROMPT_LOADED) {
    return;
  }
  
  // Check if this is a mobile device
  const isMobileDevice = function() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  };
  
  // Skip on desktop devices
  if (!isMobileDevice()) {
    // Still mark as loaded to prevent other instances from running
    window.DAILY_PWA_PROMPT_LOADED = true;
    return;
  }
  
  // Mark as loaded
  window.DAILY_PWA_PROMPT_LOADED = true;

  // Enable debugging
  const DEBUG = true;
  function logDebug(message, obj = null) {
    if (DEBUG) {
      if (obj) {
        //console.log(`[Daily PWA] ${message}`, obj);
      } else {
        //console.log(`[Daily PWA] ${message}`);
      }
    }
  }
  
  logDebug('Daily PWA prompt initialized');

  // Store the install prompt event
  let installPromptEvent;
  
  // Local storage key for the last time the prompt was shown
  const PROMPT_SHOWN_KEY = 'sokapulse_pwa_prompt_shown';
  
  // Check if the prompt was shown in the last 24 hours
  function wasPromptShownToday() {
    const lastShown = localStorage.getItem(PROMPT_SHOWN_KEY);
    if (!lastShown) {
      return false;
    }
    
    // Check if it's been shown in the last 24 hours
    const lastShownDate = new Date(parseInt(lastShown, 10));
    const now = new Date();
    const daysDifference = (now - lastShownDate) / (1000 * 60 * 60 * 24);
    
    logDebug(`Last shown ${daysDifference.toFixed(2)} days ago`);
    
    return daysDifference < 1; // Less than 1 day ago
  }
  
  // Mark the prompt as shown today
  function markPromptAsShown() {
    localStorage.setItem(PROMPT_SHOWN_KEY, Date.now().toString());
    logDebug('Prompt marked as shown today');
  }
  
  // Determine if we should show the install prompt
  function shouldShowPrompt() {
    // Don't show if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      logDebug('App already installed in standalone mode');
      return false;
    }
    
    // Don't show if was shown today
    if (wasPromptShownToday()) {
      logDebug('Prompt was already shown today');
      return false;
    }
    
    // Don't show on iOS Safari (which doesn't support standard PWA install)
    const isIOSSafari = /iPhone|iPad|iPod/.test(navigator.userAgent) && 
                       !window.MSStream && 
                       /Safari/i.test(navigator.userAgent);
    if (isIOSSafari) {
      logDebug('Not showing on iOS Safari');
      return false;
    }
    
    // Check if user has previously dismissed (different from shown today)
    const dismissedUntil = localStorage.getItem('pwaPromptDismissed');
    if (dismissedUntil && parseInt(dismissedUntil) > Date.now()) {
      logDebug('Prompt was previously dismissed, not showing');
      return false;
    }
    
    return true;
  }

  // Listen for beforeinstallprompt event
  window.addEventListener('beforeinstallprompt', (event) => {
    // Prevent the default browser prompt
    event.preventDefault();
    
    // Store the event for later use
    installPromptEvent = event;
    
    logDebug('beforeinstallprompt event captured');
    
    // Show the prompt if it should be shown
    if (shouldShowPrompt()) {
      // Delay showing prompt to avoid interrupting user's initial experience
      setTimeout(() => {
        showInstallPrompt();
      }, 5000); // Show after 5 seconds
    }
  });
  
  // Show the install prompt
  function showInstallPrompt() {
    // Use the existing fixPwaCardCSS function if available
    if (window.fixPwaCardCSS && typeof window.fixPwaCardCSS === 'function') {
      window.fixPwaCardCSS();
      logDebug('Showed install prompt');
      
      // Mark the prompt as shown today
      markPromptAsShown();
      
      // Auto-hide after 15 seconds if no interaction
      setTimeout(hideInstallPrompt, 15000);
    } else {
      logDebug('fixPwaCardCSS function not available');
      
      // Try to use the showInstallPrompt function from pwa-init.js if available
      if (window.showInstallPrompt && typeof window.showInstallPrompt === 'function') {
        window.showInstallPrompt();
        markPromptAsShown();
      }
    }
  }
  
  // Hide the install prompt
  function hideInstallPrompt() {
    const installButton = document.getElementById('sokapulse-pwa-install-button');
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
  
  // Handle install button click
  document.addEventListener('click', function(e) {
    // Check if the click was on the install button or its children
    const installBtn = document.querySelector('.sokapulse-pwa-prompt-btn');
    if (installBtn && (e.target === installBtn || installBtn.contains(e.target))) {
      if (installPromptEvent) {
        // Show the browser's install prompt
        installPromptEvent.prompt();
        
        // Wait for the user to respond to the prompt
        installPromptEvent.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            logDebug('User accepted the install prompt');
          } else {
            logDebug('User dismissed the install prompt');
            
            // Store preference not to show again for 7 days
            const expiryTime = Date.now() + (7 * 24 * 60 * 60 * 1000); // 7 days
            localStorage.setItem('pwaPromptDismissed', expiryTime);
          }
          
          // Reset the install prompt event
          installPromptEvent = null;
          
          // Hide the prompt
          hideInstallPrompt();
        });
      } else {
        logDebug('No installation prompt available');
      }
    }
    
    // Check if the click was on the close button
    const closeBtn = document.querySelector('.sokapulse-pwa-prompt-close');
    if (closeBtn && (e.target === closeBtn || closeBtn.contains(e.target))) {
      // Store preference in localStorage not to show again for 7 days
      const expiryTime = Date.now() + (7 * 24 * 60 * 60 * 1000); // 7 days
      localStorage.setItem('pwaPromptDismissed', expiryTime);
      
      // Hide the prompt
      hideInstallPrompt();
    }
  });
  
  // Handle app installed event
  window.addEventListener('appinstalled', (event) => {
    logDebug('App was installed', event);
    
    // Hide the prompt
    hideInstallPrompt();
    
    // Clear the install prompt event
    installPromptEvent = null;
  });
  
  // Debug function to force show prompt (for testing)
  window.forceShowPwaPrompt = function() {
    showInstallPrompt();
    return "PWA prompt forced to show";
  };
  
  // Debug function to reset prompt shown status (for testing)
  window.resetPwaPromptShown = function() {
    localStorage.removeItem(PROMPT_SHOWN_KEY);
    return "PWA prompt shown status reset";
  };
  
})(); 