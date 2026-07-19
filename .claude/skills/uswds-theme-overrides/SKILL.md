---
name: uswds-theme-overrides
description: Apply Drupal USWDS theme override decisions for Sass settings, custom CSS, Twig, preprocess hooks, JavaScript, and inline styles. Use when creating, reviewing, or refactoring a Drupal USWDS sub-theme or deciding where a visual, structural, or behavioral customization belongs.
license: MIT
compatibility: Claude Code and OpenCode
metadata:
  audience: drupal-uswds-developers
  workflow: theme-customization
---

# Drupal USWDS Theme Overrides

Use this skill for Drupal USWDS customization and override-review tasks.

## Required guidance

Read the first available source before proposing or editing an override:

1. `guides/uswds-theme-overrides.md` in the current repository
2. `https://raw.githubusercontent.com/ednark/drupal-uswds-ai-components/main/guides/uswds-theme-overrides.md`

Treat that guide as the canonical policy. This skill defines the execution workflow.

## Workflow

1. Inspect the target project's theme inheritance, libraries, Sass entry point, templates, theme hooks, module libraries, and build commands.
2. Query the USWDS design registry to select the component and supported variant.
3. Query the Drupal-USWDS registry to identify the supported implementation type.
4. Read the selected tile's `useWhen`, `avoidWhen`, `agentPrompt`, `preserveElements`, `editableAreas`, and `knownLimitations` fields. For schema v2, use the corresponding `selection`, `instruction`, and `constraints` fields.
5. Classify the requested change.
6. Select the lowest appropriate override layer.
7. Implement or recommend the smallest scoped change.
8. Verify preserved semantics, accessibility behavior, build output, and project tests.

## Override classification

Use this order:

1. Existing USWDS component, variant, or utility
2. USWDS Sass setting or design token
3. Scoped custom Sass or CSS
4. CSS custom property for a runtime value
5. Drupal render array, preprocess hook, or form alter
6. Specific Twig template override
7. Drupal JavaScript behavior
8. Inline style only under an approved exception

Do not skip directly to Twig because a paragraph bundle is unavailable.

## Hard rules

- Never edit `node_modules`, `vendor`, contributed modules, contributed themes, compiled CSS, or generated/minified JavaScript.
- Never remove or alter registry `preserveElements` or `portableInvariants` to satisfy an adaptation request.
- Never replace USWDS keyboard, focus, ARIA, reduced-motion, forced-colors, or JavaScript behavior without a demonstrated defect and regression coverage.
- Avoid broad `.usa-*`, ID, and element selectors for product-specific styles.
- Avoid inline styles. Prefer a scoped class or a single sanitized CSS custom property for genuinely dynamic values.
- Inspect the upstream template before creating a Twig override.
- Keep business logic and data access out of theme hooks and Twig.
- Keep feature-critical behavior with the module that owns the feature.

## Drupal placement

- Global visual system changes: the sub-theme's USWDS settings partial
- Component inclusion: the Sass entry point
- Product presentation: scoped custom Sass partial
- Runtime value: declared custom property consumed by a scoped selector
- Classes and attributes: render arrays, preprocess, or form alter
- Required semantic structure: the most specific Twig override
- Feature interaction: module library using Drupal behaviors and `once()`
- Generated output: rebuild it; never edit it directly

## Twig override gate

Before recommending Twig, confirm all are true:

- Existing component and variant support is insufficient.
- Render arrays or preprocess cannot express the requirement safely.
- The active base template has been inspected.
- The override uses the most specific template suggestion available.
- Required USWDS classes, semantic elements, and ARIA relationships are documented.
- The project has a plan to compare the override after upstream updates.

## Verification

Discover and run the target project's actual commands. At minimum verify:

- Theme build
- Sass and JavaScript lint
- Drupal coding standards when available
- Drupal cache rebuild
- Automated accessibility checks
- Keyboard operation
- Screen-reader behavior for changed interaction
- Responsive zoom, reduced motion, and forced-colors where relevant

Report:

1. The selected component and registry tiles
2. The chosen override layer and why lower layers were insufficient
3. Files changed or recommended
4. Preserved elements and behaviors
5. Verification performed
6. Remaining risks or required manual tests
