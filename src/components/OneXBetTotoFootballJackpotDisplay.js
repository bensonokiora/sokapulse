import JackpotPage from './JackpotPage';

export default function OneXBetTotoFootballJackpotDisplay({ 
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
      pageTitle="1xBet Toto Football Jackpot Predictions"
      pageDescription="Expert predictions and analysis for the 1xBet Toto Football Jackpot."
    />
  );
} 