import JackpotPage from './JackpotPage';

export default function SportpesaMegaJackpotDisplay({ 
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
      pageTitle="Sportpesa Mega Jackpot Predictions"
      pageDescription="Expert predictions for the Sportpesa Mega Jackpot."
    />
  );
}