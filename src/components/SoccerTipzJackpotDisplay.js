import JackpotPage from './JackpotPage';

export default function SoccerTipzJackpotDisplay({ 
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
      pageTitle="Soccer Tipz Jackpot Predictions"
      pageDescription="Readable 17‑game picks with safer pivots where needed."
    />
  );
} 