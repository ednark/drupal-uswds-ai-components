# Drupal USWDS AI Components

> Drupal implementation knowledge for USWDS components.
> Maps each USWDS component to its Drupal module, paragraph type, Twig template, and configuration.
> Home: https://github.com/ednark/drupal-uswds-ai-components
> Base layer: https://github.com/ednark/ai-component-registry-spec (submodule at _base/)
> Companion design registry: https://github.com/ednark/uswds-ai-components

---

## Overview

This registry bridges the gap between USWDS design knowledge and Drupal implementation. It tells an AI agent not just *which* USWDS component to use (that's the companion registry's job), but *how* to implement it in Drupal — which module to install, which paragraph type to create, which Twig template to override, and which Drush commands to run.

## The Two-Registry Pattern

```
User asks: "Build a government contact form"

Step 1: Query uswds-ai-components (design registry)
  → Returns: "Use usa-input, usa-button, usa-form"
  → Gives: HTML patterns, when to use, a11y guidance

Step 2: Query drupal-uswds-ai-components (this registry)
  → Returns: "Form has no paragraph bundle. Use custom Twig template."
  → Gives: Template naming, preprocess function, Drush commands, config
```

## Drupal Module Ecosystem

### USWDS Base Theme (`uswds`)
- Drupal.org: https://www.drupal.org/project/uswds
- Type: Theme (base theme: classy)
- Provides: 14 regions, USWDS CSS/JS libraries, subtheme examples
- Regions: header_top, header, primary_menu, secondary_menu, sidebar_first, sidebar_second, breadcrumb, highlighted, help, hero, content, footer_menu, footer, footer_secondary

### USWDS Paragraph Components (`uswds_paragraph_components`)
- Drupal.org: https://www.drupal.org/project/uswds_paragraph_components
- Maintainer: smustgrave (Stephen Mustgrave)
- Type: Module with submodules
- Provides: Paragraph bundles for Accordion, Alert, Cards, Columns, Modal, Process List, Step Indicator, Summary Box
- Dependencies: Paragraphs, Entity Reference Revisions, Views Reference Field, Field Group, Twig Tweak

### Plotly.js (`plotly_js`)
- Drupal.org: https://www.drupal.org/project/plotly_js
- Maintainer: smustgrave (contributor)
- Type: Module
- Provides: Field type for charts (bar, line, pie, scatter) using Plotly.js
- Use for: Data visualizations instead of USWDS's limited chart patterns

## Implementation Types

| Type | Description | Example Components |
|------|-------------|-------------------|
| `paragraph_bundle` | Ready-to-use Paragraph type from uswds_paragraph_components | accordion, alert, card, modal, process-list, step-indicator, summary-box |
| `theme_region` | Placed via the uswds base theme's region system | header, footer, banner, breadcrumb, search, side-navigation |
| `field_type` | Provided by a contrib module as a field type | data-visualizations (plotly_js) |
| `twig_template` | Requires custom Twig template in theme | button, table, form, text-input, tag, link, icon, pagination, identifier, mega-menu (header variant) |
| `custom_module` | Requires a custom Drupal module | setup, layout-builder-bridge, icon-list + collection bundles |

## Theme Override Guidance

Use the [Drupal USWDS Theme Override Guide](guides/uswds-theme-overrides.md) when deciding whether a customization belongs in a USWDS Sass setting, scoped custom CSS, a CSS custom property, Drupal preprocess, Twig, JavaScript, or an exceptional inline value.

The companion `uswds-theme-overrides` skill is available at `.claude/skills/uswds-theme-overrides/SKILL.md` and is discoverable by Claude Code and OpenCode.

## Quick Start

**Agents:** [agents.json](agents.json) → [components.index.json](infinite/components.index.json) (filter in code) → fetch `infinite/{file}` → read the embedded `drupal-uswds-agent-meta` block. Machine docs: [AGENTS.md](AGENTS.md) · [llms.txt](llms.txt). MCP: `npm run mcp` (9 tools). Typical flow: query [uswds-ai-components](https://github.com/ednark/uswds-ai-components) for the design layer first, then this registry for implementation.

**Humans:** tiles are implementation-guidance documents — markup, Twig snippets, module/config mapping, and Drush commands. 24 tiles across 14 component families. Validate: `node _base/validate-registry.mjs --conformance .`

## Architecture

This registry extends the [AI Component Registry Spec](https://github.com/ednark/ai-component-registry-spec) as a git submodule at `_base/`. It is a companion to [uswds-ai-components](https://github.com/ednark/uswds-ai-components), which provides the design-layer knowledge (which component, when to use, HTML patterns).

The retrieval protocol was originated by [forever-ai-components](https://github.com/isas1/forever-ai-components).

## Agent-facing docs

- [AGENTS.md](AGENTS.md) — retrieval workflow, Drupal rules, quality gates
- [llms.txt](llms.txt) — the lean protocol: decision strategy, quality gates, facets, output contract
- [agents.json](agents.json) — compact machine manifest
- [compatibility.json](compatibility.json) — cross-registry maps
- [core-classes.json](infinite/core-classes.json) — documented untiled layout/typography layer

## Resolved views (appearance)

Drupal tiles use USWDS classes; their *appearance* resolves through a host page that loads USWDS CSS (the normal integration flow) or through each tile's generated **resolved view** sibling (`{variant}.resolved.html`): computed geometry, colors, and typography flattened inline, with USWDS CSS from `@uswds/uswds@3.14.0` injected at build time. Index records expose the path as the `resolvedView` field. Tile classes are validated against the USWDS stylesheet at build time (`staticView.classCheck` — classes not defined by USWDS fail conformance unless reasoned-allowlisted). Regenerate views after tile changes: `node _base/generate-resolved-view.mjs`.

## The registry family

| Registry | Design system | Tiles |
|---|---|---|
| [uswds-ai-components](https://github.com/ednark/uswds-ai-components) | U.S. Web Design System | 152 |
| [govuk-ai-components](https://github.com/ednark/govuk-ai-components) | GOV.UK Design System | 45 |
| [dsfr-ai-components](https://github.com/ednark/dsfr-ai-components) | Système de Design de l'État | 42 |
| [ecl-ai-components](https://github.com/ednark/ecl-ai-components) | Europa Component Library | 36 |
| [canada-ai-components](https://github.com/ednark/canada-ai-components) | Canada.ca Design System | 25 |
| **drupal-uswds-ai-components** (this repo) | USWDS on Drupal (implementation layer) | 24 |
| [forever-ai-components](https://github.com/isas1/forever-ai-components) | Forever (origin project, external) | 604 |

## License

MIT. USWDS is in the public domain. Drupal modules are GPL-2.0.
