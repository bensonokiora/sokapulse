import PredictionLoader from '@/components/PredictionLoader';
import soccerRatingJackpotContent from '@/data/seo/pages/soccer-rating-jackpot-predictions';

export async function generateMetadata() {
  return {
    title: soccerRatingJackpotContent.title,
    description: soccerRatingJackpotContent.description,
    keywords: soccerRatingJackpotContent.keywords,
    other: {
      'script[type="application/ld+json"]': JSON.stringify(soccerRatingJackpotContent.schema),
    }
  };
}

export default function SoccerRatingJackpotPredictionsPage() {
  return (
    <>
      <PredictionLoader 
        pageTitle="Soccer-Rating Jackpot Predictions and Expert Tips"
        pageType="soccer-rating-jackpot-predictions"
        siteName="Soccer-Rating Predictions"
      />
    </>
  );
} 