import JackpotPage from './JackpotPage';

export default function StriketipsMegaJackpotDisplay({ 
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
      pageTitle="StrikeTips Mega Jackpot Predictions"
      pageDescription="Clear, human‑written 17‑game guidance with value flags."
    />
  );
} 