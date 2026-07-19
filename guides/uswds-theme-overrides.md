# Drupal USWDS Theme Override Guide

## Purpose

This guide defines how to customize a Drupal sub-theme based on USWDS without unnecessarily replacing design-system behavior, weakening accessibility, or creating an expensive upgrade path.

The governing principle is:

> Use USWDS as the default. Override the smallest stable layer that expresses the requirement while preserving USWDS semantics, accessibility behavior, component structure, and upgrade compatibility.

## Decision order

Use the first layer that can satisfy the requirement.

| Priority | Mechanism | Use for | Do not use for |
|---:|---|---|---|
| 1 | Existing USWDS component, variant, or utility | Standard components, layout, spacing, responsive behavior, and states | Recreating an existing USWDS pattern |
| 2 | USWDS Sass setting or design token | System-wide color, typography, focus, spacing, radius, width, and component settings | One-page or one-component adjustments |
| 3 | Scoped custom Sass or CSS | Product-specific presentation not supported by a setting or utility | Reimplementing USWDS component internals |
| 4 | CSS custom property | Runtime values and intentionally dynamic theme values | Creating a second token system parallel to USWDS Sass |
| 5 | Drupal render array, preprocess hook, or form alter | Classes, attributes, libraries, and presentation variables | Business logic, substantial HTML, or visual values |
| 6 | Twig template override | Necessary semantic or structural markup changes | Changes that CSS, utilities, or preprocess can express |
| 7 | Drupal JavaScript behavior | Product interaction that USWDS does not provide | Styling or replacing existing USWDS interaction |
| 8 | Inline style | Exceptional sanitized, data-calculated values only | Colors, spacing, typography, layout, states, or fixes |

## What may be overridden

### Global design decisions

Use documented USWDS Sass settings and tokens for changes that should affect the entire site:

- Brand and semantic colors
- Link colors
- Font families, weights, and type scale
- Focus color, width, style, and offset
- Grid and container widths
- Component radius and border settings
- Asset paths
- Enabled USWDS packages and utilities

Treat a token change as a system-wide decision. Test every affected component state, including hover, active, disabled, focus, forced-colors, high contrast, and responsive layouts.

### Product-specific presentation

Use scoped custom Sass or CSS for:

- Application-specific composition
- A product visual treatment with no supported USWDS setting
- A narrowly scoped compatibility patch
- A custom application state not represented by a USWDS variant

Use a product namespace such as `.case-search__results`. Avoid IDs, element selectors, and broad overrides such as `.usa-form` unless the intent is explicitly system-wide and regression-tested.

### Drupal markup integration

Use render arrays, preprocess hooks, and form alters to:

- Add existing USWDS classes to Drupal-generated markup
- Add semantic attributes expressible through Drupal attributes
- Supply simple presentation variables
- Attach component libraries conditionally
- Normalize Drupal output before rendering

Keep business rules, data access, workflow decisions, and service calls in modules or services.

### Structural markup

Override Twig only when Drupal or the base theme cannot emit the required semantic structure. Valid reasons include:

- Correcting invalid element hierarchy
- Adding a necessary landmark or accessible relationship
- Producing a required USWDS wrapper
- Removing a wrapper that breaks component semantics
- Implementing a documented component pattern unavailable through render arrays

Inspect the active base template first. Record why preprocess or render arrays are insufficient and which upstream elements must remain intact.

## What should not be overridden

Do not replace these without a demonstrated defect, documented reason, and regression tests:

- Semantic HTML required by the component
- ARIA names, states, properties, and relationships
- Keyboard interaction
- Focus trapping, focus movement, and focus return
- Forced-colors and reduced-motion support
- Disabled, hover, active, and focus behavior
- Required `.usa-*` component structure
- USWDS JavaScript lifecycle
- Standard government banner and identifier structure
- USWDS utility definitions
- Drupal core or contributed-theme source files
- Files under `node_modules` or `vendor`
- Generated CSS or minified JavaScript

The component registry's `constraints.preserve` and `constraints.portableInvariants` fields are hard boundaries. `constraints.editable` identifies preferred modification points. An implementation request never overrides preserved accessibility or semantic requirements.

## Placement rules

### USWDS Sass settings

Place global design-system configuration in the sub-theme's USWDS settings partial, commonly `_uswds-theme.scss` or the equivalent established by the theme build.

Rules:

- Use documented USWDS setting names.
- Prefer USWDS token names over raw hex, pixel, and font values.
- Configure settings before forwarding USWDS packages.
- Never modify the installed USWDS package.

### Sass entry point

