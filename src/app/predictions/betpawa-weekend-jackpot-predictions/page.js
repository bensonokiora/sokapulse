import { Suspense } from 'react';
import { fetchMoreAllJp } from '@/utils/api';
import betpawaWeekendJackpotContent from '@/data/seo/pages/betpawa-weekend-jackpot-predictions';
import BetpawaWeekendJackpotDisplay from '@/components/BetpawaWeekendJackpotDisplay';
import { Metadata } from 'next';

export async function generateMetadata() {
  return {
    title: betpawaWeekendJackpotContent.title,
    description: betpawaWeekendJackpotContent.description,
    keywords: betpawaWeekendJackpotContent.keywords,
    other: {
      'script[type="application/ld+json"]': JSON.stringify(betpawaWeekendJackpotContent.schema),
    }
  };
}

export default async function BetpawaWeekendJackpotPredictionPage() {
  let initialPredictions = [];
  let firstMatchDateISO = null;
  let error = null;

  // Parameters for Betpawa Weekend Jackpot (bookmakerId=3, maxDoublesCount=17, fixturesCount=17)
  const bookmakerId = 3;
  const maxDoublesCount = 17;
  const totalMatches = 17;

  try {
    console.log(`Fetching Betpawa Weekend Jackpot (ID: ${bookmakerId}) predictions server-side...`);
    const response = await fetchMoreAllJp(bookmakerId, maxDoublesCount, totalMatches);

    if (!response.error && response.body && Array.isArray(response.body)) {
      initialPredictions = response.body;
      
      if (initialPredictions.length > 0) {
        const sortedMatches = [...initialPredictions].sort((a, b) => {
          const dateA = new Date(`${a.date}T${a.time || '00:00:00'}`);
          const dateB = new Date(`${b.date}T${b.time || '00:00:00'}`);
          if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
            console.warn(`Invalid date found for betpawa weekend match comparison: A=${a.date}T${a.time}, B=${b.date}T${b.time}`);
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
      console.error('API error fetching Betpawa weekend jackpot predictions (server-side):', response.message);
      error = response.message || 'Failed to load Betpawa weekend jackpot predictions';
    }
  } catch (err) {
    console.error('Error fetching Betpawa weekend jackpot predictions (server-side):', err);
    error = err instanceof Error ? err.message : 'Failed to fetch Betpawa weekend jackpot predictions due to an unknown error';
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
          <p className="jp-loading-text text-lg">Loading Betpawa Weekend Jackpot Details...</p>
        </div>
      }>
        <BetpawaWeekendJackpotDisplay 
          initialPredictions={initialPredictions} 
          firstMatchDateISO={firstMatchDateISO} 
          serverError={error}
          seoContent={betpawaWeekendJackpotContent}
          bookmakerId={bookmakerId}
        />
      </Suspense>
    </div>
  );
} 