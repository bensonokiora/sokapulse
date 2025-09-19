import PredictionLoader from '@/components/PredictionLoader';
import windrawwinMegaJackpotContent from '@/data/seo/pages/windrawwin-mega-jackpot-prediction';

export async function generateMetadata() {
  return {
    title: windrawwinMegaJackpotContent.title,
    description: windrawwinMegaJackpotContent.description,
    keywords: windrawwinMegaJackpotContent.keywords,
    other: {
      'script[type="application/ld+json"]': JSON.stringify(windrawwinMegaJackpotContent.schema),
    }
  };
}

export default function WinDrawWinMegaJackpotPredictionPage() {
  return (
    <>
      <PredictionLoader 
        pageTitle="WinDrawWin Mega Jackpot Prediction Today and Betting Tips"
        pageType="windrawwin-mega-jackpot-prediction"
        siteName="WinDrawWin Predictions"
      />
    </>
  );
} 