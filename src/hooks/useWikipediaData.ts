'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  TRACKED_ENTITIES,
  generateInitialEditEvents,
  generateEditEvent,
  extractRiskFlags,
  fetchWikipediaSummary,
  buildArticlePayload,
  generateStats,
} from '@/lib/wikipediaData';
import { EditEvent, RiskFlag, ArticlePayload, WikipediaStats } from '@/types/wikipedia';

let globalEditEvents: EditEvent[] = [];
const globalRiskFlags: RiskFlag[] = extractRiskFlags();
const globalEntitySummaries: Map<string, { summary: string; lastEdited: string }> = new Map();
let globalSummariesLoaded = false;

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

export function useEntitySummaries() {
  const [summaries, setSummaries] = useState(new Map(globalEntitySummaries));
  const [isLoading, setIsLoading] = useState(!globalSummariesLoaded);

  useEffect(() => {
    if (globalSummariesLoaded) return;

    const fetchAll = async () => {
      for (const entity of TRACKED_ENTITIES) {
        const data = await fetchWikipediaSummary(entity.wiki_title);
        if (data) {
          globalEntitySummaries.set(entity.wiki_title, {
            summary: data.extract,
            lastEdited: data.timestamp,
          });
        }
        await new Promise(r => setTimeout(r, 80));
      }
      globalSummariesLoaded = true;
      setSummaries(new Map(globalEntitySummaries));
      setIsLoading(false);
    };

    fetchAll();
  }, []);

  return { summaries, isLoading };
}

export function useArticlePayload(wikiTitle: string | null): { payload: ArticlePayload | null } {
  const { summaries } = useEntitySummaries();

  const payload = useMemo<ArticlePayload | null>(() => {
    if (!wikiTitle) return null;
    const entity = TRACKED_ENTITIES.find(e => e.wiki_title === wikiTitle);
    if (!entity) return null;

    const data = summaries.get(wikiTitle);
    if (!data) return null;

    return buildArticlePayload(entity, data.summary, data.lastEdited);
  }, [wikiTitle, summaries]);

  return { payload };
}

export function useWikipediaStats(editEvents: EditEvent[]): WikipediaStats {
  return useMemo(() => generateStats(editEvents, globalRiskFlags), [editEvents]);
}
