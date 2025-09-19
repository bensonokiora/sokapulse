import { Suspense } from 'react';
import { fetchUpcomingFixtures } from '@/utils/api';
import '../../../styles/custom.css';
import UpcomingDoubleChancePredictionsClient from '@/components/UpcomingDoubleChancePredictionsClient';
import SeoContent from '@/components/SeoContent';
import LoadingAnimation from '@/components/LoadingAnimation';

// Helper to format date consistently (can be moved to a shared utils if not already)
const formatDate = (date) => {
  if (!date) {
    date = new Date(); 
  }
  if (typeof date === 'string' && date.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return date;
  }
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Fallback
  }
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default async function DoubleChancePredictionsPage({ searchParams }) {
  const selectedDateParam = searchParams?.date;
  let dateForFixtures;

  if (selectedDateParam) {
    if (selectedDateParam.match(/^\d{4}-\d{2}-\d{2}$/)) {
        const [year, month, day] = selectedDateParam.split('-').map(Number);
        const parsedDate = new Date(year, month - 1, day);
        if (parsedDate.getFullYear() === year && parsedDate.getMonth() === month - 1 && parsedDate.getDate() === day) {
            dateForFixtures = parsedDate;
        } else {
            dateForFixtures = new Date();
            dateForFixtures.setDate(dateForFixtures.getDate() + 1); // tomorrow
        }
    } else {
      dateForFixtures = new Date();
      dateForFixtures.setDate(dateForFixtures.getDate() + 1); // tomorrow
    }
  } else {
    dateForFixtures = new Date();
    dateForFixtures.setDate(dateForFixtures.getDate() + 1); // tomorrow
  }

  const initialSelectedDate = formatDate(dateForFixtures);

  let initialFixtures = [];
  let initialError = null;
  let initialHasMore = false;
  let initialNextCursor = null;

  try {
    console.log('SSR Fetching initial double chance upcoming fixtures for date:', initialSelectedDate);
    const response = await fetchUpcomingFixtures(initialSelectedDate, 20, '1'); // per_page=20, next_cursor='1'

    if (response.status === true && Array.isArray(response.data)) {
      initialFixtures = response.data;
      initialNextCursor = response.nextCursor;
      initialHasMore = !!response.nextCursor;
      console.log("SSR Double Chance Fetch successful:", {
          initialBatchSize: initialFixtures.length,
          hasMore: initialHasMore,
          nextCursor: initialNextCursor
      });
    } else {
      console.error('SSR API error (double chance):', response.message);
      initialError = response.message || 'Failed to load fixtures on server';
    }
  } catch (err) {
    console.error('SSR Fetch error (double chance):', err);
    initialError = 'Error loading fixtures on server';
  }

  return (
    <div className="container container-mob">
      <Suspense fallback={<div className="flex justify-center items-center w-full h-64"><LoadingAnimation text="Loading page..." /></div>}>
        <div className="row" style={{ marginLeft: '0px', height: 'auto !important' }}>
          <div className="col-lg-12">
            <div className="responsive-row" style={{ textAlign: 'center', backgroundColor: 'rgb(211, 211, 211)', marginLeft: '1px', borderRadius: '5px', cursor: 'auto' }}>
              <div className="table-cell">
                <h1 style={{ fontSize: '18px', fontWeight: 'bold' }}>Free Football Double Chance Predictions</h1>
              </div>
            </div>

            {/* Client-side interactive content */}
            <UpcomingDoubleChancePredictionsClient 
              initialFixtures={initialFixtures}
              initialSelectedDate={initialSelectedDate}
              initialHasMore={initialHasMore}
              initialNextCursor={initialNextCursor}
              initialError={initialError}
            />
            
            {/* SEO Content */}
            <SeoContent pageType="upcoming-double-chance" siteName="SokaPulse" />
          </div>
        </div>
      </Suspense>
    </div>
  );
}
