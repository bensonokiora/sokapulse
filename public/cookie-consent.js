(function() {
  // Check if user already consented
  if (localStorage.getItem('cookie-consent')) {
    return;
  }
  
  // Create the cookie consent banner
  const createBanner = () => {
    const banner = document.createElement('div');
    banner.id = 'cookie-consent-banner';
    banner.style.position = 'fixed';
    banner.style.bottom = '20px';
    banner.style.left = '20px';
    banner.style.maxWidth = '400px';
    banner.style.backgroundColor = 'white';
    banner.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.15)';
    banner.style.borderRadius = '8px';
    banner.style.zIndex = '9999';
    banner.style.animation = 'slide-in 0.5s forwards';
    
    // Create styles
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slide-in {
        from {
          transform: translateY(100px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }
      
      @keyframes slide-out {
        from {
          transform: translateY(0);
          opacity: 1;
        }
        to {
          transform: translateY(100px);
          opacity: 0;
        }
      }
      
      #cookie-consent-banner {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      }
      
      #cookie-consent-banner .content {
        padding: 20px;
      }
      
      #cookie-consent-banner .buttons {
        display: flex;
        gap: 10px;
        margin-top: 15px;
        justify-content: flex-end;
      }
      
      #cookie-consent-banner button {
        padding: 8px 16px;
        border-radius: 4px;
        font-weight: 500;
        cursor: pointer;
        border: 1px solid transparent;
        font-size: 14px;
        transition: all 0.2s ease;
      }
      
      #cookie-consent-banner button:hover {
        opacity: 0.9;
        transform: translateY(-1px);
      }
      
      #cookie-consent-banner .btn-outline {
        background-color: transparent;
        border-color: #6c757d;
        color: #6c757d;
      }
      
      #cookie-consent-banner .btn-outline:hover {
        background-color: rgba(108, 117, 125, 0.1);
      }
      
      #cookie-consent-banner .btn-primary {
        background-color: #dc3545;
        color: white;
        border-color: #dc3545;
      }
      
      @media (max-width: 480px) {
        #cookie-consent-banner {
          left: 10px;
          right: 10px;
          bottom: 10px;
          max-width: none;
        }
      }
    `;
    document.head.appendChild(style);
    
    // Create content container
    const content = document.createElement('div');
    content.className = 'content';
    
    // Create heading
    const heading = document.createElement('h5');
    heading.style.fontSize = '18px';
    heading.style.marginTop = '0';
    heading.innerHTML = '<i class="bi bi-cookie" style="margin-right: 8px;"></i>Cookies & Privacy';
    
    // Create description
    const description = document.createElement('p');
    description.style.fontSize = '14px';
    description.style.lineHeight = '1.5';
    description.style.marginBottom = '15px';
    description.innerHTML = `
      We use cookies to improve your experience. By continuing, you agree to our use of cookies.
      You can learn more in our <a href="/privacy-policy" style="color: #0d6efd; text-decoration: none;">Privacy Policy</a>.
    `;
    
    // Create button container
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'buttons';
    
    // Create necessary cookies button
    const necessaryButton = document.createElement('button');
    necessaryButton.className = 'btn-outline';
    necessaryButton.textContent = 'Necessary Only';
    necessaryButton.onclick = () => {
      localStorage.setItem('cookie-consent', 'necessary');
      banner.style.animation = 'slide-out 0.5s forwards';
      setTimeout(() => {
        document.body.removeChild(banner);
      }, 500);
    };
    
    // Create accept all button
    const acceptAllButton = document.createElement('button');
    acceptAllButton.className = 'btn-primary';
    acceptAllButton.textContent = 'Accept All';
    acceptAllButton.onclick = () => {
      localStorage.setItem('cookie-consent', 'all');
      banner.style.animation = 'slide-out 0.5s forwards';
      setTimeout(() => {
        document.body.removeChild(banner);
      }, 500);
      
      // Initialize analytics if needed
      if (window.gtag) {
        gtag('consent', 'update', {
          'analytics_storage': 'granted',
          'ad_storage': 'granted'
        });
      }
    };
    
    // Add buttons to container
    buttonContainer.appendChild(necessaryButton);
    buttonContainer.appendChild(acceptAllButton);
    
    // Add all elements to content
    content.appendChild(heading);
    content.appendChild(description);
    content.appendChild(buttonContainer);
    
    // Add content to banner
    banner.appendChild(content);
    
    // Add banner to body
    setTimeout(() => {
      document.body.appendChild(banner);
    }, 1500);
  };
  
  // Init banner when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createBanner);
  } else {
    createBanner();
  }
})(); 