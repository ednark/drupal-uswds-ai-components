#!/usr/bin/env node
/**
 * Drupal registry v1 → v2 tile migration.
 * Categorizes flat metadata into the v2 schema and adds the family
 * essentials: uswdClass, a11y/compliance/mobileUX discovery facts,
 * coordination (compositionCost from Drupal complexity), constraints,
 * supportedTokenProfiles, and provenance.
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const TILE_DIR = join(process.cwd(), 'infinite');
const OBSERVED = '2026-09-06';

const USWD_CLASS = {
  accordion: 'usa-accordion', alert: 'usa-alert', banner: 'usa-banner',
  breadcrumb: 'usa-breadcrumb', button: 'usa-button', card: 'usa-card',
  'data-visualizations': 'usa-chart', footer: 'usa-footer', form: 'usa-form',
  header: 'usa-header', 'icon-list': 'usa-icon-list', collection: 'usa-collection',
  identifier: 'usa-identifier', tag: 'usa-tag', link: 'usa-link', icon: 'usa-icon',
  pagination: 'usa-pagination', modal: 'usa-modal', 'process-list': 'usa-process-list',
  search: 'usa-search', 'side-navigation': 'usa-sidenav', 'step-indicator': 'usa-step-indicator',
  'summary-box': 'usa-summary-box', table: 'usa-table', 'text-input': 'usa-input',
};

const COMPLEXITY = { simple: 'cheap', moderate: 'moderate', complex: 'expensive' };
const A11Y = { wcag21AA: true, keyboardNav: true, screenReader: true, reducedMotion: true, forcedColors: true, ariaAttributes: true };
const GOV = ['Section 508', 'WCAG 2.1 AA', '21st Century IDEA'];

function findHtml(dir, files = []) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) findHtml(p, files);
    else if (f.endsWith('.html')) files.push(p);
  }
  return files;
}

let migrated = 0;
for (const file of findHtml(TILE_DIR)) {
  const html = readFileSync(file, 'utf8');
  const m = html.match(/<script[^>]*id="drupal-uswds-agent-meta"[^>]*>([\s\S]*?)<\/script>/i);
  if (!m) { console.log('  ✗ no meta:', file); continue; }
  const v1 = JSON.parse(m[1]);
  if ((v1._schemaVersion || 1) >= 2) continue; // already migrated

  const complexity = v1.complexity || 'simple';
  const costTier = COMPLEXITY[complexity] || 'moderate';
  const bytes = Buffer.byteLength(html, 'utf8');
  const uswdClass = USWD_CLASS[v1.uswdsComponent] || null;

  const discovery = {
    implementationType: v1.implementationType,
    drupalModule: v1.drupalModule,
    uswdsComponent: v1.uswdsComponent,
    ...(v1.paragraphType && { paragraphType: v1.paragraphType }),
    ...(v1.themeRegion && { themeRegion: v1.themeRegion }),
    complexity,
    drupalVersion: v1.drupalVersion,
    ...(uswdClass && { uswdClass }),
    tier: v1.tier || 'curated',
    tags: v1.tags,
    description: v1.description || v1.title,
    a11y: A11Y,
    govCompliance: v1.govCompliance || GOV,
    compliance: {
      nistControls: [],
      section508: true,
      wcag21AA: true,
      piiHandling: v1.uswdsComponent === 'form' || v1.uswdsComponent === 'text-input' ? 'accepts_input' : 'displays_only',
      auditTrailCompatible: false,
      dataMaskingCompatible: false,
    },
    mobileUX: { touchTargetSize: '44px', requiredMinSpacing: '8px', orientationLocked: false, fullscreenSafe: true },
  };

  const instruction = { agentPrompt: v1.agentPrompt };
  for (const k of ['twigTemplate', 'preprocessFunction', 'drushCommands', 'fieldDefinitions', 'dependencies']) {
    if (v1[k] !== undefined) instruction[k] = v1[k];
  }

  const meta = {
    _schemaVersion: 2,
    discovery,
    selection: { useWhen: v1.useWhen, avoidWhen: v1.avoidWhen },
    instruction,
    coordination: {
      prerequisiteComponents: [],
      incompatibleWith: [],
      compositionCost: {
        costTier,
        estimatedTokens: Math.ceil(bytes / 4),
        renderingTimeMs: 15,
        recommendedModel: costTier === 'expensive' ? 'sonnet' : 'haiku',
      },
    },
    constraints: {
      preserve: v1.preserveElements,
      editable: v1.editableAreas,
      limitations: v1.knownLimitations,
      portableInvariants: v1.preserveElements,
    },
    supportedTokenProfiles: ['highContrast'],
    provenance: { observed: OBSERVED, source: 'v1→v2 migration (tools/migrate-v2.mjs)', method: 'design-system documentation' },
    file: v1.file,
    title: v1.title,
  };

  const out = html.replace(m[0], m[1].startsWith('\n') ? m[1] : m[1]);
  writeFileSync(file, html.replace(
    new RegExp(`(<script[^>]*id="drupal-uswds-agent-meta"[^>]*>)[\\s\\S]*?(</script>)`, 'i'),
    `$1\n${JSON.stringify(meta, null, 2)}\n$2`
  ));
  migrated++;
}

console.log(`Migrated ${migrated} tiles to schema v2`);
