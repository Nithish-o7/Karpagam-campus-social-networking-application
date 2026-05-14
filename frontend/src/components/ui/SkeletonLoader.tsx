import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

/**
 * Standardised Skeleton loader components for Phase 14.
 * Uses react-loading-skeleton for consistent shimmer effects.
 */
export function PostSkeleton() {
  return (
    <SkeletonTheme baseColor="var(--surface)" highlightColor="var(--bg-app)">
      <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          <Skeleton circle width={44} height={44} />
          <div style={{ flex: 1 }}>
            <Skeleton width="40%" height={16} style={{ marginBottom: 6 }} />
            <Skeleton width="60%" height={12} />
          </div>
        </div>
        <div style={{ marginTop: 8 }}>
          <Skeleton count={2} style={{ marginBottom: 10 }} borderRadius={6} />
          <Skeleton width="70%" borderRadius={6} />
        </div>
      </div>
    </SkeletonTheme>
  );
}

export function TicketSkeleton() {
  return (
    <SkeletonTheme baseColor="var(--surface)" highlightColor="var(--bg-app)">
      <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Skeleton width={44} height={44} borderRadius="var(--r-md)" />
          <div style={{ flex: 1 }}>
            <Skeleton width="35%" height={14} style={{ marginBottom: 6 }} />
            <Skeleton width="55%" height={12} />
          </div>
          <Skeleton width={80} height={24} borderRadius={20} />
        </div>
        <div style={{ marginTop: 4 }}>
          <Skeleton count={1} height={14} borderRadius={6} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 4 }}>
          <Skeleton width="25%" height={10} />
          <Skeleton width="22%" height={10} />
        </div>
      </div>
    </SkeletonTheme>
  );
}
