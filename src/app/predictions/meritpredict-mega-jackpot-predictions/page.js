import { Suspense } from 'react';
import { fetchMoreAllJp } from '@/utils/api';
import meritpredictMegaJackpotContent from '@/data/seo/pages/meritpredict-mega-jackpot-predictions';
import MeritpredictJackpotDisplay from '@/components/MeritpredictJackpotDisplay';

export async function generateMetadata() {
  return {
    title: meritpredictMegaJackpotContent.title,
    description: meritpredictMegaJackpotContent.description,
    keywords: meritpredictMegaJackpotContent.keywords,
    other: {
      'script[type="application/ld+json"]': JSON.stringify(meritpredictMegaJackpotContent.schema),
    }
  };
}

export default async function MeritpredictMegaJackpotPredictionPage() {
  let initialPredictions = [];
  let firstMatchDateISO = null;
  let error = null;

  const bookmakerId = 1;
  const typeId = 10;
  const totalMatches = 17;

  try {
    console.log(`Fetching MeritPredict Mega Jackpot predictions server-side...`);
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
      console.error('API error fetching MeritPredict mega jackpot predictions (server-side):', response.message);
      error = response.message || 'Failed to load MeritPredict mega jackpot predictions';
    }
  } catch (err) {
    console.error('Error fetching MeritPredict mega jackpot predictions (server-side):', err);
    error = err instanceof Error ? err.message : 'Failed to fetch MeritPredict mega jackpot predictions due to an unknown error';
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
          <p className="jp-loading-text text-lg">Loading MeritPredict Mega Jackpot...</p>
        </div>
      }>
        <MeritpredictJackpotDisplay 
          initialPredictions={initialPredictions} 
          firstMatchDateISO={firstMatchDateISO} 
          serverError={error}
          seoContent={meritpredictMegaJackpotContent}
          bookmakerId={bookmakerId}
        />
      </Suspense>
    </div>
  );
} 