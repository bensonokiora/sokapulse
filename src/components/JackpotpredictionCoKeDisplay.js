import JackpotPage from './JackpotPage';

export default function JackpotpredictionCoKeDisplay({ 
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
      pageTitle="Jackpotprediction.co.ke Mega Jackpot Analysis"
      pageDescription="Readable 17‑game analysis with value flags and safer pivots."
    />
  );
} 