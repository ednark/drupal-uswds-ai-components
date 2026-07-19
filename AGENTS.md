# AGENTS.md — Drupal USWDS AI Components

## What This Is

A Drupal implementation knowledge registry for USWDS components. Maps each USWDS component to its Drupal module, paragraph type, Twig template, and Drush commands. 20 tiles covering 5 implementation types.

## How to Query This Registry

1. **Manifest:** https://raw.githubusercontent.com/ednark/drupal-uswds-ai-components/main/agents.json
2. **Index:** https://raw.githubusercontent.com/ednark/drupal-uswds-ai-components/main/infinite/components.index.json
3. **Tile pattern:** https://raw.githubusercontent.com/ednark/drupal-uswds-ai-components/main/infinite/{file}
4. **Agent meta ID:** `drupal-uswds-agent-meta`

## Workflow

1. Fetch the index, filter by `implementationType` or `drupalModule`
2. Fetch the tile, read the `drupal-uswds-agent-meta` JSON block
3. Follow the module installation, paragraph type, Twig template, and Drush commands

## Theme Override Guidance

When authoring or reviewing Drupal theme implementation guidance, read `guides/uswds-theme-overrides.md`. Prefer existing USWDS components and utilities, then USWDS Sass settings, scoped custom styles, Drupal render arrays or preprocess, and only then a specific Twig override. Preserve every tile's semantic, accessibility, and component constraints.

Do not treat the absence of a paragraph bundle as sufficient reason to create a Twig override.

## Companion Registry

For USWDS design knowledge (HTML patterns, when to use, a11y guidance), query:
- https://raw.githubusercontent.com/ednark/uswds-ai-components/main/agents.json

## Implementation Types

- `paragraph_bundle` — ready-to-use Paragraph type from uswds_paragraph_components
- `theme_region` — placed via the uswds base theme's region system
- `field_type` — provided by a contrib module (e.g., plotly_js)
- `twig_template` — requires custom Twig template override
- `custom_module` — full stack setup guide

## Module Ecosystem

- **uswds** (base theme) — regions, libraries, subtheming
- **uswds_paragraph_components** (by smustgrave) — 8 paragraph bundles
- **plotly_js** — field type for charts
