import JackpotPage from './JackpotPage';

export default function MozzartDailyJackpotDisplay({ 
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
      pageTitle="Mozzart Daily Jackpot Predictions"
      pageDescription="Expert predictions for the Mozzart Daily Jackpot."
    />
  );
} 