"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type QueryState<T> = {
  data: T | null;
  isLoading: boolean;
  error: string | null;
};

type UseQueryOptions = {
  enabled?: boolean;
  cacheKey?: string;
  cacheTtl?: number; // milliseconds, default 30s
};

// Simple in-memory cache
const cache = new Map<string, { data: unknown; timestamp: number }>();

function getCached<T>(key: string, ttl: number): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > ttl) {
    cache.delete(key);
    return null;
  }
  return entry.data as T;
}

function setCache(key: string, data: unknown) {
  cache.set(key, { data, timestamp: Date.now() });
}

export function invalidateCache(keyPrefix?: string) {
  if (!keyPrefix) {
    cache.clear();
    return;
  }
  for (const key of cache.keys()) {
    if (key.startsWith(keyPrefix)) {
      cache.delete(key);
    }
  }
}

export function useQuery<T>(
  queryFn: () => Promise<T>,
  deps: unknown[] = [],
  options: UseQueryOptions = {},
) {
  const { enabled = true, cacheKey, cacheTtl = 30000 } = options;
  const [state, setState] = useState<QueryState<T>>({
    data: null,
    isLoading: true,
    error: null,
  });

  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const refetch = useCallback(async () => {
    if (!enabled) return;

    // Check cache
    if (cacheKey) {
      const cached = getCached<T>(cacheKey, cacheTtl);
      if (cached) {
        setState({ data: cached, isLoading: false, error: null });
        return;
      }
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const data = await queryFn();
      if (isMounted.current) {
        setState({ data, isLoading: false, error: null });
        if (cacheKey) setCache(cacheKey, data);
      }
    } catch (err) {
      if (isMounted.current) {
        setState({
          data: null,
          isLoading: false,
          error: err instanceof Error ? err.message : "Query failed",
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, cacheKey, cacheTtl, ...deps]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { ...state, refetch };
}
