'use client';

import Link from 'next/link';
import { ThemeProvider } from '@/context/ThemeContext';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export const metadata = {
  title: 'Application Error - SokaPulse',
  description: 'A critical error occurred in the application. Please try again or contact support if the problem persists.',
  robots: {
    index: false,
    follow: true
  }
};

export default function GlobalError({ error, reset }) {
  return (
    <html lang="en">
      <head>
        <title>Error - sokapulse</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
      </head>
      <body suppressHydrationWarning>
        <ThemeProvider>
          <div className="container py-5">
            <div className="row justify-content-center">
              <div className="col-md-8 text-center">
                <div style={{ width: '250px', height: '250px', margin: '0 auto' }}>
                  <DotLottieReact
                    src="https://lottie.host/0e42bde9-7d7c-4d4c-8ba4-39d2d240e930/qvkfvCUfJx.lottie"
                    loop
                    autoplay
                  />
                </div>
                
                <h1 className="mt-4 mb-3 fw-bold" style={{ fontSize: '2.5rem' }}>Critical Error</h1>
                
                <p className="mb-4" style={{ fontSize: '1.1rem' }}>
                  {error.message || "We're experiencing a critical issue with the application. Our team has been notified."}
                </p>
                
                <div className="d-flex flex-column flex-md-row justify-content-center gap-3 mt-4">
                  <button 
                    onClick={() => reset()}
                    className="btn btn-danger px-4 py-2"
                  >
                    <i className="bi bi-arrow-clockwise me-2"></i>
                    Try Again
                  </button>
                  
                  <Link href="/" className="btn btn-outline-danger px-4 py-2">
                    <i className="bi bi-house-door me-2"></i>
                    Return Home
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}