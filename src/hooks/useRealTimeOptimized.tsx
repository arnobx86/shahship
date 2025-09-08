import { useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

interface RealTimeOptions {
  table: string;
  filter?: string;
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
  enabled?: boolean;
  debounceMs?: number;
}

export const useRealTimeOptimized = (
  options: RealTimeOptions,
  onUpdate: () => void
) => {
  const { table, filter, event = '*', enabled = true, debounceMs = 1000 } = options;
  const channelRef = useRef<RealtimeChannel | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const callbackRef = useRef(onUpdate);

  // Update callback ref when onUpdate changes
  callbackRef.current = onUpdate;

  const debouncedCallback = useCallback(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      callbackRef.current();
    }, debounceMs);
  }, [debounceMs]);

  useEffect(() => {
    if (!enabled) return;

    const channelName = `optimized-${table}-${filter || 'all'}`;
    
    // Cleanup existing channel
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    // Create new channel
    channelRef.current = supabase
      .channel(channelName)
      .on(
        'postgres_changes' as any,
        {
          event,
          schema: 'public',
          table,
          ...(filter ? { filter } : {}),
        },
        debouncedCallback
      )
      .subscribe();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [enabled, table, filter, event, debouncedCallback]);

  const cleanup = useCallback(() => {
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
  }, []);

  return { cleanup };
};

// Shared real-time connection manager
class RealTimeManager {
  private static instance: RealTimeManager;
  private channels: Map<string, RealtimeChannel> = new Map();
  private subscribers: Map<string, Set<() => void>> = new Map();

  static getInstance(): RealTimeManager {
    if (!RealTimeManager.instance) {
      RealTimeManager.instance = new RealTimeManager();
    }
    return RealTimeManager.instance;
  }

  subscribe(key: string, table: string, filter: string | undefined, callback: () => void) {
    const channelKey = `${table}-${filter || 'all'}`;
    
    // Add subscriber
    if (!this.subscribers.has(channelKey)) {
      this.subscribers.set(channelKey, new Set());
    }
    this.subscribers.get(channelKey)!.add(callback);

    // Create channel if it doesn't exist
    if (!this.channels.has(channelKey)) {
      const channel = supabase
        .channel(channelKey)
        .on(
          'postgres_changes' as any,
          {
            event: '*',
            schema: 'public',
            table,
            ...(filter ? { filter } : {}),
          },
          () => {
            // Notify all subscribers
            this.subscribers.get(channelKey)?.forEach(cb => cb());
          }
        )
        .subscribe();
      
      this.channels.set(channelKey, channel);
    }

    return () => this.unsubscribe(key, channelKey, callback);
  }

  private unsubscribe(key: string, channelKey: string, callback: () => void) {
    const subscribers = this.subscribers.get(channelKey);
    if (subscribers) {
      subscribers.delete(callback);
      
      // Remove channel if no more subscribers
      if (subscribers.size === 0) {
        const channel = this.channels.get(channelKey);
        if (channel) {
          supabase.removeChannel(channel);
          this.channels.delete(channelKey);
          this.subscribers.delete(channelKey);
        }
      }
    }
  }
}

export const useSharedRealTime = (
  key: string,
  table: string,
  filter: string | undefined,
  callback: () => void,
  enabled = true
) => {
  const managerRef = useRef(RealTimeManager.getInstance());

  useEffect(() => {
    if (!enabled) return;

    const unsubscribe = managerRef.current.subscribe(key, table, filter, callback);
    return unsubscribe;
  }, [key, table, filter, callback, enabled]);
};