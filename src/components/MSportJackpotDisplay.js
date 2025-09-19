import JackpotPage from './JackpotPage';

export default function MSportJackpotDisplay({ 
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
      pageTitle="MSport Jackpot Predictions"
      pageDescription="Expert predictions and analysis for the MSport Jackpot."
    />
  );
} 