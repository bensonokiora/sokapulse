'use client';

import Link from 'next/link';
import { useContext } from 'react';
import { ThemeContext } from '@/context/ThemeContext';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export const metadata = {
  title: 'Site Maintenance - SokaPulse',
  description: 'SokaPulse is currently undergoing maintenance to improve our football predictions service. We\'ll be back soon!',
  robots: {
    index: false,
    follow: false,
    noarchive: true
  }
};

export default function Maintenance() {
  const { theme } = useContext(ThemeContext);
  
  return (
    <div className="container text-center py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="dotlottie-container" style={{ width: '250px', height: '250px', margin: '0 auto' }}>
            <DotLottieReact
              src="https://lottie.host/c2a1a7c8-a6c9-4a17-9f4f-4139d83fd50c/HbMZPdYUJD.lottie"
              loop
              autoplay
            />
          </div>
          
          <h1 className="mt-4 mb-3 fw-bold" style={{ fontSize: '2.5rem' }}>We're Currently Under Maintenance</h1>
          
          <p className="mb-4" style={{ fontSize: '1.1rem' }}>
            We're working to improve our service and will be back shortly. Thank you for your patience!
          </p>
          
          <p className="text-muted">
            Expected completion time: 30 minutes
          </p>
          
          <div className="d-flex flex-column flex-md-row justify-content-center gap-3 mt-4">
            <button 
              onClick={() => window.location.reload()}
              className="btn btn-danger px-4 py-2"
            >
              <i className="bi bi-arrow-clockwise me-2"></i>
              Refresh Page
            </button>
          </div>
          
          <div className="mt-5">
            <h5 className="mb-3">Follow us for updates:</h5>
            <div className="d-flex justify-content-center gap-3">
              <a href="https://www.facebook.com/sokapulse.fb" target="_blank" className="btn btn-outline-light btn-floating m-1">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="https://twitter.com/_sokapulse" target="_blank" className="btn btn-outline-light btn-floating m-1">
                <i className="bi bi-twitter"></i>
              </a>
              <a href="https://www.instagram.com/_sokapulse" target="_blank" className="btn btn-outline-light btn-floating m-1">
                <i className="bi bi-instagram"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}