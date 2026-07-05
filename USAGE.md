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

Each repo ships an `AGENTS.md` at the root. Copy the one you need into your project:

```bash
# For USWDS design knowledge:
curl -s https://raw.githubusercontent.com/ednark/uswds-ai-components/main/AGENTS.md \
  -o /path/to/your-project/AGENTS.md

# For Drupal + USWDS:
curl -s https://raw.githubusercontent.com/ednark/drupal-uswds-ai-components/main/AGENTS.md \
  -o /path/to/your-drupal-project/AGENTS.md
```

Opencode reads `AGENTS.md` automatically on startup. The file tells the agent
about both registries, the workflow, and the rules. Works with any AI tool
that reads AGENTS.md (opencode, Cursor, Claude Code, Windsurf, Codex).

## Approach 3: opencode Skill (Repo-Local or Global)

Each repo ships a skill in `.opencode/skills/`:

- `uswds-ai-components/.opencode/skills/uswds-design/SKILL.md` — USWDS design knowledge
- `drupal-uswds-ai-components/.opencode/skills/uswds-registry/SKILL.md` — USWDS + Drupal combined

### Use from within the repo (automatic)

If you're working inside a clone of either repo, opencode discovers the skill
in `.opencode/skills/` automatically.

### Install globally (works across all projects)

```bash
# USWDS design skill
mkdir -p ~/.config/opencode/skills/uswds-design
curl -s https://raw.githubusercontent.com/ednark/uswds-ai-components/main/.opencode/skills/uswds-design/SKILL.md \
  -o ~/.config/opencode/skills/uswds-design/SKILL.md

# USWDS + Drupal combined skill
mkdir -p ~/.config/opencode/skills/uswds-registry
curl -s https://raw.githubusercontent.com/ednark/drupal-uswds-ai-components/main/.opencode/skills/uswds-registry/SKILL.md \
  -o ~/.config/opencode/skills/uswds-registry/SKILL.md
```

Restart opencode. The skill auto-triggers when you mention USWDS components,
government websites, or Drupal theming.

## Approach 4: opencode Agents (Subagents)

Each repo ships agent definitions in `.opencode/agents/`:

- `uswds-ai-components/.opencode/agents/uswds-design-agent.md` — design specialist
- `drupal-uswds-ai-components/.opencode/agents/uswds-drupal-agent.md` — Drupal implementation specialist

These are subagents you can invoke via `@uswds-design-agent` or
`@uswds-drupal-agent` in opencode. They have the registry URLs baked into
their system prompts.

### Use from within the repo

If you're working inside a clone, opencode discovers the agents automatically.

### Use in any project

Copy the agent files into your project:

```bash
mkdir -p /path/to/your-project/.opencode/agents
curl -s https://raw.githubusercontent.com/ednark/uswds-ai-components/main/.opencode/agents/uswds-design-agent.md \
  -o /path/to/your-project/.opencode/agents/uswds-design-agent.md
curl -s https://raw.githubusercontent.com/ednark/drupal-uswds-ai-components/main/.opencode/agents/uswds-drupal-agent.md \
  -o /path/to/your-project/.opencode/agents/uswds-drupal-agent.md
```

## Approach 5: opencode.json (References + Config)

Each repo ships an `opencode.json` that registers the other repos as references:

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

Copy this into your project's `opencode.json` or merge it with your existing config.
The agent can then `@uswds-design` or `@uswds-drupal` to browse the repos.

## Approach 6: MCP Server (Live Drupal Integration)

For live Drupal site integration, install the [Drupal MCP module](https://drupal.org/project/mcp)
on your Drupal site. This exposes your site's content types, views, and config
as MCP tools that the agent can query at runtime.

Combined with the registries above, the agent can:
1. Query the USWDS registry → know which component to use
2. Query the Drupal registry → know which module/paragraph/Twig to use
3. Query the live Drupal site via MCP → see what's installed and configured
4. Make changes via Drush or config import

## File Inventory

### drupal-uswds-ai-components repo

| File | Purpose |
|------|---------|
| `AGENTS.md` | Project-level agent instructions |
| `USAGE.md` | This guide |
| `opencode.json` | opencode config with references |
| `.opencode/skills/uswds-registry/SKILL.md` | Global skill (USWDS + Drupal combined) |
| `.opencode/agents/uswds-drupal-agent.md` | Subagent for Drupal implementation |
| `templates/AGENTS.md` | Template for copying into Drupal projects |

### uswds-ai-components repo

| File | Purpose |
|------|---------|
| `AGENTS.md` | Project-level agent instructions |
| `opencode.json` | opencode config with references |
| `.opencode/skills/uswds-design/SKILL.md` | Skill for USWDS design knowledge |
| `.opencode/agents/uswds-design-agent.md` | Subagent for USWDS design |

## Verification

Test that the registries are accessible:

```bash
# Check the manifests
curl -s https://raw.githubusercontent.com/ednark/uswds-ai-components/main/agents.json | jq .name
curl -s https://raw.githubusercontent.com/ednark/drupal-uswds-ai-components/main/agents.json | jq .name

# Check the indexes
curl -s https://raw.githubusercontent.com/ednark/uswds-ai-components/main/infinite/components.index.json | jq .counts.total
curl -s https://raw.githubusercontent.com/ednark/drupal-uswds-ai-components/main/infinite/components.index.json | jq .counts.total

# Check the skills are accessible
curl -s https://raw.githubusercontent.com/ednark/uswds-ai-components/main/.opencode/skills/uswds-design/SKILL.md | head -1
curl -s https://raw.githubusercontent.com/ednark/drupal-uswds-ai-components/main/.opencode/skills/uswds-registry/SKILL.md | head -1

# Check the agents are accessible
curl -s https://raw.githubusercontent.com/ednark/uswds-ai-components/main/.opencode/agents/uswds-design-agent.md | head -1
curl -s https://raw.githubusercontent.com/ednark/drupal-uswds-ai-components/main/.opencode/agents/uswds-drupal-agent.md | head -1
```
