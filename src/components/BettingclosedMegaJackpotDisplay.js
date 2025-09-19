import JackpotPage from './JackpotPage';

export default function BettingclosedMegaJackpotDisplay({ 
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
      pageTitle="Bettingclosed Mega Jackpot Predictions"
      pageDescription="Plain‑English 17‑game tips with value flags and pivots."
    />
  );
} 