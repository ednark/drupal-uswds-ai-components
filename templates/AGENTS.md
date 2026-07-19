# AGENTS.md — Drupal + USWDS Project

## Component Registries

This project uses two AI-retrievable component registries. Query them before generating any UI.

### 1. USWDS Design Knowledge (which component, when to use, HTML pattern)

**Manifest:** https://raw.githubusercontent.com/ednark/uswds-ai-components/main/agents.json
**Index:** https://raw.githubusercontent.com/ednark/uswds-ai-components/main/infinite/components.index.json
**Facets:** https://raw.githubusercontent.com/ednark/uswds-ai-components/main/infinite/facets.json

When a user asks for a UI component, fetch the index, filter by section/requiresJs/govCompliance, then fetch the tile to get the HTML pattern and adaptation guidance. The tile's embedded `uswds-agent-meta` JSON block tells you:
- `useWhen` / `avoidWhen` — when to choose this component
- `agentPrompt` — how to adapt it
- `editableAreas` — what's safe to change
- `preserveElements` — what must be kept (ARIA, classes, structure)

### 2. Drupal Implementation Knowledge (which module, paragraph type, Twig, Drush)

**Manifest:** https://raw.githubusercontent.com/ednark/drupal-uswds-ai-components/main/agents.json
**Index:** https://raw.githubusercontent.com/ednark/drupal-uswds-ai-components/main/infinite/components.index.json

After selecting a USWDS component, fetch the corresponding Drupal implementation tile. Filter by `implementationType` (paragraph_bundle, theme_region, twig_template, field_type) to find how to implement it in Drupal. The tile's `drupal-uswds-agent-meta` block tells you:
- `drupalModule` — which module to install
- `paragraphType` — paragraph bundle machine name
- `twigTemplate` — template file path
- `drushCommands` — exact commands to run
- `configYaml` — config import snippets
- `fieldDefinitions` — Drupal field definitions

## Workflow

```
1. User requests a UI (e.g., "build a contact form")
2. Fetch uswds-ai-components index → filter for section=forms
3. Fetch the matching tiles → get HTML patterns + adaptation guidance
4. Fetch drupal-uswds-ai-components index → filter for matching components
5. Fetch the Drupal tiles → get module, paragraph type, Twig, Drush commands
6. Tell the user: which modules to install, which Drush commands to run,
   which templates to override, and provide the adapted markup
```

## Theme Override Guidance

Before changing a Drupal USWDS sub-theme, read:

https://raw.githubusercontent.com/ednark/drupal-uswds-ai-components/main/guides/uswds-theme-overrides.md

Use the lowest appropriate override layer: existing component or utility, USWDS Sass setting, scoped custom style, CSS custom property for runtime values, Drupal render array or preprocess, specific Twig override, then Drupal JavaScript behavior. Avoid inline styles.

Do not treat the absence of a paragraph bundle as sufficient reason to create a Twig override. Preserve the selected tile's semantic structure, ARIA relationships, keyboard behavior, focus behavior, reduced-motion support, forced-colors support, and required classes.

## Rules

- ALWAYS query the registries before generating UI. Do not guess USWDS class names.
- Prefer components with `requiresJs: "no"` unless the task explicitly needs JS.
- Preserve `preserveElements` — never remove ARIA attributes or required class structures.
- Check `govCompliance` — all components must meet Section 508 / WCAG 2.1 AA.
- When no Drupal paragraph bundle exists, evaluate render arrays, preprocess, form alters, theme settings, existing base templates, and module ownership before creating a Twig override.
