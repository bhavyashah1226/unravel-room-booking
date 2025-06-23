import { useEffect } from 'react';

export function useInfiniteScroll({ loading, hasMore, onLoadMore, sentinelRef }) {
  useEffect(() => {
    if (loading) return;
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && hasMore) {
        onLoadMore();
      }
    }, { rootMargin: '200px' });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loading, hasMore, onLoadMore, sentinelRef]);
}
