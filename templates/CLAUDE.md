# CLAUDE.md — Drupal + USWDS Project

## Component registries

Query both registries before generating or modifying USWDS UI:

- USWDS design manifest: https://raw.githubusercontent.com/ednark/uswds-ai-components/main/agents.json
- Drupal implementation manifest: https://raw.githubusercontent.com/ednark/drupal-uswds-ai-components/main/agents.json

Fetch and filter each registry index, then fetch only the selected tiles. Follow each tile's adaptation instructions and preserve its required semantics, accessibility relationships, classes, and behavior.

## Theme overrides

Before changing a Drupal USWDS sub-theme, read:

https://raw.githubusercontent.com/ednark/drupal-uswds-ai-components/main/guides/uswds-theme-overrides.md

Use the lowest appropriate override layer:

1. Existing USWDS component, variant, or utility
2. USWDS Sass setting or design token
3. Scoped custom Sass or CSS
4. CSS custom property for a runtime value
5. Drupal render array, preprocess hook, or form alter
6. Specific Twig template override
7. Drupal JavaScript behavior
8. Inline style only under a documented exception

Do not treat the absence of a paragraph bundle as sufficient reason to create a Twig override. Never edit vendor or generated files. Preserve keyboard, focus, ARIA, reduced-motion, forced-colors, and required USWDS behavior.
