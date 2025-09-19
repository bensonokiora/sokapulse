import JackpotPage from './JackpotPage';

export default function SokapediaMegaJackpotDisplay({ 
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
      pageTitle="Sokapedia Mega Jackpot Predictions"
      pageDescription="Structured 17‑game guidance with confidence labels and value calls."
    />
  );
} 