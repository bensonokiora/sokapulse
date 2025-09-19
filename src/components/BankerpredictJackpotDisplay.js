import JackpotPage from './JackpotPage';

export default function BankerpredictJackpotDisplay({ 
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
      pageTitle="BankerPredict Mega Jackpot Tips"
      pageDescription="Confidence‑tiered banker tips and value leans for a balanced 17‑game slip."
    />
  );
} 