// src/components/ui/Skeleton.js
export function Skeleton({ className = '', ...props }) {
    return (
      <div
        className={`animate-pulse rounded-md bg-muted ${className}`}
        {...props}
      />
    );
  }
  
  export function TokenRowSkeleton() {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="p-4 rounded-lg border border-border">
            <div className="flex items-center gap-4">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="grid grid-cols-2 md:grid-cols-4 flex-1 gap-4">
                <div>
                  <Skeleton className="h-5 w-24 mb-2" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <div>
                  <Skeleton className="h-5 w-20 mb-2" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div>
                  <Skeleton className="h-5 w-16 mb-2" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <div className="flex justify-end">
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  export function CardSkeleton() {
    return (
      <div className="p-4 rounded-lg border border-border">
        <Skeleton className="h-4 w-24 mb-2" />
        <Skeleton className="h-6 w-32" />
      </div>
    );
  }
  
  export function ChartSkeleton() {
    return (
      <div className="p-4 rounded-lg border border-border">
        <Skeleton className="h-64 w-full rounded-lg" />
        <div className="mt-4 flex justify-center gap-4">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-4 w-16" />
          ))}
        </div>
      </div>
    );
  }