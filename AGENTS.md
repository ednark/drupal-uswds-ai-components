# AGENTS.md — Drupal USWDS AI Components

## What This Is

A Drupal implementation knowledge registry for USWDS components. Maps each USWDS component to its Drupal module, paragraph type, Twig template, and Drush commands. 24 tiles covering 5 implementation types.

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


## Quality gates and declared gaps

1. Understand the requested outcome: what must the Drupal page accomplish?
2. Determine the implementation type: paragraph bundle, theme override, or module configuration
3. Check declared gaps (registry.config.json) before searching — use each gap's nearestAlternative
4. Search the index, filtering by drupalModule, implementationType, uswdsComponent
5. Prefer existing tiles over generating Twig from scratch
6. Prefer `complexity: "simple"` implementations unless the task requires more
7. Respect the registry mandates (see Quality gates)
8. Only generate new Twig/configuration if no suitable tile exists

## Quality gates and declared gaps

Do not retrieve or deploy a tile that:

- Whose `constraints.knownLimitations` block the delivery context (e.g. site-alert vs alert misuse)
- Implements a concept declared in `gaps` (registry.config.json: webforms, views-listings, combobox, mega-menu) — use the gap's nearestAlternative instead
- Needs Drupal layout/theme classes outside the tiles — use `infinite/core-classes.json` (the documented untiled Drupal layer), never invented classes

Registry mandates that act as gates:

- Use the companion registry (uswds-ai-components) for the static USWDS markup side; this registry is the Drupal implementation layer
- Enable the listed drush dependencies before deploying a tile's markup
- USWDS classes in tiles are protected: preserve usa-* classes through any theme override

Declared gaps: see `gaps` in registry.config.json. Untiled Drupal layer: see `infinite/core-classes.json`.


## Module Ecosystem

- **uswds** (base theme) — regions, libraries, subtheming
- **uswds_paragraph_components** (by smustgrave) — 8 paragraph bundles
- **plotly_js** — field type for charts
