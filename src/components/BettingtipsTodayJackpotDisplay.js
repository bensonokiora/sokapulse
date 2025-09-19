import JackpotPage from './JackpotPage';

export default function BettingtipsTodayJackpotDisplay({ 
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
      pageTitle="Betting-tips.today Mega Jackpot Analysis"
      pageDescription="Readable 17‑game analysis with value markers and safer pivots."
    />
  );
} 