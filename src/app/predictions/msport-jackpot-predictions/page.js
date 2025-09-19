import { Suspense } from 'react';
import { fetchMoreAllJp } from '@/utils/api';
import msportJackpotContent from '@/data/seo/pages/msport-jackpot-predictions';
import MSportJackpotDisplay from '@/components/MSportJackpotDisplay';
import { Metadata } from 'next';

export async function generateMetadata() {
  return {
    title: msportJackpotContent.title,
    description: msportJackpotContent.description,
    keywords: msportJackpotContent.keywords,
    other: {
      'script[type="application/ld+json"]': JSON.stringify(msportJackpotContent.schema),
    }
  };
}

export default async function MSportJackpotPredictionPage() {
  let initialPredictions = [];
  let firstMatchDateISO = null;
  let error = null;

  // Parameters for MSport Jackpot (bookmakerId=35, maxDoublesCount=11, fixturesCount=11)
  const bookmakerId = 35;
  const maxDoublesCount = 11;
  const totalMatches = 11;

  try {
    console.log(`Fetching MSport Jackpot (ID: ${bookmakerId}) predictions server-side...`);
    const response = await fetchMoreAllJp(bookmakerId, maxDoublesCount, totalMatches);

    if (!response.error && response.body && Array.isArray(response.body)) {
      initialPredictions = response.body;
      
      if (initialPredictions.length > 0) {
        const sortedMatches = [...initialPredictions].sort((a, b) => {
          const dateA = new Date(`${a.date}T${a.time || '00:00:00'}`);
          const dateB = new Date(`${b.date}T${b.time || '00:00:00'}`);
          if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
            console.warn(`Invalid date found for MSport match comparison: A=${a.date}T${a.time}, B=${b.date}T${b.time}`);
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
      console.error('API error fetching MSport jackpot predictions (server-side):', response.message);
      error = response.message || 'Failed to load MSport jackpot predictions';
    }
  } catch (err) {
    console.error('Error fetching MSport jackpot predictions (server-side):', err);
    error = err instanceof Error ? err.message : 'Failed to fetch MSport jackpot predictions due to an unknown error';
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
          <p className="jp-loading-text text-lg">Loading MSport Jackpot Details...</p>
        </div>
      }>
        <MSportJackpotDisplay 
          initialPredictions={initialPredictions} 
          firstMatchDateISO={firstMatchDateISO} 
          serverError={error}
          seoContent={msportJackpotContent}
          bookmakerId={bookmakerId}
        />
      </Suspense>
    </div>
  );
} 