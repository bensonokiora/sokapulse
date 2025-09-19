'use client';

import Link from 'next/link';
import { useContext } from 'react';
import { ThemeContext } from '@/context/ThemeContext';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export const metadata = {
  title: 'Coming Soon - SokaPulse',
  description: 'New features and predictions coming soon to SokaPulse. Stay tuned for enhanced football predictions and betting tips.',
  robots: {
    index: false,
    follow: false,
    noarchive: true
  }
};

export default function ComingSoon() {
  const { theme } = useContext(ThemeContext);
  
  return (
    <div className="container text-center py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="dotlottie-container" style={{ width: '250px', height: '250px', margin: '0 auto' }}>
            <DotLottieReact
              src="https://lottie.host/b9a22e3c-d6f9-4c7d-a9d3-e9b89c8a0b9a/sPNcmzBLYA.lottie"
              loop
              autoplay
            />
          </div>
          
          <h1 className="mt-4 mb-3 fw-bold" style={{ fontSize: '2.5rem' }}>Coming Soon</h1>
          
          <p className="mb-4" style={{ fontSize: '1.1rem' }}>
            We're working hard to bring you this exciting new feature.
            <br />
            Stay tuned for updates!
          </p>
          
          <div className="d-flex flex-column flex-md-row justify-content-center gap-3 mt-4">
            <Link href="/" className="btn btn-danger px-4 py-2">
              <i className="bi bi-house-door me-2"></i>
              Return Home
            </Link>
            
            <Link href="/today-football-predictions" className="btn btn-outline-danger px-4 py-2">
              <i className="bi bi-calendar-check me-2"></i>
              Today's Predictions
            </Link>
          </div>
          
          <div className="mt-5">
            <h5 className="mb-3">Subscribe for updates:</h5>
            <div className="row justify-content-center">
              <div className="col-md-8">
                <div className="input-group mb-3">
                  <input type="email" className="form-control" placeholder="Your email address" aria-label="Email address" />
                  <button className="btn btn-danger" type="button">
                    <i className="bi bi-bell me-2"></i>
                    Notify Me
                  </button>
                </div>
              </div>
            </div>
            
            <div className="mt-4">
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
    </div>
  );
}