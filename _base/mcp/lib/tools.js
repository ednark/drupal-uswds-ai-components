/**
 * MCP tool definitions for the AI Component Registry server.
 *
 * Mirrors the registry's retrieval flow (facets -> index -> tile) plus the
 * cross-design-system transfer layer (adapters + translate).
 *
 * Uses Zod raw shapes for input schemas (required by @modelcontextprotocol/sdk).
 */

import { z } from 'zod';
import {
  loadConfig,
  readIndex,
  readFacets,
  readTile,
  readAdapter,
} from './registry.js';
import { translateTile } from './translate.js';

function json(text) {
  return { content: [{ type: 'text', text }] };
}

function searchComponents(params) {
  const index = readIndex();
  const { query, section, requiresJs, govCompliance, a11y, tags, limit } = params;
  let results = index.components;

  if (section) {
    results = results.filter((c) => c.section === section);
  }
  if (requiresJs) {
    results = results.filter((c) => c.requiresJs === requiresJs);
  }
  if (govCompliance && govCompliance.length) {
    results = results.filter((c) =>
      (c.govCompliance || []).some((g) => govCompliance.includes(g))
    );
  }
  if (tags && tags.length) {
    results = results.filter((c) =>
      (c.tags || []).some((t) => tags.includes(t))
    );
  }
  if (a11y && typeof a11y === 'object') {
    results = results.filter((c) => {
      const a = c.a11y || {};
      return Object.entries(a11y).every(([k, v]) => v === false || a[k] === true);
    });
  }
  if (query) {
    const q = query.toLowerCase();
    results = results.filter((c) =>
      [c.title, c.description, c.uswdsClass, ...(c.tags || [])]
        .filter(Boolean)
        .some((f) => String(f).toLowerCase().includes(q))
    );
  }

  if (limit && Number.isInteger(limit)) {
    results = results.slice(0, limit);
  }

  return results.map((c) => ({
    file: c.file,
    title: c.title,
    description: c.description,
    section: c.section,
    variant: c.variant,
    requiresJs: c.requiresJs,
    govCompliance: c.govCompliance,
    tags: c.tags,
  }));
}

export function registerTools(server) {
  const config = loadConfig();

  server.registerTool(
    'search_components',
    {
      title: 'Search components',
      description:
        'Filter the registry index by facet values or free-text query and return a shortlist of matching components. Use this instead of loading the whole index.',
      inputSchema: {
        query: z.string().optional().describe('Free-text match against title, description, class, tags'),
        section: z.string().optional().describe('Filter by section facet (e.g. forms, navigation, utilities)'),
        requiresJs: z.enum(['no', 'optional', 'required']).optional().describe('JavaScript requirement'),
        govCompliance: z.array(z.string()).optional().describe('Filter by compliance labels (Section 508, WCAG 2.1 AA, ...)'),
        a11y: z.record(z.boolean()).optional().describe('Require these a11y flags true (wcag21AA, keyboardNav, screenReader, ...)'),
        tags: z.array(z.string()).optional().describe('Filter by tags'),
        limit: z.number().int().optional().describe('Maximum number of results'),
      },
    },
    async (args) => json(JSON.stringify(searchComponents(args), null, 2))
  );

  server.registerTool(
    'get_component',
    {
      title: 'Get component tile',
      description:
        'Fetch a single component tile (full HTML source + parsed v2-categorized adaptation metadata). Pass the `file` path from search results.',
      inputSchema: {
        file: z.string().describe('Tile file path, e.g. button/default.html'),
      },
    },
    async ({ file }) => {
      const { html, meta } = readTile(file);
      return json(JSON.stringify({ file, html, meta: meta || null }, null, 2));
    }
  );

  server.registerTool(
    'list_facets',
    {
      title: 'List facets',
      description: 'Return the facet vocabulary (filterable values + counts) for the registry.',
      inputSchema: {},
    },
    async () => json(JSON.stringify(readFacets(), null, 2))
  );

  server.registerTool(
    'get_index',
    {
      title: 'Get discovery index',
      description:
        'Return the full or section-filtered discovery index (one lean record per component). Prefer search_components for targeted lookups.',
      inputSchema: {
        section: z.string().optional().describe('Optional section filter'),
      },
    },
    async ({ section } = {}) => {
      const index = readIndex();
      const out = section
        ? { ...index, components: index.components.filter((c) => c.section === section) }
        : index;
      return json(JSON.stringify(out, null, 2));
    }
  );

  server.registerTool(
    'get_adapter',
    {
      title: 'Get cross-system adapter',
      description:
        'Return the adapter mapping for a component to a target design system (material, bootstrap, ...). Throws if no adapter exists.',
      inputSchema: {
        component: z.string().describe('Source component name, e.g. button'),
        target: z.string().optional().describe('Target design system id (material, bootstrap)'),
      },
    },
    async ({ component, target }) => {
      const adapter = readAdapter(component);
      if (!adapter) {
        throw new Error(`No adapter registered for component "${component}"`);
      }
      const payload = target ? adapter.mappings?.[target] || null : adapter;
      if (target && !payload) {
        throw new Error(`Adapter for "${component}" has no mapping for target "${target}"`);
      }
      return json(JSON.stringify(payload, null, 2));
    }
  );

  server.registerTool(
    'translate_component',
    {
      title: 'Translate component to another design system',
      description:
        'Adapt a USWDS component tile to a target design system (material, bootstrap). Applies portableInvariants + classMapping/adapter, and reports gaps/limitations.',
      inputSchema: {
        file: z.string().describe('Tile file path, e.g. button/default.html'),
        target: z.string().describe('Target design system id (material, bootstrap)'),
      },
    },
    async ({ file, target }) => {
      const { html, meta } = readTile(file);
      const result = translateTile({ html, meta, target });
      return json(JSON.stringify(result, null, 2));
    }
  );

  return {
    registry: config.name,
    tools: [
      'search_components',
      'get_component',
      'list_facets',
      'get_index',
      'get_adapter',
      'translate_component',
    ],
  };
}
