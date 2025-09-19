import JackpotPage from './JackpotPage';

export default function BetwizadJackpotDisplay({ 
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
      pageTitle="Betwizad Mega Jackpot Predictions"
      pageDescription="Data‑aware, human‑vetted Betwizad Mega Jackpot picks for all 17 games."
    />
  );
} 