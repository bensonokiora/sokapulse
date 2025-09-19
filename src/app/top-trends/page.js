import { Suspense } from 'react';
import { fetchTeamStatsByFixture } from '@/utils/api';
import TopTrendsDisplay from '@/components/TopTrendsDisplay';
import LoadingAnimation from '@/components/LoadingAnimation';

// Helper to get the current date in YYYY-MM-DD format
const getCurrentDate = () => {
  return new Date().toISOString().split('T')[0];
};

// Convert TopTrends to an async server component
export default async function TopTrendsPage() {
  const currentDate = getCurrentDate();
  let initialTrendsData = [];
  let error = null;

  try {
    console.log('Fetching trends server-side for date:', currentDate);
    const data = await fetchTeamStatsByFixture(currentDate);
    if (data.status === true && Array.isArray(data.data)) {
      initialTrendsData = data.data;
    } else {
      console.error('API error fetching trends (server-side):', data.message);
      error = data.message || 'Failed to load trends data';
    }
  } catch (err) {
    console.error('Error fetching trends (server-side):', err);
    error = 'Error loading trends data';
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4">
        <h1 className="text-center text-2xl font-bold my-4">Top Football Trends</h1>
        
        <Suspense fallback={
          <div className="flex justify-center items-center h-64">
            <LoadingAnimation text="Loading trends..." />
          </div>
        }>
          <TopTrendsDisplay initialTrendsData={initialTrendsData} error={error} />
        </Suspense>
      </div>
    </div>
  );
}
