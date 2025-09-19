import { Suspense } from 'react';
import { fetchMoreAllJp } from '@/utils/api';
import bankerpredictMegaJackpotContent from '@/data/seo/pages/bankerpredict-mega-jackpot-tips';
import BankerpredictJackpotDisplay from '@/components/BankerpredictJackpotDisplay';

export async function generateMetadata() {
  return {
    title: bankerpredictMegaJackpotContent.title,
    description: bankerpredictMegaJackpotContent.description,
    keywords: bankerpredictMegaJackpotContent.keywords,
    other: {
      'script[type="application/ld+json"]': JSON.stringify(bankerpredictMegaJackpotContent.schema),
    }
  };
}

export default async function BankerpredictMegaJackpotTipsPage() {
  let initialPredictions = [];
  let firstMatchDateISO = null;
  let error = null;

  const bookmakerId = 1;
  const typeId = 10;
  const totalMatches = 17;

  try {
    console.log(`Fetching BankerPredict Mega Jackpot tips server-side...`);
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
      console.error('API error fetching BankerPredict mega jackpot tips (server-side):', response.message);
      error = response.message || 'Failed to load BankerPredict mega jackpot tips';
    }
  } catch (err) {
    console.error('Error fetching BankerPredict mega jackpot tips (server-side):', err);
    error = err instanceof Error ? err.message : 'Failed to fetch BankerPredict mega jackpot tips due to an unknown error';
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
          <p className="jp-loading-text text-lg">Loading BankerPredict Tips...</p>
        </div>
      }>
        <BankerpredictJackpotDisplay 
          initialPredictions={initialPredictions} 
          firstMatchDateISO={firstMatchDateISO} 
          serverError={error}
          seoContent={bankerpredictMegaJackpotContent}
          bookmakerId={bookmakerId}
        />
      </Suspense>
    </div>
  );
} 