import { Suspense } from 'react';
import Link from 'next/link';
import { 
  fetchHeadToHeadData, 
  fetchLastHomeTeamMatches, 
  fetchLastAwayTeamMatches,
  fetchJackpotMatches,
  fetchMatchOdds
} from '@/utils/api';
import '../../../../styles/jackpot-match-details.css';
import { FaArrowLeft } from 'react-icons/fa';
import JackpotMatchDetailsDisplay from '@/components/JackpotMatchDetailsDisplay'; // New client component

// Server Component - Now simplified
export default function JackpotMatchDetailsPage({ params, searchParams }) {
  // No data fetching here anymore.
  // The client component will fetch its own data using params/searchParams from hooks.

  // We still pass params and searchParams so the client component can use them if needed,
  // although using hooks client-side is generally preferred.
  // const { id, slug } = params;
  // const { homeTeamId, awayTeamId, date, bookmakerId, matchId } = searchParams;

  return (
    // Use simple text fallback
    <Suspense fallback={
        <div className="jmd-loading-container" role="status" aria-live="polite">
             <p>Loading Match Details...</p> {/* Simple text fallback */}
        </div>
    }>
       <JackpotMatchDetailsDisplay /> 
    </Suspense>
  );
}