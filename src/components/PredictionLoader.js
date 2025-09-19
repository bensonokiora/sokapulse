import { Suspense } from 'react';
import { fetchFixturesByDatePaginated } from '@/utils/api';
import PredictionFixturesDisplay from '@/components/PredictionPage'; // Assuming PredictionPage.js exports PredictionFixturesDisplay
import LoadingAnimation from '@/components/LoadingAnimation';

// Helper function (can be defined here or imported)
const formatDate = (date) => {
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// This is an async Server Component
export default async function PredictionLoader({ 
  pageTitle,
  metaDescription,
  date, // Expecting date in 'YYYY-MM-DD' format or a Date object
  pageType, // pageType can still be used for conditional rendering if needed
  siteName
}) {
  const perPage = 20; // Define items per page
  const formattedDate = formatDate(date || new Date()); // Ensure date is formatted correctly
  let initialFixtures = [];
  let initialError = null;
  let initialNextCursor = null;

  try {
    // Fetch initial set of fixtures using the paginated API
    const apiResponse = await fetchFixturesByDatePaginated(formattedDate, perPage, '1');

    if (apiResponse.status === true && Array.isArray(apiResponse.fixtures)) {
      initialFixtures = apiResponse.fixtures;
      initialNextCursor = apiResponse.nextCursor;
    } else {
      console.error('PredictionLoader API Error:', apiResponse.message);
      initialError = apiResponse.message || 'Failed to load initial fixtures.';
    }
  } catch (error) {
    console.error('PredictionLoader Fetch Error:', error);
    initialError = 'An error occurred while loading fixtures.';
  }

  return (
    <Suspense fallback={<LoadingAnimation text="Loading predictions..." />}>
      <PredictionFixturesDisplay
        initialFixtures={initialFixtures}
        initialError={initialError}
        initialNextCursor={initialNextCursor}
        perPage={perPage}
        initialDate={formattedDate} // Pass the date used for fetching
        pageTitle={pageTitle} 
        metaDescription={metaDescription}
        pageType={pageType}
        siteName={siteName}
      />
    </Suspense>
  );
} 