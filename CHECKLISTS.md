# CHECKLISTS — Checklists de Revisão de Componentes

Checklists padronizadas para revisão de skills, subagents e primary agents do RDD.

> **Gate obrigatório:** as skills `rdd-skill-creator`, `rdd-subagent-creator`
> e `rdd-primary-agent-creator` executam a checklist correspondente como
> passo final de criação e registram o resultado no IMP do
> `WORKFLOW_IMPROVEMENTS.md`. Falha em item obrigatório bloqueia o
> fechamento da criação.
>
> **Convenção de smoke test:** toda IMP que cria ou altera componente com
> comportamento ganha seção "Validação" no `WORKFLOW_IMPROVEMENTS.md`
> (execução real ou teste de mesa, com resultado PASS/FAIL e evidência)
> antes de publicar. Item estrutural sem comportamento observável pode ser
> validado apenas pela checklist (marcado como "estrutural, sem smoke").

---

## Checklist para Nova Skill

### Front Matter
- [ ] `name:` == nome da pasta, lowercase-hyphen, ≤ 64 chars
- [ ] `name:` usa prefixo `rdd-` (exceção: skills externas `prj-test-generator`, `prj-*`)
- [ ] `description:` explica o que faz + triggers ("Use quando...", palavras-chave)
- [ ] **Sem campo `tools:`** — proibido; o campo correto é `permission:` (na skill, permissões são do agent que a invoca)

### Seções Obrigatórias
- [ ] `## Lê (upstream)` — caminhos (IMP-011: subpasta primeiro, fallback raiz)
- [ ] `## Gera (downstream)` — caminhos IMP-011
- [ ] `## Nunca edita`
- [ ] `## Tools`
- [ ] `## Modo de erro` — continue / warn / strict explícito
- [ ] `## Algoritmo` ou `## Workflow` — passos numerados com critérios verificáveis
- [ ] `## Template` (quando gera artefato)
- [ ] `## Formato de commit`
- [ ] `## Casos de Borda`

### Permissões e Escopo
- [ ] Permissões mínimas necessárias (menor privilégio)
- [ ] Nenhum path de máquina hardcoded (portabilidade — IMP-016)
- [ ] Caminhos de leitura seguem IMP-011 (subpasta primeiro, fallback raiz)

### Conteúdo
- [ ] Template completo (sem placeholders sem resposta)
- [ ] Casos de borda documentados
- [ ] PT-BR, linguagem clara

### Registro
- [ ] Registrada em `ARCHITECTURE.md` (seção §5 correspondente + §6 se aplicável)
- [ ] Registrada na tabela "Skills disponíveis" do orchestrator do domínio (se tiver)
- [ ] `WORKFLOW_IMPROVEMENTS.md` atualizado (IMP-XXX)

### Validação (gate)
- [ ] Checklist executada como passo final do `rdd-skill-creator` — resultado registrado no IMP
- [ ] Smoke test ou teste de mesa registrado no IMP (se comportamento observável)

---

## Checklist para Novo Subagent

### Front Matter
- [ ] `name:` == nome do arquivo, lowercase-hyphen, ≤ 64 chars, prefixo `rdd-`
- [ ] `description:` com gatilhos de descoberta ("Use para...")
- [ ] `mode: subagent`
- [ ] `temperature: 0.1` (precisão) ou `0.2` (criativo)
- [ ] **NUNCA campo `tools:`** (proibido — não existe na schema; use `permission:`)
- [ ] `skill: allow` se invoca skills (com tabela "Skills disponíveis")

### Permissões
- [ ] `read: allow` (sempre)
- [ ] `edit`/`write`: **nunca `allow` amplo** — `deny`, `ask` ou restrito a caminho
- [ ] `bash: ask` (se preciso; nunca `allow` amplo em subagent)
- [ ] Permissão mínima necessária (menor privilégio)
- [ ] **Nenhum path de máquina hardcoded** (portabilidade — IMP-016; paths vão no `opencode.jsonc` local via `rdd-setup`)

### Seções Obrigatórias
- [ ] Identidade em 1-2 linhas logo após o front matter
- [ ] `## Princípios`
- [ ] `## Lê (upstream)` / `## Gera (downstream)` / `## Nunca edita`
- [ ] `## Skills disponíveis` (tabela, se invoca skills — todas existentes)
- [ ] `## Tools disponíveis` (informativo — enforcement no `permission:`)
- [ ] `## Algoritmo` — passos com critérios verificáveis
- [ ] `## Formato de saída` (saída compacta, orientada a relatório)
- [ ] `## Casos de Borda`

### Referências Cruzadas
- [ ] Todas as skills invocadas existem em `~/.config/opencode/skills/`
- [ ] Todas as skills registradas em `ARCHITECTURE.md` (tabela de skills)
- [ ] Subagents referenciados existem

### Registro
- [ ] Registrado em `ARCHITECTURE.md` (diagramas L1/L2/L3 + tabelas)
- [ ] Registrado na tabela de subagents do primary que o invoca
- [ ] `WORKFLOW_IMPROVEMENTS.md` atualizado (IMP-XXX)

