import JackpotPage from './JackpotPage';

export default function TipsfameJackpotDisplay({ 
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
      pageTitle="Tipsfame Jackpot Predictions"
      pageDescription="Human‑written, data‑backed Tipsfame Jackpot picks for all 17 games."
    />
  );
} 