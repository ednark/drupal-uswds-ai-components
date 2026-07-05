# How to Use These Registries with an LLM

## Approach 1: Direct Fetch (Simplest)

Just tell your AI agent in conversation:

```
Fetch https://raw.githubusercontent.com/ednark/uswds-ai-components/main/agents.json
and use it as a component registry. When I ask for a UI component,
query the index, filter by section, fetch the tile, and read the
embedded uswds-agent-meta JSON for adaptation guidance.

For Drupal implementation details, also fetch:
https://raw.githubusercontent.com/ednark/drupal-uswds-ai-components/main/agents.json
```

The agent will fetch the manifest, learn the protocol, and start querying.

## Approach 2: AGENTS.md (Project-Level)

Copy `templates/AGENTS.md` into your Drupal project root:

```bash
cp https://raw.githubusercontent.com/ednark/drupal-uswds-ai-components/main/templates/AGENTS.md \
   /path/to/your-drupal-project/AGENTS.md
```

Opencode reads `AGENTS.md` automatically on startup. The file tells the agent
about both registries, the workflow, and the rules. Works with any AI tool
that reads AGENTS.md (opencode, Cursor, Claude Code, Windsurf, Codex).

## Approach 3: opencode Skill (Global)

Install the skill so it works across all projects:

```bash
# Create the global skills directory
mkdir -p ~/.config/opencode/skills/uswds-registry

# Download the skill
curl -s https://raw.githubusercontent.com/ednark/drupal-uswds-ai-components/main/templates/opencode-skill/SKILL.md \
  -o ~/.config/opencode/skills/uswds-registry/SKILL.md
```

Restart opencode. The skill auto-triggers when you mention USWDS components,
government websites, or Drupal theming.

## Approach 4: opencode References (Context)

Add the repos as references in your project's `opencode.json`:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "references": {
    "uswds-design": {
      "repository": "ednark/uswds-ai-components",
      "description": "USWDS component patterns and adaptation guidance"
    },
    "uswds-drupal": {
      "repository": "ednark/drupal-uswds-ai-components",
      "description": "Drupal implementation for USWDS components"
    }
  }
}
```

The agent can then `@uswds-design` or `@uswds-drupal` to browse the repos
as supporting context.

## Approach 5: MCP Server (Most Integrated)

For live Drupal site integration, install the [Drupal MCP module](https://drupal.org/project/mcp)
on your Drupal site. This exposes your site's content types, views, and config
as MCP tools that the agent can query at runtime.

Combined with the registries above, the agent can:
1. Query the USWDS registry → know which component to use
2. Query the Drupal registry → know which module/paragraph/Twig to use
3. Query the live Drupal site via MCP → see what's installed and configured
4. Make changes via Drush or config import

## Verification

Test that the registries are accessible:

```bash
# Check the manifests
curl -s https://raw.githubusercontent.com/ednark/uswds-ai-components/main/agents.json | jq .name
curl -s https://raw.githubusercontent.com/ednark/drupal-uswds-ai-components/main/agents.json | jq .name

# Check the indexes
curl -s https://raw.githubusercontent.com/ednark/uswds-ai-components/main/infinite/components.index.json | jq .counts.total
curl -s https://raw.githubusercontent.com/ednark/drupal-uswds-ai-components/main/infinite/components.index.json | jq .counts.total
```
