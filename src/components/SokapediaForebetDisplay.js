import JackpotPage from './JackpotPage';

export default function SokapediaForebetDisplay({ 
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
      pageTitle="Sokapedia Forebet Predictions"
      pageDescription="Data‑led Sokapedia Forebet tips with plain‑English reasoning."
    />
  );
} 