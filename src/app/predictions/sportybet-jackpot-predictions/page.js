import { Suspense } from 'react';
import { fetchMoreAllJp } from '@/utils/api';
import sportybetJackpotContent from '@/data/seo/pages/sportybet-jackpot-predictions';
import SportybetJackpotDisplay from '@/components/SportybetJackpotDisplay';
import { Metadata } from 'next';

export async function generateMetadata() {
  return {
    title: sportybetJackpotContent.title,
    description: sportybetJackpotContent.description,
    keywords: sportybetJackpotContent.keywords,
    other: {
      'script[type="application/ld+json"]': JSON.stringify(sportybetJackpotContent.schema),
    }
  };
}

export default async function SportybetJackpotPredictionPage() {
  let initialPredictions = [];
  let firstMatchDateISO = null;
  let error = null;

  // Parameters for Sportybet Jackpot (bookmakerId=4, maxDoublesCount=12, fixturesCount=12)
  const bookmakerId = 4;
  const maxDoublesCount = 12;
  const totalMatches = 12;

  try {
    console.log(`Fetching Sportybet Jackpot (ID: ${bookmakerId}) predictions server-side...`);
    const response = await fetchMoreAllJp(bookmakerId, maxDoublesCount, totalMatches);

    if (!response.error && response.body && Array.isArray(response.body)) {
      initialPredictions = response.body;
      
      if (initialPredictions.length > 0) {
        const sortedMatches = [...initialPredictions].sort((a, b) => {
          const dateA = new Date(`${a.date}T${a.time || '00:00:00'}`);
          const dateB = new Date(`${b.date}T${b.time || '00:00:00'}`);
          if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
            console.warn(`Invalid date found for sportybet match comparison: A=${a.date}T${a.time}, B=${b.date}T${b.time}`);
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
      console.error('API error fetching Sportybet jackpot predictions (server-side):', response.message);
      error = response.message || 'Failed to load Sportybet jackpot predictions';
    }
  } catch (err) {
    console.error('Error fetching Sportybet jackpot predictions (server-side):', err);
    error = err instanceof Error ? err.message : 'Failed to fetch Sportybet jackpot predictions due to an unknown error';
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
          <p className="jp-loading-text text-lg">Loading Sportybet Jackpot Details...</p>
        </div>
      }>
        <SportybetJackpotDisplay 
          initialPredictions={initialPredictions} 
          firstMatchDateISO={firstMatchDateISO} 
          serverError={error}
          seoContent={sportybetJackpotContent}
          bookmakerId={bookmakerId}
        />
      </Suspense>
    </div>
  );
} 