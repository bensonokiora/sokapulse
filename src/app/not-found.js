import Link from 'next/link';
import { headers } from 'next/headers';
import NotFoundAnimation from '@/components/NotFoundAnimation';

// Set metadata with status code
export async function generateMetadata() {
  // This ensures the page returns a 404 HTTP status code for search engines
  return {
    title: 'Page Not Found - 404 Error | SokaPulse',
    description: 'The page you are looking for could not be found. Please check the URL or return to our homepage for football predictions and betting tips.',
    robots: {
      index: false,
      follow: true
    },
    // This is the key part that sets the HTTP status code
    status: 404,
  };
}

export default function NotFound() {
  // Force server to set 404 status
  const headersList = headers();
  
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 text-center">
          <NotFoundAnimation />
          
          <h1 className="mt-4 mb-3 fw-bold" style={{ fontSize: '2.5rem' }}>404 - Page Not Found</h1>
          
          <p className="mb-4" style={{ fontSize: '1.1rem' }}>
            Oops! The page you're looking for doesn't exist or has been moved.
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
            <h5 className="mb-3">You might be interested in:</h5>
            <div className="d-flex flex-wrap justify-content-center gap-2">
              <Link href="/today-football-predictions" className="btn btn-sm btn-outline-secondary m-1">
                Today's Matches
              </Link>
              <Link href="/tomorrow-football-predictions" className="btn btn-sm btn-outline-secondary m-1">
                Tomorrow's Matches
              </Link>
              <Link href="/weekend-football-predictions" className="btn btn-sm btn-outline-secondary m-1">
                Weekend Matches
              </Link>
              <Link href="/top-football-predictions" className="btn btn-sm btn-outline-secondary m-1">
                Top Predictions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}