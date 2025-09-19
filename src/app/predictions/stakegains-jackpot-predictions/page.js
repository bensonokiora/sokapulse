import PredictionLoader from '@/components/PredictionLoader';
import stakegainsJackpotContent from '@/data/seo/pages/stakegains-jackpot-predictions';

export async function generateMetadata() {
  return {
    title: stakegainsJackpotContent.title,
    description: stakegainsJackpotContent.description,
    keywords: stakegainsJackpotContent.keywords,
    other: {
      'script[type="application/ld+json"]': JSON.stringify(stakegainsJackpotContent.schema),
    }
  };
}

export default function StakegainsJackpotPredictionsPage() {
  return (
    <>
      <PredictionLoader 
        pageTitle="Stakegains Jackpot Predictions and Expert Tips"
        pageType="stakegains-jackpot-predictions"
        siteName="Stakegains Predictions"
      />
    </>
  );
} 