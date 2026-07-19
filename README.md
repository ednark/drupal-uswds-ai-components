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
| `twig_template` | Requires custom Twig template in theme | button, table, form, text-input, tag, link, icon, pagination |
| `custom_module` | Requires a custom Drupal module | (rare — most components fit one of the above) |

## Theme Override Guidance

Use the [Drupal USWDS Theme Override Guide](guides/uswds-theme-overrides.md) when deciding whether a customization belongs in a USWDS Sass setting, scoped custom CSS, a CSS custom property, Drupal preprocess, Twig, JavaScript, or an exceptional inline value.

The companion `uswds-theme-overrides` skill is available at `.claude/skills/uswds-theme-overrides/SKILL.md` and is discoverable by Claude Code and OpenCode.

## Quick Start

1. Filter vocab (tiny): GET https://raw.githubusercontent.com/ednark/drupal-uswds-ai-components/main/infinite/facets.json
2. Discovery index (lean): GET https://raw.githubusercontent.com/ednark/drupal-uswds-ai-components/main/infinite/components.index.json
3. Component source: GET https://raw.githubusercontent.com/ednark/drupal-uswds-ai-components/main/infinite/{file}

## Architecture

This registry extends the [AI Component Registry Spec](https://github.com/ednark/ai-component-registry-spec) as a git submodule at `_base/`. It is a companion to [uswds-ai-components](https://github.com/ednark/uswds-ai-components), which provides the design-layer knowledge (which component, when to use, HTML patterns).

The retrieval protocol was originated by [forever-ai-components](https://github.com/isas1/forever-ai-components).

## License

MIT. USWDS is in the public domain. Drupal modules are GPL-2.0.