Keep the Sass entry point small:

1. Configure USWDS settings.
2. Load only required USWDS packages.
3. Load project partials last.

The entry point is a dependency manifest, not a location for component styling.

### Custom Sass and CSS

Organize custom source by responsibility, for example:

```text
sass/
├── _uswds-theme.scss
├── styles.scss
└── custom/
    ├── _index.scss
    ├── _application.scss
    ├── _content.scss
    └── _compatibility.scss
```

Prefer USWDS spacing, color, type, and shadow functions where suitable. Scope compatibility patches to the smallest component and document the upstream version or issue that requires the patch.

Never edit compiled CSS directly.

### CSS custom properties

USWDS is primarily Sass-token driven. Use CSS custom properties only when a value must change at runtime, is supplied as sanitized data, or intentionally supports runtime tenant or color-mode selection.

Do not mirror existing `$theme-*` settings into an independent custom-property token system.

### Module CSS versus theme CSS

A Drupal module should own behavior-critical presentation required for the feature to remain usable under another theme. The theme should own branding and site-specific visual treatment.

Use this test:

> Would the feature stop functioning under another theme?

If yes, the required rule belongs with the module. If it would remain usable but look less branded, the rule belongs with the theme.

### Twig templates

Keep overrides in the sub-theme's established templates directory and use the most specific Drupal template suggestion that solves the requirement.

For every override, record:

1. The base template being replaced
2. The requirement that cannot be met through render arrays or preprocess
3. The USWDS and accessibility contracts that must be preserved
4. The upstream version used for comparison

Full-page and base component overrides have the highest maintenance cost. Review them whenever Drupal core, the base theme, or USWDS changes.

### Preprocess hooks and form alters

Use theme PHP for classes, attributes, library attachment, and small presentation variables. Do not place colors, dimensions, HTML fragments, data access, or business logic in theme hooks.

Prefer dependency-injected module services when logic grows beyond presentation adaptation.

### JavaScript

Use Drupal behaviors and `once()` for project-specific interaction. Feature-specific behavior belongs with the module that owns the feature.

Do not fork USWDS JavaScript for a visual change, attach duplicate listeners to a USWDS component, or manually manage ARIA state already controlled by USWDS.

### Inline styles

Inline styles are prohibited by default. A narrow exception may be made for a sanitized, data-calculated value that cannot be represented by a class. Prefer exposing a single custom property instead of an arbitrary declaration block.

Do not inline colors, focus styles, responsive layout, typography, visibility, component states, or z-index fixes.

## Component registry workflow

Before implementing an override:

1. Query the USWDS design registry to select the correct component and variant.
2. Query the Drupal-USWDS registry for the supported implementation type.
3. Read the selected tile's `selection.useWhen` and `selection.avoidWhen`.
4. Read `constraints.preserve`, `constraints.portableInvariants`, `constraints.editable`, and `constraints.limitations`.
5. Classify the change using the decision order in this guide.
6. Implement the smallest scoped change.
7. Verify all preserved elements and behaviors remain intact.

When no contributed paragraph bundle exists, do not automatically create a Twig override. Evaluate, in order:

1. Existing Drupal or USWDS component support
2. Render arrays and attributes
3. Preprocess or form alteration
4. Theme settings and utilities
5. An existing base-theme template
6. A specific Twig override
7. A custom module when the requirement includes behavior or business logic

## Review checklist

### Before implementation

- The correct component and variant were retrieved from the registries.
- Existing utilities and settings were evaluated first.
- The override layer and ownership are documented.
- Preserved elements and portable invariants are identified.
- The base template was inspected before creating a Twig override.

### During implementation

- Vendor and generated files remain untouched.
- Selectors are product-scoped.
- USWDS tokens are used where suitable.
- Required semantics, classes, and ARIA relationships remain intact.
- JavaScript follows Drupal behaviors and does not duplicate USWDS behavior.
- No inline style was introduced without a documented exception.

### Verification

Run the project's established equivalents of:

- Theme build
- Sass and JavaScript lint
- Drupal coding standards
- Drupal cache rebuild
- Automated accessibility scan
- Keyboard-only test
- Screen-reader test for changed interactive behavior
- Responsive zoom and forced-colors review

A zero-result automated scan does not establish conformance. Manual keyboard and assistive-technology testing remain required.

## Exception policy

An exception must document:

- The requirement
- Why lower override layers are insufficient
- The affected component and upstream version
- Accessibility and upgrade risks
- Regression tests
- The condition for removing the exception

Temporary compatibility patches must not become undocumented permanent architecture.
