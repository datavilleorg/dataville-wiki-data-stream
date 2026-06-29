'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  TRACKED_ENTITIES,
  generateInitialEditEvents,
  generateEditEvent,
  extractRiskFlags,
  fetchDatavilleArticle,
  generateStats,
} from '@/lib/wikipediaData';
import { EditEvent, RiskFlag, ArticlePayload, WikipediaStats } from '@/types/wikipedia';

let globalEditEvents: EditEvent[] = [];
const globalRiskFlags: RiskFlag[] = extractRiskFlags();
const globalEntityPayloads: Map<string, ArticlePayload> = new Map();
let globalPayloadsLoaded = false;

export function useEditEvents() {
  const [events, setEvents] = useState<EditEvent[]>([]);
  const [isLive, setIsLive] = useState(true);

  // Populate initial events only on the client to avoid hydration mismatch
  // (generateInitialEditEvents uses Math.random() and Date.now())
  useEffect(() => {
    if (globalEditEvents.length === 0) {
      globalEditEvents = generateInitialEditEvents(15);
    }
    setEvents([...globalEditEvents]);
  }, []);

  useEffect(() => {
    if (!isLive) return;

    let timeoutId: ReturnType<typeof setTimeout>;

    const scheduleNext = () => {
      const delay = 3000 + Math.random() * 5000;
      timeoutId = setTimeout(() => {
        const entity = TRACKED_ENTITIES[Math.floor(Math.random() * TRACKED_ENTITIES.length)];
        const newEvent = generateEditEvent(entity);
        globalEditEvents = [newEvent, ...globalEditEvents].slice(0, 50);
        setEvents([...globalEditEvents]);
        scheduleNext();
      }, delay);
    };

    scheduleNext();
    return () => clearTimeout(timeoutId);
  }, [isLive]);

  const toggleLive = useCallback(() => setIsLive(prev => !prev), []);

  return { events, isLive, toggleLive };
}

export function useRiskFlags() {
  return { flags: globalRiskFlags };
}

export function useEntityPayloads() {
  const [payloads, setPayloads] = useState(new Map(globalEntityPayloads));
  const [isLoading, setIsLoading] = useState(!globalPayloadsLoaded);

  useEffect(() => {
    if (globalPayloadsLoaded) return;

    const fetchAll = async () => {
      for (const entity of TRACKED_ENTITIES) {
        const data = await fetchDatavilleArticle(entity.wiki_title);
        if (data) {
          globalEntityPayloads.set(entity.wiki_title, data);
        }
        await new Promise(r => setTimeout(r, 80));
      }
      globalPayloadsLoaded = true;
      setPayloads(new Map(globalEntityPayloads));
      setIsLoading(false);
    };

    fetchAll();
  }, []);

  return { payloads, isLoading };
}

export function useArticlePayload(wikiTitle: string | null): { payload: ArticlePayload | null } {
  const { payloads } = useEntityPayloads();

  const payload = useMemo<ArticlePayload | null>(() => {
    if (!wikiTitle) return null;
    return payloads.get(wikiTitle) ?? null;
  }, [wikiTitle, payloads]);

  return { payload };
}

export function useWikipediaStats(editEvents: EditEvent[]): WikipediaStats {
  return useMemo(() => generateStats(editEvents, globalRiskFlags), [editEvents]);
}
