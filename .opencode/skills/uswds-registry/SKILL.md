---
name: uswds-registry
description: Query USWDS and Drupal-USWDS component registries when building government websites. Use when the user asks for UI components, forms, navigation, or any USWDS component. Triggers on keywords like USWDS, government website, usa-button, usa-card, usa-header, Drupal theme, paragraph components.
---

# USWDS Component Registry Skill

When building or modifying UI for a USWDS-based government website, query these registries BEFORE generating any markup.

## The Two Registries

### 1. USWDS Design Knowledge (which component, when to use, HTML pattern)

- **Manifest:** https://raw.githubusercontent.com/ednark/uswds-ai-components/main/agents.json
- **Index:** https://raw.githubusercontent.com/ednark/uswds-ai-components/main/infinite/components.index.json
- **Tile pattern:** https://raw.githubusercontent.com/ednark/uswds-ai-components/main/infinite/{file}
- **Agent meta ID:** `uswds-agent-meta`

### 2. Drupal Implementation Knowledge (which module, paragraph type, Twig, Drush)

- **Manifest:** https://raw.githubusercontent.com/ednark/drupal-uswds-ai-components/main/agents.json
- **Index:** https://raw.githubusercontent.com/ednark/drupal-uswds-ai-components/main/infinite/components.index.json
- **Tile pattern:** https://raw.githubusercontent.com/ednark/drupal-uswds-ai-components/main/infinite/{file}
- **Agent meta ID:** `drupal-uswds-agent-meta`

## Workflow

1. **Discover:** Fetch the agents.json manifest to learn the registry schema
2. **Load index:** Fetch components.index.json (lean — one record per component, no prose)
3. **Filter in code:** Narrow by section, requiresJs, implementationType, etc.
4. **Fetch tiles:** GET only the chosen tile HTML files
5. **Read embedded meta:** Parse the `*-agent-meta` JSON block inside each tile
6. **Adapt:** Follow the agentPrompt, respect preserveElements, modify editableAreas

## Facet Cheat Sheet

### USWDS Design Registry facets:
- `section`: forms, navigation, feedback, data-display, layout, utilities, supporting
- `requiresJs`: no, optional, required
- `govCompliance`: Section 508, WCAG 2.1 AA, 21st Century IDEA
- `a11y`: wcag21AA, keyboardNav, screenReader, reducedMotion, forcedColors, ariaAttributes

### Drupal Implementation Registry facets:
- `implementationType`: paragraph_bundle, theme_region, twig_template, field_type, custom_module
- `drupalModule`: uswds, uswds_paragraph_components, plotly_js, custom
- `paragraphType`: uswds_accordion, uswds_alert, uswds_card, uswds_modal, uswds_process_list, uswds_step_indicator, uswds_summary_box
- `complexity`: simple, moderate, complex

## Rules

- ALWAYS query the registries before generating USWDS markup
- Do not guess USWDS class names — fetch the tile to get the exact pattern
- Prefer `requiresJs: "no"` components unless the task explicitly needs JS
- Preserve `preserveElements` — never remove ARIA attributes or required class structures
- When implementing in Drupal, fetch the Drupal tile to get module/paragraph/Twig/Drush info
- If no Drupal paragraph bundle exists, use Twig template overrides (see `twig_template` tiles)
