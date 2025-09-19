// PWA Installation Handler for SokaPulse
// This script is designed to work alongside pwa-init.js

// Use an IIFE to avoid global namespace pollution
(function() {
  // Skip if another PWA script has already run
  if (window.PWA_INIT_LOADED) {
    return;
  }

  // Check if this is a mobile device
  const isMobileDevice = function() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  };

  // Skip on desktop devices
  if (!isMobileDevice()) {
    return;
  }

  // Variables for PWA installation
  // Use different variable names to avoid conflicts
  let pwaPrompt;
  const pwaButton = document.createElement('button');
  pwaButton.classList.add('sokapulse-pwa-install-footer-button');
  pwaButton.textContent = 'Install App';
  pwaButton.style.display = 'none';
  pwaButton.setAttribute('aria-label', 'Install SokaPulse App');
  
  // Add an icon to make it more visible
  const installIcon = document.createElement('span');
  installIcon.innerHTML = '↓';
  installIcon.style.marginRight = '6px';
  installIcon.style.fontWeight = 'bold';
  pwaButton.prepend(installIcon);

  // Add button to the DOM
  document.addEventListener('DOMContentLoaded', () => {
    const footer = document.querySelector('footer');
    if (footer) {
      footer.insertAdjacentElement('beforebegin', pwaButton);
    } else {
      // If no footer is found, append to body
      document.body.appendChild(pwaButton);
    }
  });

  // Listen for beforeinstallprompt event if not handled by pwa-init.js
  if (!window.deferredPrompt) {
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      pwaPrompt = e;
      // Update UI to notify the user they can add to home screen
      pwaButton.style.display = 'flex'; // Changed to flex to use the CSS properly
    });
  }

  // When the user clicks the install button
  pwaButton.addEventListener('click', (e) => {
    // Hide the install button
    pwaButton.style.display = 'none';
    
    // Use either the local or global prompt
    const promptToUse = pwaPrompt || window.deferredPrompt;
    
    if (!promptToUse) {
      console.log('No installation prompt available');
      return;
    }
    
    // Show the prompt
    promptToUse.prompt();
    // Wait for the user to respond to the prompt
    promptToUse.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the A2HS prompt');
      } else {
        console.log('User dismissed the A2HS prompt');
      }
      
      // Clear the prompts
      pwaPrompt = null;
      if (window.deferredPrompt === promptToUse) {
        window.deferredPrompt = null;
      }
    });
  });

  // Detect when the PWA was successfully installed
  window.addEventListener('appinstalled', (evt) => {
    console.log('SokaPulse app was installed');
    pwaButton.style.display = 'none';
  });
})(); 