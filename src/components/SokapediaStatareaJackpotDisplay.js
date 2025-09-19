import JackpotPage from './JackpotPage';

export default function SokapediaStatareaJackpotDisplay({ 
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
      pageTitle="Sokapedia Statarea Mega Jackpot Analysis"
      pageDescription="Hybrid probabilities plus human context—readable 17‑game analysis."
    />
  );
} 