### Validação (gate)
- [ ] Checklist executada como passo final do `rdd-subagent-creator`; resultado no IMP
- [ ] Smoke test registrado no IMP (execução real ou teste de mesa, PASS/FAIL + evidência)

---

## Checklist para Novo Primary Agent

### Front Matter
- [ ] **SEM campo `name:`** — o nome vem do arquivo (convenção dos primary agents RDD)
- [ ] `description:` em 1-2 linhas (domínio + quando usar)
- [ ] `mode: primary`
- [ ] `temperature: 0.3`
- [ ] Permissão ampla (todas allow) — blast-radius aceito e documentado

### Seções Obrigatórias
- [ ] Identidade e propósito
- [ ] Regras de precedência (hierarquia AGENTS.md)
- [ ] Início de sessão
- [ ] `### Subagents` — tabela apenas dos que REALMENTE invoca
- [ ] Roteamento de domínio
- [ ] Comportamento

### Referências Cruzadas
- [ ] Todos os subagents listados existem como arquivo
- [ ] Skills invocadas diretamente existem
- [ ] Sem referência a componente inexistente (bottom-up: subagents criados antes do primary)

### Registro
- [ ] Registrado em `ARCHITECTURE.md` (diagramas + §3 tabela de primaries)
- [ ] Registrado no AGENTS.md global (seção Primary agents + modelo de permissão + Como Começar)
- [ ] `WORKFLOW_IMPROVEMENTS.md` atualizado (IMP-XXX)

### Validação (gate)
- [ ] Checklist executada como passo final do `rdd-primary-agent-creator`; resultado no IMP
- [ ] Smoke test da sessão/delegação registrado no IMP

---

## Checklist para Atualização de AGENTS.md

### Antes de Editar
- [ ] Motivo da mudança está claro
- [ ] Mudança está fundamentada (ADR ou IMP)
- [ ] Não conflita com decisões existentes

### Durante a Edição
- [ ] Mantém formatação consistente
- [ ] Não remove conteúdo sem destino (IMP-048): remover só é permitido se o conteúdo estiver obsoleto (agente/ferramenta inexistente) ou movido para arquivo referenciado (ex: `rules/*.md`) — nunca apague regra viva
- [ ] Atualiza seções relacionadas se necessário

### Após Editar
- [ ] `DECISIONS.md` atualizado (se decisão nova)
- [ ] `WORKFLOW_IMPROVEMENTS.md` atualizado (se correção)
- [ ] Outros arquivos afetados atualizados (ARCHITECTURE.md, etc.)
- [ ] Índice lazy compatível (IMP-048): toda entrada `rules/*.md` no índice existe e todo `rules/*.md` está no índice
- [ ] AGENTS.md é local (gitignored) — mudanças não vão para o remote; verificar se o padrão versionado correspondente (ex: skill de setup) cobre a mesma instrução

---

## Checklist para Revisão de Artefato RDD

### Estrutura
- [ ] Artefato existe no local esperado (IMP-011)
- [ ] Nome segue convenção
- [ ] Seções obrigatórias presentes

### Conteúdo
- [ ] IDs únicos e não renumerados
- [ ] Referências corretas
- [ ] Formatação consistente

### Rastreabilidade
- [ ] Toda RN tem downstream correspondente
- [ ] Nenhum ID quebrado ou órfão
- [ ] CRs aprovados refletidos

### Validação
- [ ] `rdd-validate` executado sem erros
- [ ] `rdd-wiki-lint` limpo ou findings justificados
- [ ] `VALIDATION_REPORT.md` está limpo ou findings justificados

---

## Checklist para Publicação (rdd-core-publish)

### Antes de Publicar
- [ ] Validação registrada no IMP correspondente (checklist + smoke, se aplicável)
- [ ] Escopo versionado correto (`agents/rdd-*.md`, `skills/rdd-*/SKILL.md`, `ARCHITECTURE*.md`, `WORKFLOW_IMPROVEMENTS.md`)
- [ ] Nenhum path de máquina em arquivo versionado (portabilidade — IMP-016)
- [ ] Nenhum arquivo sensível no staging

### Durante a Publicação
- [ ] Escopo classificado sem pergunta (Passo 1) — publicável vs fora do escopo
- [ ] Golden Set Gate + Health Gate executados (automáticos e bloqueantes)
- [ ] Decisão única (IMP-090): fluxo feliz = 0 perguntas; anomalia = 1 question consolidada (pacote: temas + arquivos + mensagens + push)
- [ ] `git pull --ff-only` executado com sucesso
- [ ] `git push origin main` executado (nunca `--force`)

### Após Publicar
- [ ] OpenCode reiniciado (config não é hot-reloaded)
- [ ] Outros ambientes: executarão `rdd-setup` para paths locais + `rdd-core-update`
- [ ] `WORKFLOW_IMPROVEMENTS.md` atualizado (se melhoria)

---

*Estas checklists são mantidas pela Quadri RDD (rdd-req, rdd-doc, rdd-dev, rdd-devops) e pelos creator skills. Para dúvidas, consulte o `CONTRIBUTING.md`.*
