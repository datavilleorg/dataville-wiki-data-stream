'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FiExternalLink } from 'react-icons/fi';
import EditEventFeed from '@/components/wikipedia/EditEventFeed';
import EntityMonitor from '@/components/wikipedia/EntityMonitor';
import RiskFlagPanel from '@/components/wikipedia/RiskFlagPanel';
import PayloadViewer from '@/components/wikipedia/PayloadViewer';
import { useEditEvents, useRiskFlags, useWikipediaStats } from '@/hooks/useWikipediaData';
import { TRACKED_ENTITIES } from '@/lib/wikipediaData';

export default function WikipediaTrackerPage() {
  const [selectedEntity, setSelectedEntity] = useState<string>(TRACKED_ENTITIES[0].wiki_title);

  const { events, isLive, toggleLive } = useEditEvents();
  const { flags } = useRiskFlags();
  const stats = useWikipediaStats(events);

  const handleSelectEntity = (wikiTitle: string) => {
    setSelectedEntity(wikiTitle);
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Top nav */}
      <header className="sticky top-0 z-10 bg-white border-b border-[#E5D5C5]">
        <div className="mx-auto max-w-7xl px-6 py-3 flex items-center justify-between">
          <a href="https://dataville.com" className="flex items-center gap-3">
            <Image src="/Mailbox_Full (2).svg" alt="Dataville icon" width={24} height={24} />
            <Image src="/dataville-logo.svg" alt="Dataville" width={100} height={18} />
          </a>
          <a
            href="https://dataville.com"
            className="text-sm font-medium text-maroon hover:underline flex items-center gap-1"
          >
            dataville.com <FiExternalLink className="h-3 w-3" />
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8 space-y-6">
        {/* Header */}
        <div className="rounded-2xl border border-[#E5D5C5] bg-white p-6">
          <div className="flex items-start justify-between gap-6">
            <div>
              <h1 className="text-2xl font-bold text-maroon">Wikipedia Knowledge Base Tracker</h1>
              <p className="mt-1 text-sm text-maroon/70">
                Simulated real-time Wikipedia edit events for competitor intelligence and knowledge base refresh
              </p>
              <p className="mt-0.5 text-xs text-maroon/50">
                Data source: Wikimedia REST API · {TRACKED_ENTITIES.length} entities monitored
              </p>
            </div>

            <div className="flex gap-6 text-center flex-shrink-0">
              <div>
                <p className="text-2xl font-bold text-maroon">{stats.entities_monitored}</p>
                <p className="text-xs text-maroon/50">Entities</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-maroon">{stats.edits_detected_24h}</p>
                <p className="text-xs text-maroon/50">Edits</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-red-600">{stats.risk_flags_active}</p>
                <p className="text-xs text-maroon/50">Risk Flags</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{stats.kb_refreshes_triggered}</p>
                <p className="text-xs text-maroon/50">KB Refreshes</p>
              </div>
            </div>
          </div>
        </div>

        {/* About */}
        <div className="rounded-2xl border border-[#E5D5C5] bg-white divide-y divide-maroon/10">
          <div className="px-6 py-5">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-maroon/40 mb-1">Featured use case</p>
            <h2 className="text-base font-bold text-maroon">Wikipedia Knowledge Base Refresh</h2>
            <p className="mt-1.5 text-sm text-maroon/70 leading-relaxed">
              Subscribe to a set of Wikipedia categories and receive webhook-style events whenever a tracked article
              is edited. Surface signals from founding year changes, product description updates, controversy edits,
              and executive roster changes — exactly the payload shape you'd wire into a knowledge base refresh pipeline.
            </p>
          </div>

          <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-maroon/10">
            <div className="px-6 py-5">
              <h3 className="text-[11px] font-semibold uppercase tracking-widest text-maroon/40 mb-3">Why use Dataville</h3>
              <ul className="space-y-2.5 text-sm text-maroon/70">
                {[
                  'Subscribe to Wikipedia categories — receive structured edit events without scraping',
                  'Structured JSON payloads ready to plug into any knowledge base or RAG pipeline',
                  'Risk signals surfaced automatically from article categories (antitrust, sanctions, disputes)',
                  'Track competitor companies, executives, and geographies in a single API subscription',
                ].map(item => (
                  <li key={item} className="flex gap-2.5">
                    <span className="mt-1.5 h-1 w-1 rounded-full bg-maroon/40 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="px-6 py-5">
              <h3 className="text-[11px] font-semibold uppercase tracking-widest text-maroon/40 mb-3">Data source</h3>
              <div className="text-sm text-maroon/70 space-y-3">
                <p>
                  <span className="font-medium text-maroon">Wikimedia REST API</span> — real article summaries,
                  categories, and infoboxes from English Wikipedia, enriched with simulated edit events.
                </p>
                <ul className="space-y-2">
                  {[
                    ['Signal types', 'Founding year · Products · Controversies · Executives'],
                    ['Risk categories', 'Antitrust · Privacy · Labor disputes · SEC investigations · Export controls'],
                    ['Payload', 'Exact shape developers receive for knowledge base refresh pipelines'],
                  ].map(([label, value]) => (
                    <li key={label} className="flex gap-2.5">
                      <span className="mt-1.5 h-1 w-1 rounded-full bg-maroon/40 flex-shrink-0" />
                      <span><span className="font-medium text-maroon">{label}:</span> {value}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href="https://en.wikipedia.org/api/rest_v1/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-maroon hover:underline font-medium"
                >
                  View Wikimedia REST API docs
                  <FiExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Live Edit Stream */}
        <div className="rounded-2xl border border-[#E5D5C5] bg-white p-6">
          <EditEventFeed events={events} isLive={isLive} onToggleLive={toggleLive} />
        </div>

        {/* Entity Monitor + Risk Flags */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-[#E5D5C5] bg-white p-6">
            <EntityMonitor
              editEvents={events}
              riskFlags={flags}
              selectedEntity={selectedEntity}
              onSelectEntity={handleSelectEntity}
            />
          </div>

          <div className="rounded-2xl border border-[#E5D5C5] bg-white p-6">
            <RiskFlagPanel flags={flags} onSelectEntity={handleSelectEntity} />
          </div>
        </div>

        {/* Payload Viewer */}
        <div className="rounded-2xl border border-[#E5D5C5] bg-white p-6">
          <PayloadViewer selectedEntity={selectedEntity} onSelectEntity={handleSelectEntity} />
        </div>
      </main>
    </div>
  );
}
