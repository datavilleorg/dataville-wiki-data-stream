export type SectionType =
  | 'founding_year'
  | 'product_description'
  | 'controversies'
  | 'executive_roster'
  | 'other';

export type RiskLevel = 'high' | 'medium' | 'low';

export interface EditEvent {
  event_id: string;
  event_type: 'article.edited';
  timestamp: string;
  article: {
    title: string;
    entity_name: string;
    wiki_url: string;
    revision_id: number;
    prev_revision_id: number;
  };
  edit: {
    section: string;
    section_type: SectionType;
    change_summary: string;
    editor: string;
    is_bot: boolean;
    bytes_changed: number;
  };
  signals: string[];
  kb_refresh_recommended: boolean;
}

export interface RiskFlag {
  entity_name: string;
  wiki_title: string;
  risk_category: string;
  risk_level: RiskLevel;
  article_url: string;
}

export interface TrackedEntity {
  name: string;
  wiki_title: string;
  category: string;
  infobox: Record<string, string>;
  categories: string[];
  risk_categories: { category: string; level: RiskLevel }[];
  related: string[];
  monitored_sections: SectionType[];
}

export interface DatavilleWikiResponse {
  status: string;
  account_state: string;
  data: {
    id: string;
    title: string;
    body: string;
    source: string;
    language: string;
    last_updated: string;
    entities: string[];
    metadata: {
      url: string;
      pageid: number | null;
      categories: Array<{ ns: number; title: string }>;
    };
  };
  usage: {
    requests_remaining: number;
    request_limit: number;
  };
}

export interface ArticlePayload {
  id: string;
  title: string;
  body: string;
  source: string;
  language: string;
  last_updated: string;
  entities: string[];
  metadata: {
    url: string;
    pageid: number | null;
    categories: Array<{ ns: number; title: string }>;
  };
}

export interface WikipediaStats {
  entities_monitored: number;
  edits_detected_24h: number;
  risk_flags_active: number;
  kb_refreshes_triggered: number;
  last_event_at: string | null;
}
