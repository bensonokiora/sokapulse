import JackpotPage from './JackpotPage';

export default function SportybetJackpotDisplay({ 
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
      pageTitle="Sportybet Jackpot Predictions"
      pageDescription="Expert predictions and analysis for the Sportybet Jackpot."
    />
  );
} 