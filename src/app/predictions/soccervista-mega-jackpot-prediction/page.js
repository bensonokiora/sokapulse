import PredictionLoader from '@/components/PredictionLoader';
import soccerVistaMegaJackpotContent from '@/data/seo/pages/soccervista-mega-jackpot-prediction';

export async function generateMetadata() {
  return {
    title: soccerVistaMegaJackpotContent.title,
    description: soccerVistaMegaJackpotContent.description,
    keywords: soccerVistaMegaJackpotContent.keywords,
    other: {
      'script[type="application/ld+json"]': JSON.stringify(soccerVistaMegaJackpotContent.schema),
    }
  };
}

export default function SoccerVistaMegaJackpotPredictionPage() {
  return (
    <>
      <PredictionLoader 
        pageTitle="SoccerVista Mega Jackpot Prediction Today and Betting Tips"
        pageType="soccervista-mega-jackpot-prediction"
        siteName="SoccerVista Predictions"
      />
    </>
  );
} 