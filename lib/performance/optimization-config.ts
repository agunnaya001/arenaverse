/**
 * Performance optimization configuration for ArenaVerse
 * Handles caching, lazy loading, code splitting, and bundle optimization
 */

export const performanceConfig = {
  // Image optimization
  imageOptimization: {
    formats: ['webp', 'avif'],
    sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
    priority: false,
  },

  // API caching strategy
  apiCache: {
    defaultTTL: 300, // 5 minutes
    endpoints: {
      '/api/leaderboard/top': 600, // 10 minutes - leaderboard changes less frequently
      '/api/marketplace/agents': 300, // 5 minutes
      '/api/ecosystem/guilds': 300,
      '/api/quest/list': 3600, // 1 hour - quests update less frequently
    },
  },

  // Database query optimization
  databaseOptimizations: {
    batchSize: 50,
    indexedFields: [
      'user_id',
      'created_at',
      'rarity',
      'level',
      'is_listed',
    ],
  },

  // React/Component optimizations
  componentOptimizations: {
    // Use React.memo for components that receive same props frequently
    memoComponents: [
      'MarketplaceChampionCard',
      'GuildCard',
      'TournamentCard',
      'ChampionStats',
    ],
    // Lazy load heavy components
    lazyLoadComponents: [
      'AIStudioEditor',
      'ChampionViewer',
      'BattleSimulator',
    ],
  },

  // Bundle optimization
  bundleOptimization: {
    codeSpitting: true,
    treeshaking: true,
    minification: true,
    compression: 'gzip',
  },

  // Caching headers
  cacheHeaders: {
    static: 'public, max-age=31536000, immutable', // 1 year for hash-based assets
    dynamic: 'public, max-age=3600, s-maxage=3600', // 1 hour
    api: 'private, max-age=300, s-maxage=300', // 5 minutes
  },
};

/**
 * Utility to get cache TTL for an endpoint
 */
export function getCacheTTL(endpoint: string): number {
  return performanceConfig.apiCache.endpoints[endpoint as keyof typeof performanceConfig.apiCache.endpoints] || performanceConfig.apiCache.defaultTTL;
}

/**
 * Utility to get appropriate cache header
 */
export function getCacheHeader(type: 'static' | 'dynamic' | 'api'): string {
  return performanceConfig.cacheHeaders[type];
}

/**
 * Database query optimization helpers
 */
export const dbOptimizations = {
  // Select only needed fields to reduce payload
  selectRequired: (fields: string[]) => fields.join(','),

  // Batch operations to reduce database calls
  batchInsert: async (
    table: string,
    records: any[],
    client: any
  ) => {
    const batches = [];
    for (let i = 0; i < records.length; i += performanceConfig.databaseOptimizations.batchSize) {
      batches.push(
        client.from(table).insert(records.slice(i, i + performanceConfig.databaseOptimizations.batchSize))
      );
    }
    return Promise.all(batches);
  },

  // Pagination helper
  paginate: (query: any, page: number, limit: number) => {
    const offset = (page - 1) * limit;
    return query.range(offset, offset + limit - 1);
  },
};

/**
 * Performance monitoring utilities
 */
export const performanceMonitoring = {
  // Track Core Web Vitals
  trackMetrics: async () => {
    if (typeof window === 'undefined') return;

    const metrics = {
      fcp: 0, // First Contentful Paint
      lcp: 0, // Largest Contentful Paint
      cls: 0, // Cumulative Layout Shift
      inp: 0, // Interaction to Next Paint
    };

    // Monitor performance metrics
    if ('PerformanceObserver' in window) {
      // LCP
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        metrics.lcp = lastEntry.renderTime || lastEntry.loadTime;
      }).observe({ entryTypes: ['largest-contentful-paint'] });

      // CLS
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            metrics.cls += (entry as any).value;
          }
        }
      }).observe({ entryTypes: ['layout-shift'] });

      // INP
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        metrics.inp = (lastEntry as any).processingDuration;
      }).observe({ entryTypes: ['event'] });
    }

    return metrics;
  },

  // Log performance data
  logMetrics: (metrics: any) => {
    console.log('[v0] Performance Metrics:', metrics);
  },
};
