// PWA Debug Tool
// Add this to your page with ?pwa-debug=true in the URL to enable debugging

(function() {
  // Check if debugging is enabled via URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const debugEnabled = urlParams.get('pwa-debug') === 'true';
  
  if (!debugEnabled) {
    return;
  }
  
  //console.log('[PWA Debug] PWA debug tool initialized');
  
  // Helper function to detect mobile devices
  const isMobileDevice = function() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  };
  
  // Create debug UI
  function createDebugUI() {
    const debugContainer = document.createElement('div');
    debugContainer.style.position = 'fixed';
    debugContainer.style.top = '20px';
    debugContainer.style.right = '20px';
    debugContainer.style.backgroundColor = '#fff';
    debugContainer.style.border = '1px solid #ccc';
    debugContainer.style.padding = '15px';
    debugContainer.style.zIndex = '10000';
    debugContainer.style.borderRadius = '5px';
    debugContainer.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    debugContainer.style.maxWidth = '90%';
    debugContainer.style.width = '350px';
    debugContainer.style.maxHeight = '80vh';
    debugContainer.style.overflowY = 'auto';
    
    const title = document.createElement('h3');
    title.textContent = 'PWA Debug Tool';
    title.style.margin = '0 0 10px 0';
    
    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Close';
    closeBtn.style.position = 'absolute';
    closeBtn.style.top = '10px';
    closeBtn.style.right = '10px';
    closeBtn.style.padding = '5px';
    closeBtn.addEventListener('click', () => {
      debugContainer.style.display = 'none';
    });
    
    const statusList = document.createElement('ul');
    statusList.id = 'pwa-debug-list';
    statusList.style.listStyle = 'none';
    statusList.style.padding = '0';
    statusList.style.margin = '0';
    
    const testBtn = document.createElement('button');
    testBtn.textContent = 'Check PWA Status';
    testBtn.style.marginTop = '10px';
    testBtn.style.padding = '8px 16px';
    testBtn.style.backgroundColor = '#2196F3';
    testBtn.style.color = 'white';
    testBtn.style.border = 'none';
    testBtn.style.borderRadius = '4px';
    testBtn.style.cursor = 'pointer';
    
    testBtn.addEventListener('click', checkPWAStatus);
    
    debugContainer.appendChild(title);
    debugContainer.appendChild(closeBtn);
    debugContainer.appendChild(statusList);
    debugContainer.appendChild(testBtn);
    
    document.body.appendChild(debugContainer);
  }
  
  // Add an item to the status list
  function addStatusItem(text, isSuccess) {
    const list = document.getElementById('pwa-debug-list');
    if (list) {
      const item = document.createElement('li');
      item.style.padding = '5px 0';
      item.style.borderBottom = '1px solid #eee';
      
      const icon = document.createElement('span');
      icon.textContent = isSuccess ? '✅ ' : '❌ ';
      
      const textSpan = document.createElement('span');
      textSpan.textContent = text;
      
      item.appendChild(icon);
      item.appendChild(textSpan);
      list.appendChild(item);
    }
  }
  
  // Clear the status list
  function clearStatusList() {
    const list = document.getElementById('pwa-debug-list');
    if (list) {
      list.innerHTML = '';
    }
  }
  
  // Check various PWA requirements
  async function checkPWAStatus() {
    clearStatusList();
    
    // Check if this is a mobile device
    const isMobile = isMobileDevice();
    addStatusItem('Mobile device detected', isMobile);
    
    // Add a note about mobile-only configuration
    addStatusItem('PWA configured to show only on mobile', true);
    
    if (!isMobile) {
      addStatusItem('PWA prompts will not show on this device (desktop)', true);
    }
    
    // Check service worker
    addStatusItem('Service Worker API', 'serviceWorker' in navigator);
    
    // Check if running in a secure context (HTTPS or localhost)
    const isSecureContext = window.isSecureContext;
    addStatusItem('Secure Context (HTTPS or localhost)', isSecureContext);
    
    // Check if manifest is properly linked
    const manifestLinks = document.querySelectorAll('link[rel="manifest"]');
    addStatusItem('Manifest is linked in HTML', manifestLinks.length > 0);
    
    if (manifestLinks.length > 0) {
      // Try to fetch the manifest
      try {
        const manifestUrl = manifestLinks[0].href;
        const response = await fetch(manifestUrl);
        const isValid = response.ok;
        addStatusItem(`Manifest file accessible at ${manifestUrl}`, isValid);
        
        if (isValid) {
          try {
            const manifest = await response.json();
            
            // Check required manifest properties
            addStatusItem('Manifest has name/short_name', !!(manifest.name || manifest.short_name));
            addStatusItem('Manifest has start_url', !!manifest.start_url);
            addStatusItem('Manifest has icons', !!(manifest.icons && manifest.icons.length > 0));
            addStatusItem('Manifest has at least one icon >= 192px', !!(manifest.icons && 
              manifest.icons.some(icon => {
                const sizes = icon.sizes?.split(' ') || [];
                return sizes.some(size => {
                  const [width] = size.split('x').map(Number);
                  return width >= 192;
                });
              })));
            addStatusItem('Manifest has display property', !!manifest.display);
            addStatusItem('Manifest has suitable display mode', 
              ['standalone', 'fullscreen', 'minimal-ui'].includes(manifest.display));
          } catch (e) {
            addStatusItem('Manifest JSON is valid', false);
            console.error('[PWA Debug] Error parsing manifest:', e);
          }
        }
      } catch (e) {
        addStatusItem('Manifest fetch successful', false);
        console.error('[PWA Debug] Error fetching manifest:', e);
      }
    }
    
    // Check if service worker is registered
    if ('serviceWorker' in navigator) {
      try {
        const registrations = await navigator.serviceWorker.getRegistrations();
        addStatusItem('Service Worker registered', registrations.length > 0);
        
        if (registrations.length > 0) {
          for (const registration of registrations) {
            addStatusItem(`Service Worker scope: ${registration.scope}`, true);
            addStatusItem(`Service Worker state: ${registration.active?.state || 'no active worker'}`, 
              !!registration.active);
          }
        }
      } catch (e) {
        addStatusItem('Service Worker registration check', false);
        console.error('[PWA Debug] Error checking service worker:', e);
      }
    }
    
    // Check beforeinstallprompt event handler
    addStatusItem('beforeinstallprompt handler exists', 
      !!window.deferredPrompt || 
      !!window.PWA_INIT_LOADED || 
      Array.from(window.getEventListeners?.('beforeinstallprompt') || []).length > 0);
    
    // Check if running as installed PWA
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                         window.navigator.standalone ||
                         document.referrer.includes('android-app://');
    addStatusItem('Already running as installed PWA', isStandalone);
    
    // Add browser info
    addStatusItem(`Browser: ${navigator.userAgent}`, true);
  }
  
  // Initialize debug tool on load
  window.addEventListener('load', () => {
    createDebugUI();
    // Auto-run the check
    setTimeout(checkPWAStatus, 1000);
  });
})(); 