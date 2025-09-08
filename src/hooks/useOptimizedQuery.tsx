import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface QueryCache {
  [key: string]: {
    data: any;
    timestamp: number;
  };
}

interface UseOptimizedQueryOptions {
  cacheTime?: number; // Cache time in milliseconds
  enabled?: boolean;
  deps?: any[];
}

export const useOptimizedQuery = (
  queryKey: string,
  queryFn: () => Promise<any>,
  options: UseOptimizedQueryOptions = {}
) => {
  const { cacheTime = 2 * 60 * 1000, enabled = true, deps = [] } = options; // 2 minutes default cache
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<Error | null>(null);
  const cacheRef = useRef<QueryCache>({});
  const requestRef = useRef<Promise<any> | null>(null);

  const executeQuery = useCallback(async (forceRefresh = false) => {
    if (!enabled) return;

    // Check cache first
    const cached = cacheRef.current[queryKey];
    const cacheAge = cached ? Date.now() - cached.timestamp : Infinity;
    
    if (!forceRefresh && cached && cacheAge < cacheTime) {
      setData(cached.data);
      setLoading(false);
      return cached.data;
    }

    // Prevent duplicate requests
    if (requestRef.current) {
      return requestRef.current;
    }

    setLoading(true);
    setError(null);

    try {
      requestRef.current = queryFn();
      const result = await requestRef.current;
      
      // Cache the result
      cacheRef.current[queryKey] = {
        data: result,
        timestamp: Date.now(),
      };
      
      setData(result);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err as Error);
      setLoading(false);
      throw err;
    } finally {
      requestRef.current = null;
    }
  }, [queryKey, queryFn, cacheTime, enabled]);

  const refetch = useCallback(() => {
    return executeQuery(true);
  }, [executeQuery]);

  useEffect(() => {
    executeQuery();
  }, [enabled, ...deps]);

  return {
    data,
    loading,
    error,
    refetch,
  };
};

// Debounce hook for filtering
export const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Progressive data loading hook
export const useProgressiveLoading = (queries: Array<() => Promise<any>>) => {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentQuery, setCurrentQuery] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const newResults: any[] = [];
      
      for (let i = 0; i < queries.length; i++) {
        setCurrentQuery(i);
        try {
          const result = await queries[i]();
          newResults[i] = result;
          setResults([...newResults]);
        } catch (error) {
          console.error(`Query ${i} failed:`, error);
          newResults[i] = null;
        }
      }
      
      setLoading(false);
    };

    if (queries.length > 0) {
      loadData();
    }
  }, [queries]);

  return {
    results,
    loading,
    currentQuery,
    progress: queries.length > 0 ? (currentQuery + 1) / queries.length : 1,
  };
};