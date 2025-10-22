import { Suspense } from "react";
import SummarizeClientView from "./SummarizeClientView";

// A simple skeleton to show *before* the client component loads
function SummaryPageSkeleton() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="h-10 w-3/4 animate-pulse rounded-lg bg-muted"></div>
      <div className="space-y-2">
        <div className="h-6 w-full animate-pulse rounded-lg bg-muted"></div>
        <div className="h-6 w-full animate-pulse rounded-lg bg-muted"></div>
        <div className="h-6 w-5/6 animate-pulse rounded-lg bg-muted"></div>
      </div>
    </div>
  );
}

export default function SummarizePage() {
  return (
    <Suspense fallback={<SummaryPageSkeleton />}>
      <SummarizeClientView />
    </Suspense>
  );
}