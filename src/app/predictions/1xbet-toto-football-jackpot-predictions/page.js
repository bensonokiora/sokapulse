import { Suspense } from 'react';
import { fetchMoreAllJp } from '@/utils/api';
import oneXBetTotoFootballJackpotContent from '@/data/seo/pages/1xbet-toto-football-jackpot-predictions';
import OneXBetTotoFootballJackpotDisplay from '@/components/OneXBetTotoFootballJackpotDisplay';
import { Metadata } from 'next';

export async function generateMetadata() {
  return {
    title: oneXBetTotoFootballJackpotContent.title,
    description: oneXBetTotoFootballJackpotContent.description,
    keywords: oneXBetTotoFootballJackpotContent.keywords,
    other: {
      'script[type="application/ld+json"]': JSON.stringify(oneXBetTotoFootballJackpotContent.schema),
    }
  };
}

export default async function OneXBetTotoFootballJackpotPredictionPage() {
  let initialPredictions = [];
  let firstMatchDateISO = null;
  let error = null;

  // Parameters for 1xBet Toto Football Jackpot (bookmakerId=26, maxDoublesCount=14, fixturesCount=14)
  const bookmakerId = 26;
  const maxDoublesCount = 14;
  const totalMatches = 14;

  try {
    console.log(`Fetching 1xBet Toto Football Jackpot (ID: ${bookmakerId}) predictions server-side...`);
    const response = await fetchMoreAllJp(bookmakerId, maxDoublesCount, totalMatches);

    if (!response.error && response.body && Array.isArray(response.body)) {
      initialPredictions = response.body;
      
      if (initialPredictions.length > 0) {
        const sortedMatches = [...initialPredictions].sort((a, b) => {
          const dateA = new Date(`${a.date}T${a.time || '00:00:00'}`);
          const dateB = new Date(`${b.date}T${b.time || '00:00:00'}`);
          if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
            console.warn(`Invalid date found for 1xBet Toto match comparison: A=${a.date}T${a.time}, B=${b.date}T${b.time}`);
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
      console.error('API error fetching 1xBet Toto Football jackpot predictions (server-side):', response.message);
      error = response.message || 'Failed to load 1xBet Toto Football jackpot predictions';
    }
  } catch (err) {
    console.error('Error fetching 1xBet Toto Football jackpot predictions (server-side):', err);
    error = err instanceof Error ? err.message : 'Failed to fetch 1xBet Toto Football jackpot predictions due to an unknown error';
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
          <p className="jp-loading-text text-lg">Loading 1xBet Toto Football Jackpot Details...</p>
        </div>
      }>
        <OneXBetTotoFootballJackpotDisplay 
          initialPredictions={initialPredictions} 
          firstMatchDateISO={firstMatchDateISO} 
          serverError={error}
          seoContent={oneXBetTotoFootballJackpotContent}
          bookmakerId={bookmakerId}
        />
      </Suspense>
    </div>
  );
} 