import PredictionLoader from '@/components/PredictionLoader';
import betExplorerJackpotAnalysisContent from '@/data/seo/pages/betexplorer-jackpot-analysis';

export async function generateMetadata() {
  return {
    title: betExplorerJackpotAnalysisContent.title,
    description: betExplorerJackpotAnalysisContent.description,
    keywords: betExplorerJackpotAnalysisContent.keywords,
    other: {
      'script[type="application/ld+json"]': JSON.stringify(betExplorerJackpotAnalysisContent.schema),
    }
  };
}

export default function BetExplorerJackpotAnalysisPage() {
  return (
    <>
      <PredictionLoader 
        pageTitle="BetExplorer Jackpot Analysis and Expert Insights"
        pageType="betexplorer-jackpot-analysis"
        siteName="BetExplorer Analysis"
      />
    </>
  );
} 