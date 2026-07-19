/**
 * Cross-design-system translation logic for the MCP `translate_component` tool.
 *
 * Strategy (matches protocol.md "Cross-Design System Transfer"):
 *   1. Enforce portableInvariants (returned verbatim for the agent to honor)
 *   2. Prefer tile `portability.classMapping[target]` for simple substitution
 *   3. Else use the adapter registry `structuralMapping` / `variantMapping`
 *   4. Else fall back to portableInvariants only and report a gap
 */

import { readAdapter } from './registry.js';

/**
 * Build a USWDS-class -> target-class replacement map for a component + target.
 * Returns { map, source, limitations, semanticNotes }.
 */
function buildClassMap(meta, target) {
  const result = {
    map: {},
    source: 'none',
    limitations: [],
    semanticNotes: [],
  };

  // 1. Tile-level classMapping (simple substitution)
  const cm = meta?.portability?.classMapping?.[target];
  if (cm && typeof cm === 'object') {
    result.source = 'classMapping';
    if (cm.base) result.map['usa-button'] = cm.base;
    if (cm.default) result.map['usa-button'] = cm.default;
    for (const [variant, targetClass] of Object.entries(cm)) {
      if (variant === 'base' || variant === 'default') continue;
      if (targetClass == null) {
        result.map[`usa-button--${variant}`] = null; // explicit "no equivalent"
      } else {
        result.map[`usa-button--${variant}`] = targetClass;
      }
    }
    return result;
  }

  // 2. Adapter registry mapping
  const component = meta?.discovery?.uswdsComponentType || meta?.file?.split('/')[0];
  const adapter = component ? readAdapter(component) : null;
  const mapping = adapter?.mappings?.[target];
  if (mapping) {
    result.source = 'adapter';
    result.limitations = mapping.limitations || [];
    result.semanticNotes = mapping.semanticNotes || [];

    if (mapping.baseClass) result.map['usa-button'] = mapping.baseClass;

    if (mapping.structuralMapping?.replace) {
      for (const { source, target: t } of mapping.structuralMapping.replace) {
        result.map[source] = t;
      }
    }
    if (mapping.variantMapping) {
      for (const [variant, v] of Object.entries(mapping.variantMapping)) {
        if (v == null) {
          result.map[`usa-button--${variant}`] = null;
        } else if (typeof v === 'string') {
          result.map[`usa-button--${variant}`] = v;
        } else if (v.class) {
          result.map[`usa-button--${variant}`] = v.class;
        }
      }
    }
    return result;
  }

  // 3. No mapping available
  return result;
}

/**
 * Replace USWDS class tokens in class attributes using the built map.
 * Multi-token target classes are supported; null values drop the token.
 */
function applyClassMap(html, map) {
  return html.replace(
    /(class\s*=\s*"(?:[^"]*)"|class\s*=\s*'(?:[^']*)')/gi,
    (attr) => {
      const quote = attr.includes('"') ? '"' : "'";
      const start = attr.indexOf(quote) + 1;
      const end = attr.lastIndexOf(quote);
      const inner = attr.slice(start, end);
      const mapped = inner
        .split(/\s+/)
        .filter(Boolean)
        .map((tok) => (map[tok] === null ? '' : map[tok] !== undefined ? map[tok] : tok))
        .filter(Boolean)
        .join(' ');
      return `class=${quote}${mapped}${quote}`;
    }
  );
}

/**
 * Translate a tile's HTML to a target design system.
 */
export function translateTile({ html, meta, target }) {
  const classInfo = buildClassMap(meta, target);
  const portableInvariants = meta?.constraints?.portableInvariants || [];

  const gaps = [];
  let translated = html;

  if (classInfo.source === 'none') {
    gaps.push(`No mapping available for "${target}" — returning portableInvariants only.`);
  } else {
    translated = applyClassMap(html, classInfo.map);

    // Detect unmapped usa- classes remaining in output (gap reporting)
    const leftover = new Set();
    const re = /class\s*=\s*["']([^"']*)["']/gi;
    let m;
    while ((m = re.exec(translated)) !== null) {
      for (const tok of m[1].split(/\s+/)) {
        if (tok.startsWith('usa-') && !classInfo.map[tok]) leftover.add(tok);
      }
    }
    if (leftover.size > 0) {
      gaps.push(`Unmapped USWDS classes remain: ${[...leftover].join(', ')}`);
    }
  }

  gaps.push(...classInfo.limitations);

  return {
    target,
    source: classInfo.source,
    html: translated,
    enforcedInvariants: portableInvariants,
    semanticNotes: classInfo.semanticNotes,
    limitations: classInfo.limitations,
    gaps,
  };
}
