import JackpotPage from './JackpotPage';

export default function CorrectScoreJackpotDisplay({ 
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
      pageTitle="Correct Score Mega Jackpot Predictions"
      pageDescription="Probability‑led correct score shortlists for all 17 games."
    />
  );
} 