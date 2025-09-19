import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';

export default function PremiumContent({ isLoggedIn, openLoginModal, children }) {
  if (isLoggedIn) {
    return <>{children}</>;
  }

  // Add CSS keyframes for the pulse animation
  const pulseKeyframes = `
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.1); }
      100% { transform: scale(1); }
    }
  `;

  // Add styles for premium locked content
  const premiumLockedStyles = `
    .mb-premium-locked {
      cursor: pointer;
      padding: 12px;
      background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
      border: 2px dashed #d1d5db;
      border-radius: 8px;
      text-align: center;
      transition: all 0.3s ease;
      min-height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .mb-premium-locked:hover {
      background: linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%);
      border-color: #9ca3af;
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    
    .mb-premium-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
    }
    
    .mb-premium-icon {
      color: #dc2626;
      font-size: 18px;
      animation: pulse 2s infinite ease-in-out;
    }
    
    .mb-premium-text {
      color: #374151;
      font-weight: 500;
      font-size: 14px;
    }
    
    .mb-unlock-btn {
      background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
      color: white;
      border: none;
      padding: 4px 12px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .mb-unlock-btn:hover {
      background: linear-gradient(135deg, #b91c1c 0%, #991b1b 100%);
      transform: translateY(-1px);
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }
    
    /* Responsive adjustments */
    @media (max-width: 768px) {
      .mb-premium-locked {
        padding: 8px 12px;
        min-height: 44px;
        background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
        border: 1px solid #e2e8f0;
        border-radius: 6px;
        position: relative;
        overflow: hidden;
      }
      
      .mb-premium-locked::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: linear-gradient(90deg, #dc2626 0%, #ef4444 50%, #dc2626 100%);
        animation: shimmer 2s infinite ease-in-out;
      }
      
      .mb-premium-content {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        gap: 8px;
      }
      
      .mb-premium-icon {
        font-size: 14px;
        color: #dc2626;
      }
      
      .mb-premium-text {
        font-size: 12px;
        font-weight: 600;
        color: #475569;
        flex: 1;
        text-align: left;
      }
      
      .mb-unlock-btn {
        padding: 4px 12px;
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.3px;
        text-transform: uppercase;
        background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%);
        border-radius: 12px;
        box-shadow: 0 1px 3px rgba(220, 38, 38, 0.3);
        border: none;
        color: white;
        cursor: pointer;
        transition: all 0.2s ease;
        flex-shrink: 0;
      }
      
      .mb-unlock-btn:hover {
        background: linear-gradient(135deg, #b91c1c 0%, #dc2626 100%);
        box-shadow: 0 2px 6px rgba(220, 38, 38, 0.4);
        transform: translateY(-1px);
      }
      
      @keyframes shimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }
    }
  `;

  return (
    <>
      <style>
        {pulseKeyframes}
        {premiumLockedStyles}
      </style>
      <div className="mb-premium-locked" onClick={openLoginModal}>
        <div className="mb-premium-content">
          <FontAwesomeIcon icon={faLock} className="mb-premium-icon" />
          <span className="mb-premium-text">Premium Content</span>
          <button className="mb-unlock-btn">Unlock</button>
        </div>
      </div>
    </>
  );
}