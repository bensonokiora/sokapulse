import JackpotPage from './JackpotPage';

export default function ForebetVsPredictzMegaJackpotDisplay({ 
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
      pageTitle="Forebet vs PredictZ Mega Jackpot Predictions"
      pageDescription="Side‑by‑side model calls with disciplined, EV‑aware decisions."
    />
  );
} 