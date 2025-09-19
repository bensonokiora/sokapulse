import { Suspense } from 'react';
import { fetchMoreAllJp } from '@/utils/api';
import mozzartGrandJackpotContent from '@/data/seo/pages/mozzart-grand-jackpot-predictions';
import MozzartGrandJackpotDisplay from '@/components/MozzartGrandJackpotDisplay';
import { Metadata } from 'next';

export async function generateMetadata() {
  return {
    title: mozzartGrandJackpotContent.title,
    description: mozzartGrandJackpotContent.description,
    keywords: mozzartGrandJackpotContent.keywords,
    other: {
      'script[type="application/ld+json"]': JSON.stringify(mozzartGrandJackpotContent.schema),
    }
  };
}

export default async function MozzartGrandJackpotPredictionPage() {
  let initialPredictions = [];
  let firstMatchDateISO = null;
  let error = null;

  // Parameters for 1xBet Jackpot (bookmakerId=20, type=15, total=17)
  const bookmakerId = 2;
  const typeId = 20;
  const totalMatches = 20;

  try {
    console.log(`Fetching 1xBet Jackpot (ID: ${bookmakerId}) predictions server-side...`);
    const response = await fetchMoreAllJp(bookmakerId, typeId, totalMatches);

    if (!response.error && response.body && Array.isArray(response.body)) {
      initialPredictions = response.body;
      
      if (initialPredictions.length > 0) {
        const sortedMatches = [...initialPredictions].sort((a, b) => {
          const dateA = new Date(`${a.date}T${a.time || '00:00:00'}`);
          const dateB = new Date(`${b.date}T${b.time || '00:00:00'}`);
          if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
            console.warn(`Invalid date found for mega match comparison: A=${a.date}T${a.time}, B=${b.date}T${b.time}`);
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
      console.error('API error fetching mega jackpot predictions (server-side):', response.message);
      error = response.message || 'Failed to load mega jackpot predictions';
    }
  } catch (err) {
    console.error('Error fetching mega jackpot predictions (server-side):', err);
    error = err instanceof Error ? err.message : 'Failed to fetch mega jackpot predictions due to an unknown error';
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
          <p className="jp-loading-text text-lg">Loading Jackpot Details...</p>
        </div>
      }>
        <MozzartGrandJackpotDisplay 
          initialPredictions={initialPredictions} 
          firstMatchDateISO={firstMatchDateISO} 
          serverError={error}
          seoContent={mozzartGrandJackpotContent}
          bookmakerId={bookmakerId}
        />
      </Suspense>
    </div>
  );
}