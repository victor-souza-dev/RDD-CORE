---
name: rdd-security-audit
description: >-
  Camada dedicada de security review do workflow RDD — revisão agêntica
  guiada pela base knowledge/security-review/KNOWLEDGE.md (OWASP ASVS 5.0.0,
  Top 10:2025, Secure Code Review Cheat Sheet). Dois modos: (a) dif — tria
  o diff de PR/task contra os princípios P-01..P-10 e produz findings
  classificados pela tabela de severidade da base (Crítico/Alto bloqueiam;
  Médio/Baixo viram pendência/backlog), como insumo para o veredito do
  rdd-dev-reviewer (eixo 3); (b) baseline — varredura do repo/módulo
  inteiro para onboarding de legado (fluxo reverse/rdd-doc), release maior
  ou pós-incidente, gravando quality/SECURITY_AUDIT_<timestamp>.md. Não é
  scanner automatizado; não emite veredito approve/request-changes (papel
  do rdd-dev-reviewer); nunca edita código nem base de conhecimento. Use
  quando o usuário pedir "security audit", "review de segurança",
  "auditoria de segurança", "security review do dif", "baseline de
  segurança" ou via rdd-dev-reviewer (eixo 3).
---
# rdd-security-audit — Security Review do RDD (dif e baseline)

Revisão de segurança **agêntica** guiada pela base canônica do domínio —
não é scanner automatizado. Aplica os princípios P-01..P-10, o checklist
de 18 itens e os anti-patterns AP-01..AP-08 da base
`knowledge/security-review/KNOWLEDGE.md` para produzir **findings
acionáveis** (arquivo:linha — princípio — severidade — evidência —
correção sugerida). Em modo dif, é o especialista do eixo 3 do
`rdd-dev-reviewer`; em modo baseline, é a varredura de referência para
sistemas legados no fluxo reverse do `rdd-doc`.

## Diferenciação

| Skill | Papel | Tempo | Profundidade |
|-------|-------|-------|--------------|
| `rdd-security-audit` (esta) | Especialista de segurança — findings com severidade | review pós-implementação (dif) e auditoria (baseline) | profunda — 10 princípios + 18 checks + 8 anti-patterns |
| `rdd-quality-gates` (§D) | Checklist largo de qualidade (KISS/SOLID/perf) + segurança rasa | implementação (executor) | superficial — tabela Top 10:2025 de referência |
| `rdd-dev-reviewer` | **Dono do veredito** approve/request-changes (5 eixos) | pré-PR | consumidor dos findings desta skill |
| `rdd-architecture` (SECURITY.md) | Artefato de design-time do módulo | tradução técnica | complementar — esta skill verifica o código contra ele + a base |

## Lê (upstream)

- **`~/.config/opencode/knowledge/security-review/KNOWLEDGE.md` — fonte
  canônica de critérios** (P-01..P-10, checklist de 18 itens, AP-01..AP-08,
  tabela de severidade; OWASP ASVS 5.0.0, Top 10:2025, Secure Code Review
  Cheat Sheet). Nenhum critério é improvisado fora dela.
- Modo dif: `git diff <base>...HEAD` do repo/worktree alvo + task
  (`delivery/**/RN-NNN — <título> — Feature.md`) e RNs em escopo
  (REQUIREMENTS.md §6) para contexto de regra de negócio
- Modo baseline: código-fonte do repo/módulo inteiro (read-only), com
  exclusões declaradas (vendor, migrations legadas, testes)
- `<modulo>/<projeto>/specs/SECURITY.md` — requisitos específicos do
  módulo (quando existir; conciliar com a base — conflito não é decidido
  aqui, é sinalizado)
- `<modulo>/<projeto>/specs/COMPLIANCE.md` — quando o módulo trata dado
  pessoal (charter `compliance: true`), cruza os findings de P-08/P-09 com
  os eixos LGPD (sinalização; veredito segue no rdd-dev-reviewer eixo 5)
- Playbook da stack carregado (quando existir) — vocabulário e pontos de
  integração típicos (ex.: onde vivem filtros de authZ no framework)

## Gera (downstream)

- Modo dif: **relatório de findings no chat** (insumo do veredito do
  `rdd-dev-reviewer`) — sem arquivo por padrão
- Modo baseline: **`quality/SECURITY_AUDIT_<timestamp>.md` no módulo**
  (padrão PERF_REPORT/DRIFT_REPORT) + resumo no chat
- Pendências/backlog de segurança priorizado (Médio/Baixo) para o dono do
  fluxo rotear

## Nunca edita

