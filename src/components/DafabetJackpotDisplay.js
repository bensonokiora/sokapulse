import JackpotPage from './JackpotPage';

export default function OneXBetJackpotDisplay({ 
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
      pageTitle="1xBet Jackpot Predictions"
      pageDescription="Expert predictions for the 1xBet Jackpot."
    />
  );
}