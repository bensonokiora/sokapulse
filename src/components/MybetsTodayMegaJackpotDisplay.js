import JackpotPage from './JackpotPage';

export default function MybetsTodayMegaJackpotDisplay({ 
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
      pageTitle="MyBets.today Mega Jackpot Predictions"
      pageDescription="Disciplined, EV‑aware 17‑game strategy in plain English."
    />
  );
} 