import { Suspense } from 'react';
import { fetchMoreAllJp } from '@/utils/api';
import mybetsTodayMegaJackpotContent from '@/data/seo/pages/mybets-today-mega-jackpot-predictions';
import MybetsTodayMegaJackpotDisplay from '@/components/MybetsTodayMegaJackpotDisplay';

export async function generateMetadata() {
  return {
    title: mybetsTodayMegaJackpotContent.title,
    description: mybetsTodayMegaJackpotContent.description,
    keywords: mybetsTodayMegaJackpotContent.keywords,
    other: {
      'script[type="application/ld+json"]': JSON.stringify(mybetsTodayMegaJackpotContent.schema),
    }
  };
}

export default async function MybetsTodayMegaJackpotPredictionsPage() {
  let initialPredictions = [];
  let firstMatchDateISO = null;
  let error = null;

  const bookmakerId = 1;
  const typeId = 10;
  const totalMatches = 17;

  try {
    console.log(`Fetching MyBets.today Mega Jackpot predictions server-side...`);
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
      console.error('API error fetching MyBets.today predictions (server-side):', response.message);
      error = response.message || 'Failed to load MyBets.today Mega Jackpot predictions';
    }
  } catch (err) {
    console.error('Error fetching MyBets.today predictions (server-side):', err);
    error = err instanceof Error ? err.message : 'Failed to fetch MyBets.today predictions due to an unknown error';
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
          <p className="jp-loading-text text-lg">Loading MyBets.today Mega Jackpot...</p>
        </div>
      }>
        <MybetsTodayMegaJackpotDisplay 
          initialPredictions={initialPredictions} 
          firstMatchDateISO={firstMatchDateISO} 
          serverError={error}
          seoContent={mybetsTodayMegaJackpotContent}
          bookmakerId={bookmakerId}
        />
      </Suspense>
    </div>
  );
} 