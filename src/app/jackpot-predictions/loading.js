import LoadingAnimation from '@/components/LoadingAnimation';

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className="flex justify-center items-center min-h-screen">
      <LoadingAnimation text="Loading Jackpot Predictions..." />
    </div>
  );
} 