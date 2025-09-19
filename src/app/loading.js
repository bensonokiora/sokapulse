import LoadingAnimation from '@/components/LoadingAnimation';

export default function Loading() {
  // This loading UI will be shown immediately when navigating to the homepage
  // while the actual homepage content (page.js) is loading server-side.
  return (
    <div className="flex justify-center items-center min-h-screen">
      {/* You might want a different text or a more generic loading indicator for the homepage */}
      <LoadingAnimation text="Loading Predictions..." /> 
    </div>
  );
} 