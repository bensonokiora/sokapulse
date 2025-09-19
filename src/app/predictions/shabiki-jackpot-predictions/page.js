import { Suspense } from 'react';
import { fetchMoreAllJp } from '@/utils/api';
import shabikiJackpotContent from '@/data/seo/pages/shabiki-jackpot-predictions';
import ShabikiJackpotDisplay from '@/components/ShabikiJackpotDisplay';
import { Metadata } from 'next';

export async function generateMetadata() {
  return {
    title: shabikiJackpotContent.title,
    description: shabikiJackpotContent.description,
    keywords: shabikiJackpotContent.keywords,
    other: {
      'script[type="application/ld+json"]': JSON.stringify(shabikiJackpotContent.schema),
    }
  };
}

export default async function ShabikiJackpotPredictionPage() {
  let initialPredictions = [];
  let firstMatchDateISO = null;
  let error = null;

  // Parameters for Shabiki Jackpot (bookmakerId=17, maxDoublesCount=15, fixturesCount=15)
  const bookmakerId = 17;
  const maxDoublesCount = 15;
  const totalMatches = 15;

  try {
    console.log(`Fetching Shabiki Jackpot (ID: ${bookmakerId}) predictions server-side...`);
    const response = await fetchMoreAllJp(bookmakerId, maxDoublesCount, totalMatches);

    if (!response.error && response.body && Array.isArray(response.body)) {
      initialPredictions = response.body;
      
      if (initialPredictions.length > 0) {
        const sortedMatches = [...initialPredictions].sort((a, b) => {
          const dateA = new Date(`${a.date}T${a.time || '00:00:00'}`);
          const dateB = new Date(`${b.date}T${b.time || '00:00:00'}`);
          if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
            console.warn(`Invalid date found for shabiki match comparison: A=${a.date}T${a.time}, B=${b.date}T${b.time}`);
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
      console.error('API error fetching Shabiki jackpot predictions (server-side):', response.message);
      error = response.message || 'Failed to load Shabiki jackpot predictions';
    }
  } catch (err) {
    console.error('Error fetching Shabiki jackpot predictions (server-side):', err);
    error = err instanceof Error ? err.message : 'Failed to fetch Shabiki jackpot predictions due to an unknown error';
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
          <p className="jp-loading-text text-lg">Loading Shabiki Jackpot Details...</p>
        </div>
      }>
        <ShabikiJackpotDisplay 
          initialPredictions={initialPredictions} 
          firstMatchDateISO={firstMatchDateISO} 
          serverError={error}
          seoContent={shabikiJackpotContent}
          bookmakerId={bookmakerId}
        />
      </Suspense>
    </div>
  );
} 