import PredictionLoader from '@/components/PredictionLoader';
import fcpredictsJackpotContent from '@/data/seo/pages/fcpredicts-jackpot-predictions';

export async function generateMetadata() {
  return {
    title: fcpredictsJackpotContent.title,
    description: fcpredictsJackpotContent.description,
    keywords: fcpredictsJackpotContent.keywords,
    other: {
      'script[type="application/ld+json"]': JSON.stringify(fcpredictsJackpotContent.schema),
    }
  };
}

export default function FcpredictsJackpotPredictionsPage() {
  return (
    <>
      <PredictionLoader 
        pageTitle="Fcpredicts Jackpot Predictions and Betting Tips"
        pageType="fcpredicts-jackpot-predictions"
        siteName="Fcpredicts Predictions"
      />
    </>
  );
} 