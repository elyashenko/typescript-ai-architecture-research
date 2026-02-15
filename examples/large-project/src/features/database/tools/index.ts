/**
 * Features Layer: Database Tools
 */

export const databaseTools = {
  'db:query': () => import('./query').then(m => m.queryTool),
  'db:migrate': () => import('./migrate').then(m => m.migrateTool),
} as const;
