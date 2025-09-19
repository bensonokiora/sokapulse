import JackpotPage from './JackpotPage';

export default function JackpotPredictionsDisplay({ 
  initialPredictions, 
  firstMatchDateISO, 
  serverError, 
  seoContent,
  bookmakerId,
  selectedDate,
  bookmakers,
  onDateChange,
  onBookmakerChange
}) {
  return (
    <JackpotPage 
      initialPredictions={initialPredictions}
      firstMatchDateISO={firstMatchDateISO}
      serverError={serverError}
      seoContent={seoContent}
      bookmakerId={bookmakerId}
      pageTitle="Jackpot Predictions"
      pageDescription="Expert predictions for jackpot betting with accurate match analysis and winning tips."
      selectedDate={selectedDate}
      bookmakers={bookmakers}
      onDateChange={onDateChange}
      onBookmakerChange={onBookmakerChange}
      showDateTabs={true}
      showBookmakerSidebar={true}
    />
  );
}