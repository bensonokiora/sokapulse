import JackpotPage from './JackpotPage';

export default function AlphaSportsBettingMegaJackpotDisplay({ 
  initialPredictions, 
  firstMatchDateISO, 
  serverError, 
  seoContent,
  bookmakerId
}) {
  return (
    <JackpotPage 
      initialPredictions={initialPredictions}
      firstMatchDateISO={firstMatchDateISO}
      serverError={serverError}
      seoContent={seoContent}
      bookmakerId={bookmakerId}
      pageTitle="Alpha Sports Betting Mega Jackpot Predictions"
      pageDescription="Confidence‑labeled 17‑game calls with safer pivots."
    />
  );
} 