- Código-fonte e artefatos de módulo RDD (REQUIREMENTS.md, specs/**, etc.)
- Bases de conhecimento (`knowledge/**`) — atualização é papel do
  `rdd-domain-research`
- Veredito approve/request-changes e PR — quem decide e registra é o
  `rdd-dev-reviewer` / `rdd-gh-pr-creator`; esta skill é insumo
- `evals/golden-human/` (IMP-100)

## Tools

- `read`/`glob`/`grep` — base de conhecimento, diff, código, specs
- `bash` — somente leitura: `git diff/show/log/status`, `rg`, cmdlets de
  inspeção; `git commit`/`git push` nunca
- `write` — restrito a `quality/**` do módulo (modo baseline); em
  eval/sandbox, `SECURITY_AUDIT.md` na raiz do sandbox
- `question` — esclarecer escopo (range do dif, exclusões do baseline)

## Modo de erro

`strict` na fundação — base `knowledge/security-review/KNOWLEDGE.md`
ausente ou com `proxima_revisao` vencida → **não executa com critérios de
improviso**: reporte a lacuna e encerre indicando re-pesquisa via
`rdd-domain-research`.
`warn` no escopo — arquivo ilegível, git indisponível, linguagem sem
heurística mapeada → reduza o escopo, registre "não verificado" no
relatório e siga com o checklist aplicável. Findings não bloqueiam a skill
— classificam; o bloqueio é decisão do consumidor (rdd-dev-reviewer).

## Tabela de severidade (fonte: base, § Classificação/Severidade)

| Nível | Critério | Ação na triagem |
|-------|----------|-----------------|
| Crítico | Explorável remotamente sem credencial: injection, authZ ausente, segredo exposto, crypto quebrada | bloqueia aprovação |
| Alto | Explorável com conta de baixo privilégio, condição excepcional ou esforço moderado: fail open, dependência com CVE explorável, dado sensível em log, bypass de regra de negócio | corrige antes de aprovar |
| Médio | Ausência de defense-in-depth sem exploração direta: header de segurança faltante, rate limit ausente, log sem alerta | backlog priorizado |
| Baixo | Higiene e best practice: naming, doc de config, refinamento de mensagem de erro | backlog comum |

A skill **classifica**; quem bloqueia aprovação é o consumidor
(`rdd-dev-reviewer` no eixo 3 — Crítico/Alto viram request-changes;
Médio/Baixo viram pendência registrada).

## Modo A — Review de dif (PR/task)

### Passo A1 — Contexto

Receba (ou determine): repo/worktree, range do dif
(`git diff <base>...HEAD`), task e RNs em escopo. Sem range definido,
pergunte via `question` — nunca revise "o repo todo" em modo dif.

### Passo A2 — Mapa de fluxo de dados (P-09)

Antes de item a item, rastreie o dif: identifique **fontes** (input, upload,
API, env), o **processamento** (validação/transformação) e os **sinks**
(query, arquivo, render, log, API externa) do que mudou. Anote as
fronteiras de confiança cruzadas pelo dif — é onde os checks se concentram.

### Passo A3 — Checklist P-01..P-10 sobre o dif

Aplique o checklist de 18 itens da base (cada item referencia o princípio),
usando as **heurísticas de violação** de cada princípio como guia de
reconhecimento. Os anti-patterns AP-01..AP-08 são atalhos de
reconhecimento direto — exemplo de código que materializa a violação.
Para cada endpoint/regra nova, verifique no **código do servidor** (nunca
só na superfície do front): validação (P-02), authZ por objeto (P-03),
fail closed (P-04), config/segredos (P-05), dependências/integridade
(P-06), crypto (P-07), logging/alerta sem PII (P-08), abuse cases e race
conditions (P-10).

### Passo A4 — Conciliar com specs do módulo

`specs/SECURITY.md` existente → requisitos do módulo são piso adicional
aos princípios da base; conflito entre SECURITY.md e base → registre como
pendência para o `rdd-doc`, não decida. Dado pessoal no dif → cruze com
`specs/COMPLIANCE.md` quando existir.

### Passo A5 — Classificar e reportar (no chat)

Classifique cada finding pela tabela de severidade e emita no formato da
seção "Template de relatório". Sem findings Crítico/Alto, diga
explicitamente: `sem findings bloqueantes`. O relatório do dif cita
**apenas arquivos com findings** — arquivos-controle revisados e sem
violação NÃO são citados por nome (o mapeamento do fluxo de dados na
primeira linha já cobre o escopo revisado).

## Modo B — Audit baseline (repo/módulo inteiro)

### Passo B1 — Escopo

Confirme: raiz do repo/módulo, exclusões (vendor, migrations, testes,
binários) e objetivo (onboarding de legado, release, pós-incidente).
Exclusão não declarada deve ser óbvia (ex.: `node_modules`, `target`).

### Passo B2 — Varredura dirigida por anti-pattern (grep)

Use `grep` com padrões de reconhecimento por anti-pattern, adaptados às
linguagens do repo — a lista da base é o catálogo; exemplos de sementes:
concatenação de SQL/comando (AP-01), rota/controller sem middleware de
authZ (AP-02), literals de segredo (`password=`, `api_key=`, `secret`,
connection string) (AP-03), MD5/SHA-1/ECB/`Math.random` (AP-04), `catch`
vazio/genérico que segue fluxo de sucesso (AP-05), lockfile/CI sem pinning
ou com range aberto (AP-06), PII/senha/token em log (AP-07), regra de
negócio só no client / operação sensível sem transação (AP-08). Todo hit é
**candidato** — confirme no contexto antes de classificar (grep acha;
julgamento classifica).

### Passo B3 — Avaliação por área

Percorra as áreas do checklist da base sobre os arquivos confirmados:
input validation, authZ server-side/default deny, tratamento de erro,
config/segredos/headers, supply chain (lockfile, CI), crypto, logging,
fluxo de dado e lógica de negócio. Registre também **controles presentes**
(ausência de finding em área crítica com código sensível é observação,
não pass implícito).

### Passo B4 — Gravar o relatório

Escreva `quality/SECURITY_AUDIT_<timestamp>.md` no módulo (formato
AAAA-MM-DD-HHmm no timestamp; em eval/sandbox: `SECURITY_AUDIT.md` na raiz
do sandbox) e apresente o resumo no chat.

## Template de relatório

Cada finding é UMA linha acionável:

```text
arquivo:linha — princípio (P-XX / AP-XX) — severidade — evidência — correção sugerida
```

Relatório baseline (`quality/SECURITY_AUDIT_<timestamp>.md`):

```markdown
# SECURITY AUDIT — <módulo/repo>

- data: AAAA-MM-DD-HHmm · modo: baseline | dif
- base: knowledge/security-review/KNOWLEDGE.md v<versão> (proxima_revisao AAAA-MM-DD)
- escopo: <raiz + exclusões | range do dif>
- resumo: <N> findings — Crítico: <N> · Alto: <N> · Médio: <N> · Baixo: <N>

## Findings

<lista de findings no formato de 1 linha, ordenados Crítico → Baixo>

## Não verificado

<itens fora de escopo/ilegíveis — motivo>

## Observações

<controles presentes relevantes; conflitos com SECURITY.md; cruzamento COMPLIANCE.md>
```

Saída no chat (modo dif, insumo do rdd-dev-reviewer):

```text
═══ rdd-security-audit — dif <base>...HEAD ═══
base: security-review v<versão> · fluxo de dados: <fontes → sinks mapeados>
findings: <N> (Crítico <N> · Alto <N> · Médio <N> · Baixo <N>)
<finding por linha — arquivo:linha — P-XX/AP-XX — severidade — evidência — correção>
sem findings bloqueantes | bloqueantes: <N>
pendências: <Médio/Baixo ou "nenhuma">
```

## Formato de commit

A skill nunca commita. Sugestão ao dono do fluxo, quando o relatório
baseline for versionado:

```
docs(security): baseline audit <modulo> — N findings (C criticos)
```

## Casos de Borda

- **Base ausente/stale**: não improvise critérios — encerre indicando
  `rdd-domain-research` (strict; ver Modo de erro).
- **SECURITY.md conflita com a base**: registre o conflito como pendência
  para o `rdd-doc`; não escolha silenciosamente.
- **Dif gigante (> ~50 arquivos)**: priorize arquivos nas fronteiras do
  fluxo de dados (P-09) e declare a amostragem na saída.
- **Achado fora do dif** (descoberta em código-contexto): registre como
  pendência/observação, não como finding do dif — o escopo do dif é o que
  mudou.
- **Linguagem sem heurística mapeada**: aplique o checklist conceitual
  (P-01..P-10 são agnósticos a stack) e registre "não verificado" nos
  itens dependentes de padrão sintático.
- **Dado pessoal no escopo**: cruze com COMPLIANCE.md (quando existir) e
  destaque os findings P-08/P-09 com impacto LGPD — decisão segue no
  reviewer (eixo 5) / compliance-orchestrator.
- **Falso positivo confirmado**: descarte o candidato com justificativa de
  1 linha na seção Observações — trilha de auditoria da varredura.
- **Eval/sandbox**: escreva o relatório como `SECURITY_AUDIT.md` na raiz do
  sandbox (sem timestamp) para checagem determinística; no modo dif, o
  relatório de findings do chat é persistido como `SECURITY_FINDINGS.md`
  na raiz do sandbox.
