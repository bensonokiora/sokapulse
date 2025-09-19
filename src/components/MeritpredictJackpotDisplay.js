import JackpotPage from './JackpotPage';

export default function MeritpredictJackpotDisplay({ 
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
      pageTitle="MeritPredict Mega Jackpot Predictions"
      pageDescription="Clear, practical MeritPredict Mega Jackpot tips for a disciplined 17‑game slip."
    />
  );
} 