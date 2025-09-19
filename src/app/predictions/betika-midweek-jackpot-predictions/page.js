import { Suspense } from 'react';
import { fetchMoreAllJp } from '@/utils/api';
import betikaMidweekJackpotContent from '@/data/seo/pages/betika-midweek-jackpot-predictions';
import BetikaMidweekJackpotDisplay from '@/components/BetikaMidweekJackpotDisplay';
import { Metadata } from 'next';

// Generate metadata server-side
export async function generateMetadata() {
  return {
    title: betikaMidweekJackpotContent.title,
    description: betikaMidweekJackpotContent.description,
    keywords: betikaMidweekJackpotContent.keywords,
    other: {
      'script[type="application/ld+json"]': JSON.stringify(betikaMidweekJackpotContent.schema),
    }
  };
}

// Async server component for the page
export default async function BetikaMidweekJackpotPredictionPage() {
  let initialPredictions = [];
  let firstMatchDateISO = null;
  let error = null;

  // Parameters for Betika Midweek Jackpot (bookmakerId=6, type=5, total=15)
  const bookmakerId = 6;
  const typeId = 5;
  const totalMatches = 15;

  try {
    console.log(`Fetching Betika Midweek Jackpot (ID: ${bookmakerId}) predictions server-side...`);
    const response = await fetchMoreAllJp(bookmakerId, typeId, totalMatches); 

    if (!response.error && response.body && Array.isArray(response.body)) {
      initialPredictions = response.body;
      
      if (initialPredictions.length > 0) {
        const sortedMatches = [...initialPredictions].sort((a, b) => {
          const dateA = new Date(`${a.date}T${a.time || '00:00:00'}`);
          const dateB = new Date(`${b.date}T${b.time || '00:00:00'}`);
          if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
            console.warn(`Invalid date found for Betika midweek match comparison: A=${a.date}T${a.time}, B=${b.date}T${b.time}`);
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
      console.error('API error fetching Betika midweek jackpot predictions (server-side):', response.message);
      error = response.message || 'Failed to load Betika midweek jackpot predictions';
    }
  } catch (err) {
    console.error('Error fetching Betika midweek jackpot predictions (server-side):', err);
    error = err instanceof Error ? err.message : 'Failed to fetch Betika midweek jackpot predictions due to an unknown error';
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
          <p className="jp-loading-text text-lg">Loading Betika Midweek Jackpot Details...</p>
        </div>
      }>
        <BetikaMidweekJackpotDisplay 
          initialPredictions={initialPredictions} 
          firstMatchDateISO={firstMatchDateISO} 
          serverError={error}
          seoContent={betikaMidweekJackpotContent}
          bookmakerId={bookmakerId}
        />
      </Suspense>
    </div>
  );
} 