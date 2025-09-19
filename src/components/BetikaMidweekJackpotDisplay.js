
import JackpotPage from './JackpotPage';

export default function BetikaMidweekJackpotDisplay({ 
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
      pageTitle="Betika Midweek Jackpot Predictions"
      pageDescription="Expert predictions for the Betika Midweek Jackpot."
    />
  );
}
 