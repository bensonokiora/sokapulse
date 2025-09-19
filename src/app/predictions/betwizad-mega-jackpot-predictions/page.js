import { Suspense } from 'react';
import { fetchMoreAllJp } from '@/utils/api';
import betwizadMegaJackpotContent from '@/data/seo/pages/betwizad-mega-jackpot-predictions';
import BetwizadJackpotDisplay from '@/components/BetwizadJackpotDisplay';

export async function generateMetadata() {
  return {
    title: betwizadMegaJackpotContent.title,
    description: betwizadMegaJackpotContent.description,
    keywords: betwizadMegaJackpotContent.keywords,
    other: {
      'script[type="application/ld+json"]': JSON.stringify(betwizadMegaJackpotContent.schema),
    }
  };
}

export default async function BetwizadMegaJackpotPredictionPage() {
  let initialPredictions = [];
  let firstMatchDateISO = null;
  let error = null;

  const bookmakerId = 1;
  const typeId = 10;
  const totalMatches = 17;

  try {
    console.log(`Fetching Betwizad Mega Jackpot predictions server-side...`);
    const response = await fetchMoreAllJp(bookmakerId, typeId, totalMatches);

    if (!response.error && response.body && Array.isArray(response.body)) {
      initialPredictions = response.body;

      if (initialPredictions.length > 0) {
        const sortedMatches = [...initialPredictions].sort((a, b) => {
          const dateA = new Date(`${a.date}T${a.time || '00:00:00'}`);
          const dateB = new Date(`${b.date}T${b.time || '00:00:00'}`);
          if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
            console.warn(`Invalid date found for match comparison: A=${a.date}T${a.time}, B=${b.date}T${b.time}`);
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
      console.error('API error fetching Betwizad mega jackpot predictions (server-side):', response.message);
      error = response.message || 'Failed to load Betwizad mega jackpot predictions';
    }
  } catch (err) {
    console.error('Error fetching Betwizad mega jackpot predictions (server-side):', err);
    error = err instanceof Error ? err.message : 'Failed to fetch Betwizad mega jackpot predictions due to an unknown error';
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
          <p className="jp-loading-text text-lg">Loading Betwizad Mega Jackpot...</p>
        </div>
      }>
        <BetwizadJackpotDisplay 
          initialPredictions={initialPredictions} 
          firstMatchDateISO={firstMatchDateISO} 
          serverError={error}
          seoContent={betwizadMegaJackpotContent}
          bookmakerId={bookmakerId}
        />
      </Suspense>
    </div>
  );
} 