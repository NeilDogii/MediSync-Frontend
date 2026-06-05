"use client";

interface DashboardSkeletonProps {
  titleWidth?: string;
  cards?: number;
  rows?: number;
}

function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`
        relative overflow-hidden rounded-xl
        bg-slate-200
        before:absolute
        before:inset-0
        before:-translate-x-full
        before:animate-shimmer
        before:bg-gradient-to-r
        before:from-transparent
        before:via-white/70
        before:to-transparent
        ${className}
      `}
    />
  );
}

export default function DoctorLoadingScreen({
  titleWidth = "w-72",
  cards = 3,
  rows = 6,
}: DashboardSkeletonProps) {
  return (
    <div className="ml-64 min-h-screen bg-slate-50 p-8">
      {/* Hero */}
      <div className="mb-8 rounded-[32px] bg-white border p-8 shadow-sm">
        <Skeleton className={`h-10 ${titleWidth}`} />

        <Skeleton className="mt-5 h-4 w-80" />
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {Array.from({ length: cards }).map((_, i) => (
          <div key={i} className="rounded-3xl bg-white border p-6 shadow-sm">
            <div className="flex justify-between">
              <div className="flex-1">
                <Skeleton className="h-4 w-24 mb-5" />

                <Skeleton className="h-10 w-20 mb-5" />

                <Skeleton className="h-3 w-32" />
              </div>

              <Skeleton className="h-14 w-14 rounded-2xl" />
            </div>
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="space-y-5">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="rounded-3xl bg-white border p-6 shadow-sm">
            <div className="flex justify-between gap-6">
              <div className="flex gap-4 flex-1">
                <Skeleton className="h-14 w-14 rounded-2xl" />

                <div className="flex-1">
                  <Skeleton className="h-5 w-56 mb-3" />

                  <Skeleton className="h-4 w-full mb-2" />

                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>

              <div className="flex gap-3">
                <Skeleton className="h-10 w-28" />

                <Skeleton className="h-10 w-28" />

                <Skeleton className="h-10 w-20" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
