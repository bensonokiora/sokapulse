import JackpotPage from './JackpotPage';

export default function ShabikiJackpotDisplay({ 
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
      pageTitle="Shabiki Jackpot Predictions"
      pageDescription="Expert predictions and analysis for the Shabiki Jackpot."
    />
  );
} 