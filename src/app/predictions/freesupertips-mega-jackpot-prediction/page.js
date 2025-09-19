import PredictionLoader from '@/components/PredictionLoader';
import freesupertipsMegaJackpotContent from '@/data/seo/pages/freesupertips-mega-jackpot-prediction';

export async function generateMetadata() {
  return {
    title: freesupertipsMegaJackpotContent.title,
    description: freesupertipsMegaJackpotContent.description,
    keywords: freesupertipsMegaJackpotContent.keywords,
    other: {
      'script[type="application/ld+json"]': JSON.stringify(freesupertipsMegaJackpotContent.schema),
    }
  };
}

export default function FreesupertipsMegaJackpotPredictionPage() {
  return (
    <>
      <PredictionLoader 
        pageTitle="Freesupertips Mega Jackpot Prediction Today and Betting Tips"
        pageType="freesupertips-mega-jackpot-prediction"
        siteName="Freesupertips Predictions"
      />
    </>
  );
} 