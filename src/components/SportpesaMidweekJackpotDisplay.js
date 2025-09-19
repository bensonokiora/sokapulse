import JackpotPage from './JackpotPage';

export default function SportpesaMidweekJackpotDisplay({ 
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
      pageTitle="Sportpesa Midweek Jackpot Predictions"
      pageDescription="Expert predictions for the Sportpesa Midweek Jackpot."
    />
  );
}
 