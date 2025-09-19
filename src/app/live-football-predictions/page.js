import { Suspense } from 'react';
import { fetchLiveGames } from '@/utils/api';
import { formatDate } from '@/utils/formatDate';
import '../../styles/custom.css';
import SeoContent from '@/components/SeoContent';
import LiveFixturesList from '@/components/LiveFixturesList';
import NavigationRow from '@/components/NavigationRow';
import { Metadata } from 'next';

export async function generateMetadata() {
  return {
    title: "Live Football Predictions & Scores Today",
    description: "Get live football predictions, scores, and odds for matches happening right now. Stay updated with real-time football action and expert tips.",
  };
}

export default async function LiveFootballPredictionsPage() {
  let initialFixtures = [];
  let error = null;
  const today = formatDate();

  try {
    console.log("Fetching initial live games server-side...");
    const data = await fetchLiveGames(today);

    if (data.status === true && Array.isArray(data.data)) {
      initialFixtures = data.data;
    } else {
      console.error('SSR API error fetching live games:', data.message);
      error = data.message || 'Failed to load initial live fixtures';
    }
  } catch (err) {
    console.error('SSR Fetch error fetching live games:', err);
    error = err instanceof Error ? err.message : 'Error loading initial live fixtures';
    initialFixtures = [];
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <NavigationRow selectedDate={today} />
      
      <div className="responsive-row" style={{
        textAlign: 'center',
        backgroundColor: '#D3D3D3',
        marginLeft: '1px',
        borderRadius: '5px',
        cursor: 'auto',
        padding: '8px 0'
      }}>
        <div className="table-cell">
          <h1 style={{fontSize: '18px', fontWeight: 'bold'}}>Live Football Matches</h1>
        </div>
      </div>

      <Suspense fallback={
        <div className="flex justify-center items-center h-64">
          <p className="text-lg">Loading Live Matches...</p>
        </div>
      }>
        <LiveFixturesList 
          initialFixtures={initialFixtures} 
          initialError={error}
        />
      </Suspense>

      <SeoContent pageType="live" siteName="SokaPulse" />
    </div>
  );
}
