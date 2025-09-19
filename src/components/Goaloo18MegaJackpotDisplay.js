import JackpotPage from './JackpotPage';

export default function Goaloo18MegaJackpotDisplay({ 
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
      pageTitle="Goaloo18 Mega Jackpot Predictions"
      pageDescription="Model‑informed 17‑game picks with pragmatic context."
    />
  );
} 