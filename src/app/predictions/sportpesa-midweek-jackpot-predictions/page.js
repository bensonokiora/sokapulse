import { Suspense } from 'react';
import { fetchMoreAllJp } from '@/utils/api';
import sportpesaMidweekJackpotContent from '@/data/seo/pages/sportpesa-midweek-jackpot-predictions';
import SportpesaMidweekJackpotDisplay from '@/components/SportpesaMidweekJackpotDisplay';
import { Metadata } from 'next';

// Generate metadata server-side
export async function generateMetadata() {
  return {
    title: sportpesaMidweekJackpotContent.title,
    description: sportpesaMidweekJackpotContent.description,
    keywords: sportpesaMidweekJackpotContent.keywords,
    other: {
      'script[type="application/ld+json"]': JSON.stringify(sportpesaMidweekJackpotContent.schema),
    }
  };
}

// Async server component for the page
export default async function SportpesaMidweekJackpotPredictionPage() {
  let initialPredictions = [];
  let firstMatchDateISO = null;
  let error = null;

  // Correct parameters for Midweek Jackpot (assuming bookmakerId=5, type=7, total=13)
  const bookmakerId = 5;
  const typeId = 7;
  const totalMatches = 13;

  try {
    console.log(`Fetching Sportpesa Midweek Jackpot (ID: ${bookmakerId}) predictions server-side...`);
    const response = await fetchMoreAllJp(bookmakerId, typeId, totalMatches); 

    if (!response.error && response.body && Array.isArray(response.body)) {
      initialPredictions = response.body;
      
      if (initialPredictions.length > 0) {
        const sortedMatches = [...initialPredictions].sort((a, b) => {
          const dateA = new Date(`${a.date}T${a.time || '00:00:00'}`);
          const dateB = new Date(`${b.date}T${b.time || '00:00:00'}`);
          if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
            console.warn(`Invalid date found for midweek match comparison: A=${a.date}T${a.time}, B=${b.date}T${b.time}`);
            return 0; 
          }
          return dateA.getTime() - dateB.getTime();
        });
        
        const earliestMatch = sortedMatches[0];
        const matchDateTime = new Date(`${earliestMatch.date}T${earliestMatch.time || '00:00:00'}`);
        if (!isNaN(matchDateTime.getTime())) {
          firstMatchDateISO = matchDateTime.toISOString();
        }
      }
    } else {
      console.error('API error fetching midweek jackpot predictions (server-side):', response.message);
      error = response.message || 'Failed to load midweek jackpot predictions';
    }
  } catch (err) {
    console.error('Error fetching midweek jackpot predictions (server-side):', err);
    error = err instanceof Error ? err.message : 'Failed to fetch midweek jackpot predictions due to an unknown error';
    initialPredictions = [];
  }

  if (error && (!initialPredictions || initialPredictions.length === 0)) {
    return (
      <div className="jp-container p-4">
        <div className="jp-error-message text-red-500 text-center">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="jp-container">
      <Suspense fallback={
        <div className="jp-loading-container flex justify-center items-center h-64">
          <p className="jp-loading-text text-lg">Loading Midweek Jackpot Details...</p>
        </div>
      }>
        <SportpesaMidweekJackpotDisplay 
          initialPredictions={initialPredictions} 
          firstMatchDateISO={firstMatchDateISO} 
          serverError={error}
          seoContent={sportpesaMidweekJackpotContent}
          bookmakerId={bookmakerId}
        />
      </Suspense>
    </div>
  );
} 