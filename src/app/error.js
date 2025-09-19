'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Unhandled error:', error);
  }, [error]);

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 text-center">
          <div className="alert alert-danger" role="alert">
            <h2 className="mt-4 mb-3 fw-bold">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              Something went wrong!
            </h2>
          </div>
          
          <p className="mb-4">
            We're sorry, but there was an error processing your request. Our team has been notified.
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
  );
}