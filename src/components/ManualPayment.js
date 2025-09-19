'use client';

import { useState } from 'react';

export default function ManualPayment({ paymentReason, onPayWithMpesaExpress }) {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  return (
    <div className="jp-manual-payment-section" style={{
      backgroundColor: 'white',
      margin: '20px 0',
      padding: '24px',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
      border: '1px solid #e5e7eb'
    }}>
      <div className="jp-payment-header" style={{
        textAlign: 'center',
        marginBottom: '24px'
      }}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: '700',
          color: '#111827',
          marginBottom: '8px'
        }}>
          💳 Manual Payment Option
        </h2>
        <p style={{
          color: '#6b7280',
          fontSize: '14px'
        }}>
          Pay via M-Pesa and get instant access to {paymentReason}
        </p>
      </div>

      {/* Step by step process */}
      <div className="jp-payment-steps" style={{
        backgroundColor: '#f9fafb',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px',
        border: '1px solid #e5e7eb'
      }}>
        <h3 style={{
          fontSize: '18px',
          fontWeight: '600',
          color: '#111827',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          📋 Step by Step Process
        </h3>
        
        <div className="jp-step-list">
          <div className="jp-step-item" style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            marginBottom: '12px'
          }}>
            <span style={{
              backgroundColor: '#dc2626',
              color: 'white',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: '600',
              flexShrink: 0
            }}>1</span>
            <span style={{ color: '#374151', fontSize: '14px' }}>
              Go to <strong>M-PESA</strong> → Select <strong>LIPA NA M-PESA</strong>
            </span>
          </div>

          <div className="jp-step-item" style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            marginBottom: '12px'
          }}>
            <span style={{
              backgroundColor: '#dc2626',
              color: 'white',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: '600',
              flexShrink: 0
            }}>2</span>
            <div style={{ color: '#374151', fontSize: '14px' }}>
              Enter PAY BILL: 
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#fef3c7',
                padding: '6px 12px',
                borderRadius: '6px',
                margin: '4px 0',
                border: '1px solid #f59e0b'
              }}>
                <strong style={{ color: '#92400e', fontSize: '16px' }}>883927</strong>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText('883927');
                    const btn = event.target;
                    const originalText = btn.textContent;
                    btn.textContent = '✓';
                    btn.style.color = '#059669';
                    setTimeout(() => {
                      btn.textContent = originalText;
                      btn.style.color = '#374151';
                    }, 1000);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#374151',
                    cursor: 'pointer',
                    fontSize: '12px',
                    padding: '2px'
                  }}
                >
                  📋
                </button>
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
                (KEDEVELOPERS TECH LTD)
              </div>
            </div>
          </div>

          <div className="jp-step-item" style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            marginBottom: '12px'
          }}>
            <span style={{
              backgroundColor: '#dc2626',
              color: 'white',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: '600',
              flexShrink: 0
            }}>3</span>
            <span style={{ color: '#374151', fontSize: '14px' }}>
              Enter Account No: <strong>Your Phone Number</strong>
            </span>
          </div>

          <div className="jp-step-item" style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            marginBottom: '12px'
          }}>
            <span style={{
              backgroundColor: '#dc2626',
              color: 'white',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: '600',
              flexShrink: 0
            }}>4</span>
            <span style={{ color: '#374151', fontSize: '14px' }}>
              Select Amount <strong>(Access All Jackpots)</strong>
            </span>
          </div>

          <div className="jp-step-item" style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            marginBottom: '12px'
          }}>
            <span style={{
              backgroundColor: '#dc2626',
              color: 'white',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: '600',
              flexShrink: 0
            }}>5</span>
            <span style={{ color: '#374151', fontSize: '14px' }}>
              After Payment: <strong>Your Password is sent instantly via SMS</strong>
            </span>
          </div>

          <div className="jp-step-item" style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px'
          }}>
            <span style={{
              backgroundColor: '#dc2626',
              color: 'white',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: '600',
              flexShrink: 0
            }}>6</span>
            <span style={{ color: '#374151', fontSize: '14px' }}>
              Games Access: Tap <strong>VIP/LOGIN</strong> → enter Phone & Password
            </span>
          </div>
        </div>
      </div>

      {/* Pricing Options */}
      <div className="jp-pricing-options" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '20px'
      }}>
        {[
          { amount: 150, duration: '3 days', popular: false },
          { amount: 300, duration: 'One week', popular: true },
          { amount: 400, duration: '2 weeks', popular: false },
          { amount: 700, duration: '1 month', popular: false }
        ].map((option, index) => (
          <div key={index} style={{
            backgroundColor: option.popular ? '#fef3c7' : 'white',
            border: option.popular ? '2px solid #f59e0b' : '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '16px',
            textAlign: 'center',
            position: 'relative'
          }}>
            {option.popular && (
              <div style={{
                position: 'absolute',
                top: '-8px',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: '#f59e0b',
                color: 'white',
                padding: '2px 8px',
                borderRadius: '4px',
                fontSize: '10px',
                fontWeight: '600'
              }}>
                POPULAR
              </div>
            )}
            <div style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#111827',
              marginBottom: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px'
            }}>
              KES {option.amount}
              <button
                onClick={() => {
                  navigator.clipboard.writeText(option.amount.toString());
                  const btn = event.target;
                  const originalText = btn.textContent;
                  btn.textContent = '✓';
                  btn.style.color = '#059669';
                  setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.color = '#6b7280';
                  }, 1000);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#6b7280',
                  cursor: 'pointer',
                  fontSize: '12px',
                  padding: '2px'
                }}
              >
                📋
              </button>
            </div>
            <div style={{
              fontSize: '14px',
              color: '#6b7280',
              fontWeight: '500'
            }}>
              {option.duration} access
            </div>
          </div>
        ))}
      </div>

      {/* M-Pesa Express Option */}
      <div style={{
        backgroundColor: '#f0fdf4',
        border: '1px solid #bbf7d0',
        borderRadius: '8px',
        padding: '16px',
        textAlign: 'center'
      }}>
        <p style={{
          color: '#374151',
          fontSize: '14px',
          marginBottom: '12px'
        }}>
          Don't like Paybill? 
        </p>
        <button
          onClick={onPayWithMpesaExpress}
          style={{
            background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
            color: 'white',
            border: 'none',
            padding: '14px 28px',
            borderRadius: '12px',
            fontWeight: '700',
            fontSize: '16px',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 8px 20px rgba(5, 150, 105, 0.3)',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px) scale(1.02)';
            e.target.style.boxShadow = '0 12px 30px rgba(5, 150, 105, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0) scale(1)';
            e.target.style.boxShadow = '0 8px 20px rgba(5, 150, 105, 0.3)';
          }}
        >
          Pay with 👉 M-Pesa Express
        </button>
      </div>
    </div>
  );
}
