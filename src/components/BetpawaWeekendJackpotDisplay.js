import JackpotPage from './JackpotPage';

export default function BetpawaWeekendJackpotDisplay({ 
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
      pageTitle="Betpawa Weekend Jackpot Predictions"
      pageDescription="Expert weekend jackpot predictions for Betpawa in Kenya, Tanzania, and Uganda."
    />
  );
} 