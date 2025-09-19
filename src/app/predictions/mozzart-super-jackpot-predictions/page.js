import { Suspense } from 'react';
import { fetchMoreAllJp } from '@/utils/api';
import mozzartSuperJackpotContent from '@/data/seo/pages/mozzart-super-jackpot-predictions';
import MozzartSuperJackpotDisplay from '@/components/MozzartSuperJackpotDisplay';
import { Metadata } from 'next';

export async function generateMetadata() {
  return {
    title: mozzartSuperJackpotContent.title,
    description: mozzartSuperJackpotContent.description,
    keywords: mozzartSuperJackpotContent.keywords,
    other: {
      'script[type="application/ld+json"]': JSON.stringify(mozzartSuperJackpotContent.schema),
    }
  };
}

export default async function MozzartSuperJackpotPredictionPage() {
  let initialPredictions = [];
  let firstMatchDateISO = null;
  let error = null;

  // Parameters for Mozzart Super Jackpot (bookmakerId=10, type=16, total=17)
  const bookmakerId = 10;
  const typeId = 16;
  const totalMatches = 16;

  try {
    console.log(`Fetching Mozzart Super Jackpot (ID: ${bookmakerId}) predictions server-side...`);
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
      console.error('API error fetching super jackpot predictions (server-side):', response.message);
      error = response.message || 'Failed to load super jackpot predictions';
    }
  } catch (err) {
    console.error('Error fetching super jackpot predictions (server-side):', err);
    error = err instanceof Error ? err.message : 'Failed to fetch super jackpot predictions due to an unknown error';
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
          <p className="jp-loading-text text-lg">Loading Super Jackpot Details...</p>
        </div>
      }>
          <MozzartSuperJackpotDisplay 
          initialPredictions={initialPredictions} 
          firstMatchDateISO={firstMatchDateISO} 
          serverError={error}
          seoContent={mozzartSuperJackpotContent}
          bookmakerId={bookmakerId}
        />
      </Suspense>
    </div>
  );
}