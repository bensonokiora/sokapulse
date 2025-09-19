import { Suspense } from 'react';
import { fetchMoreAllJp } from '@/utils/api';
import bettingclosedMegaJackpotContent from '@/data/seo/pages/bettingclosed-mega-jackpot-predictions';
import BettingclosedMegaJackpotDisplay from '@/components/BettingclosedMegaJackpotDisplay';

export async function generateMetadata() {
  return {
    title: bettingclosedMegaJackpotContent.title,
    description: bettingclosedMegaJackpotContent.description,
    keywords: bettingclosedMegaJackpotContent.keywords,
    other: {
      'script[type="application/ld+json"]': JSON.stringify(bettingclosedMegaJackpotContent.schema),
    }
  };
}

export default async function BettingclosedMegaJackpotPredictionsPage() {
  let initialPredictions = [];
  let firstMatchDateISO = null;
  let error = null;

  const bookmakerId = 1;
  const typeId = 10;
  const totalMatches = 17;

  try {
    const response = await fetchMoreAllJp(bookmakerId, typeId, totalMatches);

    if (!response.error && response.body && Array.isArray(response.body)) {
      initialPredictions = response.body;
      if (initialPredictions.length > 0) {
        const sortedMatches = [...initialPredictions].sort((a, b) => {
          const dateA = new Date(`${a.date}T${a.time || '00:00:00'}`);
          const dateB = new Date(`${b.date}T${b.time || '00:00:00'}`);
          if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) { return 0; }
          return dateA.getTime() - dateB.getTime();
        });
        const earliestMatch = sortedMatches[0];
        const matchDateTime = new Date(`${earliestMatch.date}T${earliestMatch.time || '00:00:00'}`);
        if (!isNaN(matchDateTime.getTime())) { firstMatchDateISO = matchDateTime.toISOString(); }
      }
    } else {
      error = response.message || 'Failed to load Bettingclosed predictions';
    }
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to fetch Bettingclosed predictions';
    initialPredictions = [];
  }

  if (error && (!initialPredictions || initialPredictions.length === 0)) {
    return (<div className="jp-container p-4"><div className="jp-error-message text-red-500 text-center">Error: {error}</div></div>);
  }

  return (
    <div className="jp-container">
      <Suspense fallback={<div className="jp-loading-container flex justify-center items-center h-64"><p className="jp-loading-text text-lg">Loading Bettingclosed...</p></div>}>
        <BettingclosedMegaJackpotDisplay 
          initialPredictions={initialPredictions}
          firstMatchDateISO={firstMatchDateISO}
          serverError={error}
          seoContent={bettingclosedMegaJackpotContent}
          bookmakerId={bookmakerId}
        />
      </Suspense>
    </div>
  );
} 