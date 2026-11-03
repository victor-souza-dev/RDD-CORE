[![English](https://img.shields.io/badge/lang-English-brightgreen.svg)](CONTRIBUTING.en.md)
[![Português](https://img.shields.io/badge/lang-Portugu%C3%AAs-blue.svg)](CONTRIBUTING.md)

# CONTRIBUTING — Open Core of the RDD Workflow

> **Note:** the PT-BR version (`CONTRIBUTING.md`) is the canonical and most
> complete guide. This English version covers everything needed to contribute
> to the open core.

## Open Core: how it works

Development happens in the **private** `TM.CORE.RDD` repository — that's where
internal contributors create skills, subagents and improvements. Public
releases are **clean snapshots** of the "essential subset" (agents, skills,
registry, templates, evals and contribution docs) published to the **public**
repository `victor-souza-dev/RDD-CORE`.

External contributions come in via **PR to `rdd-core`** (public). Maintainers
port the accepted contribution to `TM.CORE.RDD` (private) and publish the next
release. Internal history (IMP, ADR, quality, reports) never appears in the
public repository — each release is a snapshot, not a mirror of the internal
git.

## Contributing (external)

Flow for external contributors:

1. **Fork** `rdd-core`.
2. Create a **branch** for your change.
3. Make a **generalized and anonymized** change — no client-specific content
   (client knowledge belongs to packs, which are private).
4. Go through the **anonymization checklist** (below) — mandatory in the PR.
5. Run the gate locally: `bash evals/neutrality/scan.sh` — it must end with
   `neutrality: OK`. **PASS is a PR precondition.**
6. Commit with **DCO sign-off** (`git commit -s`) and open the **PR**.

> **Note:** skills and agents reference runtime paths (`rules/`, `packs/`,
> `.rdd/` etc.). PRs that change the component structure break
> `registry.yaml` — in that case the PR must include the view re-render
> (`rdd-registry-render` skill).

### Running your instance on Azure DevOps or GitLab?

The public repo lives on GitHub — but nothing stops your private RDD instance
from running on another platform (Azure DevOps, GitLab, self-hosted). Keep two
environments with distinct roles:

- **Private instance (Azure DevOps/GitLab):** your organization layer —
  packs, client profiles, knowledge nuances. Day-to-day runs here.
- **GitHub fork:** the contribution bridge — it's the only place an
  improvement enters the open core (via PR, with the evals CI as gate).

### Generic improvement? Contribute it back

Improvements to the ENGINE (skills, agents, scripts, generic T1 knowledge)
should go to your GitHub fork and become a PR to `rdd-core` — same flow as
the external contributors above (anonymization + neutrality + DCO). If the
improvement was born inside your private instance, extract it to a clone of
your fork and apply it to the generic subset: what's specific to your
organization stays in your private layer; what's generic goes back to
everyone.

### Syncing your instance with public releases

The snapshot model makes it easy: every public release is a complete, clean
state of the generic subset. In your private instance, add the public repo as
a remote and absorb releases via selective diff/merge of the subset:

```bash
git remote add upstream https://github.com/victor-souza-dev/RDD-CORE.git
git fetch upstream
# compare the subset (agents/, skills/, knowledge/...) with your layer and
# selectively absorb what makes sense for your organization
```

> **Rule of thumb:** generic engine improvement → up to the public repo (PR).
> Client/org content → stays in your private layer (never goes up).

## Anonymization checklist (mandatory in the PR)

Check each item. **Any "yes" → generalize or don't submit the PR.**

- [ ] Contains real client, organization or product names?
- [ ] Contains real URLs, domains or e-mails?
- [ ] Contains people's names?
- [ ] Contains process, contract numbers, CNPJ/CPF or registry IDs?
- [ ] Contains internal system codenames or client repo prefixes?
- [ ] Contains network paths, IPs or credentials/tokens (even truncated)?
- [ ] Contains screenshots or diagrams with branding?
- [ ] Contains dates + facts that identify a client?

## DCO (Developer Certificate of Origin)

Every commit needs a `Signed-off-by` — use `git commit -s`. By signing, you
certify you have the right to submit the contribution under the project's
license, per the [Developer Certificate of Origin](https://developercertificate.org/).

**We don't use a CLA** — the only barrier to contributing is the DCO sign-off.

## Promoting patterns (pack → hub)

Patterns validated in real projects can be promoted from the pack's pattern
library (`accumulation/patterns/`) to the `rdd-core` public hub `patterns/` —
the destination for generalized, anonymized patlets.

**Promotion flow:**

1. **Generalize + anonymize** — apply the anonymization checklist above. The
   patlet must not carry client content.
2. **Neutrality scan** — `bash evals/neutrality/scan.sh` must end with
   `neutrality: OK` (PR precondition).
3. **PR with the patlet** — format in `patterns/TEMPLATE.md`; CI validates the
   front matter with `bash patterns/validate.sh`. The PR carries the
   anonymization checklist and the explicit warranty acceptance (item 5).
4. **Shepherd** — a reviewer from a company **different from the origin**
   evaluates applicability and generalization before validation (PLoP model).
5. **30-day warranty** — on acceptance, `warranty_ate = acceptance date +
   30 days`; the origin company fixes pattern regressions in that period
   (InnerSource model). The promotion PR includes explicit acceptance of this
   commitment.
6. **Acceptance** — gates green + shepherd OK → pattern enters
   `patterns/INDEX.md` with `accepted` status.

**Lifecycle** (`proposed → validated → accepted → superseded`): documented in
`patterns/TEMPLATE.md`; local validation with `bash patterns/validate.sh`.

**Standing decisions (2026-10-26 proposal):**

- **Single maintainer in the MVP** — merges to `rdd-core` approved by
  TechMinds (single TC; TC federation per domain when the 2nd company
  contributes).
- **Named provenance with opt-in** — `origem` and `projetos_validacao`
  identify company and validation projects; `anonimo` is a valid option.
- **Fixed 30-day warranty** — equal for every accepted pattern.

---

# Contributing components to the RDD Workflow

> The PT-BR version covers this part in more depth. Condensed guide for
> creating new skills, subagents or workflow improvements.

## Overview

The RDD workflow has three component types:

| Component | What it is | Where it lives | Example |
|------------|---------|-----------|---------|
| **Primary Agent** | Active session persona | `agents/<name>.md` | `rdd-req.md`, `rdd-doc.md`, `rdd-dev.md` |
| **Subagent** | Domain orchestrator | `agents/<name>.md` | `@rdd-intake-orchestrator` |
| **Skill** | Reference knowledge | `skills/<name>/SKILL.md` | `rdd-requirements` |

## Prerequisites

1. **Know RDD**: read `AGENTS.md`, `ARCHITECTURE.md` and `CHECKLISTS.md`
2. **Have access to the RDD workflow repository** (`main` branch)
3. **Know OpenCode**: front matter, tools, permissions
4. **Available tools**: `@rdd-workflow-builder` (creates components),
   `@rdd-workflow-improver` (fixes workflows)

## Contribution flow

1. **Identify the need** — does it already exist? (`ARCHITECTURE.md` §1-§3).
   Bug → `@rdd-workflow-improver`. Improvement → register in
   `WORKFLOW_IMPROVEMENTS.md` first (IMP-XXX format).
2. **Scope the role** — what it does, which domain, who invokes it, which
   skills it uses.
3. **Create the component** — meta-skills: `rdd-skill-creator` (new skill),
   `rdd-subagent-creator` (new subagent), `rdd-primary-agent-creator` (new
   primary). Prefer `@rdd-workflow-builder`, which automates the flow.
4. **Register in the map** — `ARCHITECTURE.md` sections + Mermaid diagram +
   `registry.yaml` (see PT-BR guide for the exact registration table).
5. **Test** — run the component in isolation, check skill invocations and
   permissions, validate with `rdd-validate` if applicable.
6. **Publish** — register the improvement in `WORKFLOW_IMPROVEMENTS.md`
   (IMP-XXX with **Author**), use `rdd-core-publish` for commit + push.

## Naming conventions

- Skills: `rdd-<action>` — ex.: `rdd-requirements`, `rdd-data-model`,
  `rdd-validate`
- Subagents: `@rdd-<domain>-orchestrator` — ex.: `@rdd-intake-orchestrator`;
  self-contained exceptions: `@rdd-next`, `@rdd-progress`,
  `@rdd-cr-propagation-guard`
- Primary agents: `rdd-<role>` — ex.: `rdd-req`, `rdd-doc`, `rdd-dev`

## Skill structure

```yaml
---
name: rdd-<name>
description: <short description>
---

# rdd-<name>

## Reads (Lê)
## Generates (Gera)
## Never edits (Nunca edita)
## Tools
## Error mode (Modo de erro)
## Algorithm / Workflow
## Template
## Commit format
```

Section names are PT-BR in the shipped files (`Lê`, `Gera`,
`Nunca edita`...) — keep the structure; new components follow the same
section order. Full template in the PT-BR guide.