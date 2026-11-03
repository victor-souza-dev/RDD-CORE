---
name: rdd-validate
description: >-
  Percorre o grafo de documentos do projeto e valida integridade: RN sem
  downstream esperado, ID quebrado, CR aprovado sem reflexo. Gera relatório
  VALIDATION_REPORT.md. Suporta flag --fix para auto-correção.
  Use quando o usuário pedir "validar integridade", "checar a DAG",
  "validar referências cruzadas" ou "validação do módulo".
---
# rdd-validate — Validação de Integridade

Percorre o grafo de documentos do projeto e valida a integridade das
referências e cobertura. Gera `<modulo>/<projeto>/quality/VALIDATION_REPORT.md`.

## Passo 0 — Pré-scan determinístico (R4, IMP-139)

Antes de ler o módulo, rode o scanner determinístico e consuma o JSON —
as categorias mecânicas (2, cobertura, confiança, links, staleness) vêm
prontas como evidência; o julgamento (cat. 1, 3, 4) permanece agêntico:

```
node ~/.config/opencode/skills/rdd-validate/scripts/rdd-scan.mjs <raiz-do-módulo>
```

- Saída: `<modulo>/quality/scan.json` + resumo de 1 linha no stdout.
- `ids.quebrados` = cat. 2 pronta; `ids.namespaceMismatch` = sugestão DEC→ADR.
- `coberturaCandidatos` = candidatos da cat. 1 (presença por ID/range em
  DATA_MODEL/API_CONTRACTS/UI_SPEC) — julgue "a RN envolve dado/API/UI?" antes de reportar.
- `confidence` (pareamento contextual com "Confiança") + `calibrado` = insumo
  do CONFIDENCE_REPORT — emojis de severidade (PEND/riscos) já excluídos.
- `brokenLinks` e `staleness` = achados bônus (reporte; não falham o gate).
- `--strict`: exit 1 se houver ref quebrada — use como gate de CI.
- Regenerar o scan antes de escrever o relatório; nunca editar o scan.json manualmente.
- **Subcomandos irmãos (IMP-140):** `tasks <raiz>` (delivery → tasks.json),
  `config` (saúde do workflow → health.json), `diff <repo> --base <b>`
  (evidência de review), `prop <raiz>` (CRs × PROPAGATION_STATUS). O modo
  docs também emite `sequenciaRn.gaps` (numeração fora de sequência) e
  acrescenta 1 linha de drift em `quality/scan-history.jsonl` (consumo do
  rdd-drift-detector; `--sem-historico` para loops de script).

## Referências

- Grafo de documentos: `docs/CONSTITUTION.md §15`
- Fonte primária de dados: `docs/CONSTITUTION.md §6`
- Estratégia de erro: `docs/CONSTITUTION.md §10`

## Resolução de caminhos (IMP-011)

Os artefatos do módulo seguem a estrutura com subpastas (IMP-011):

- **Raiz:** PROJECT_CHARTER.md, CONSTITUTION.md, REQUIREMENTS.md, DECISIONS.md, CHANGELOG.md
- **`specs/`:** DATA_MODEL.md, API_CONTRACTS.md, ERROR_CATALOG.md, UI_SPEC.md, ARCHITECTURE.md, SECURITY.md, ACCEPTANCE_CRITERIA.md, USER_STORIES.md, US<NNN>.md, FIGMA_PROMPTS.md, COMPLIANCE.md
- **`quality/`:** TEST_STRATEGY.md, DEFINITION_OF_DONE.md, TRACEABILITY.md, VALIDATION_REPORT.md, PROPAGATION_STATUS.md, PROGRESS_REPORT.md
- **`delivery/`:** TASKS.md, TASKS_*.md, TASKS_AZURE_CONSOLIDADO.md, SCOPE_AGREEMENT.md, CLIENT_REQUIREMENTS.md, CLIENT_REPORT_*.md, HANDOVER_LOG.md
- **`support/`:** LEGACY_CONTEXT.md, KNOWN_ERRORS.md, MIGRATION.md, CHANGE_REQUESTS.md
- **`reverse/`:** REVERSE_REPORT_*.md, REVERSE_STATE.md, CANDIDATES.md, COVERAGE.md (IMP-142); sistema grande pode estar particionado — `reverse/<BC>/` com os mesmos arquivos por Bounded Context + `reverse/reverse-index.md` como TOC (IMP-143). Resolva CANDIDATES/COVERAGE/reports por glob `reverse/**/...` (cobre flat E staged)
- **`migration/` (opcional):** MIGRATION_PLAN.md, PARITY_CHECKLIST.md, DATA_MAP.md (IMP-142)
- **`glossaries/`:** DEV_GLOSSARY.md, BUSINESS_GLOSSARY.md, USER_GLOSSARY.md, GLOSSARY.md
- **`docs/`:** howto/*.md e documentos auxiliares
- **`meetings/`, `contracts/`:** checkpoints (inalterados)

**Regra de fallback (transição):** ao **LER** um artefato, verifique primeiro
o caminho novo (ex: `specs/DATA_MODEL.md`); se não existir, use o caminho
legado na raiz do módulo (ex: `DATA_MODEL.md`). Ao **ESCREVER/GERAR**, use
sempre o caminho novo. Módulos ainda não migrados via `rdd-restructure`
continuam legíveis durante a transição.

## Lê (upstream)

- Todos os documentos existentes em `<modulo>/<projeto>/` — na raiz (REQUIREMENTS.md, DECISIONS.md) e nas subpastas IMP-011 (specs/DATA_MODEL.md, specs/API_CONTRACTS.md, specs/ERROR_CATALOG.md, specs/UI_SPEC.md, quality/TRACEABILITY.md, support/CHANGE_REQUESTS.md), com fallback para a raiz em módulos pré-IMP-011

## Gera (downstream)

- `<modulo>/<projeto>/quality/VALIDATION_REPORT.md` (relatório, não altera outros docs)
- `<modulo>/<projeto>/quality/CONFIDENCE_REPORT.md` (relatório de confiança — ver seção própria)

## Nunca edita

- Nenhum documento de origem (é read-only, exceto com flag `--fix`)

## Tools

- `read` (ler todos os documentos do projeto)
- `grep` (buscar referências a IDs)
- `write` (escrever VALIDATION_REPORT.md)
- `question` (confirmar correções, se aplicável)

## Modo de erro

`strict` — se a validação falhar, o commit não deve prosseguir.

## Formato de commit

```
docs: run validation for <projeto>
```

## Workflow

1. Leia todos os documentos do projeto
2. Valide cada categoria abaixo
3. Gere `quality/VALIDATION_REPORT.md` com os resultados
4. **Escaneie os artefatos do módulo** (REQUIREMENTS.md e `specs/`) por marcadores de confiança (🟢/🟡/🔴 e `**Confiança:**`) — **leia os arquivos em UTF-8** (o scan em encoding ANSI/`Get-Content` padrão mascara os emojis e reporta falso "0 marcadores" em módulo calibrado) e gere `quality/CONFIDENCE_REPORT.md` com: contagem por documento, percentual geral por artefato — fórmula `(🟢 + 0,5×🟡)/total` — e a lista dos 🔴/Baixa com link para os PEND-XXX correspondentes. Módulo sem marcadores → relatório com o aviso "sem calibração de confiança (análise reversa não aplicada)" — **nunca falhe o gate por isso**.

Observação: a categoria "ADR sem campo Decisor" trata o campo `Decisor:`
como **opcional para ADRs antigos** (pre-IMP-010). A validação apenas
sinaliza como warning, sem bloquear o pipeline nem exigir correção
retroativa.

## Categorias de Validação

### 1. RN sem downstream esperado

Para cada RN em REQUIREMENTS.md, verifique:
- Se a RN envolve dado persistido → deve ter entrada em DATA_MODEL.md
- Se a RN envolve API → deve ter entrada em API_CONTRACTS.md
- Se a RN envolve interface → deve ter entrada em UI_SPEC.md

**Severidade:** warning (não bloqueante, pode ser intencional)

### 2. Referência a ID inexistente

Busque em todos os documentos referências a `RN-XXX`, `CR-XXX`, `ADR-NNN` (legado: `DEC-XXX`),
`PEND-XXX` e verifique se o ID existe no documento de origem.

**Severidade:** error (bloqueante — referência quebrada)

### 3. CR aprovado sem reflexo

Para cada CR com status `approved` em CHANGE_REQUESTS.md, verifique se
a RN afetada já foi atualizada em REQUIREMENTS.md e se os downstreams
marcados foram repropagados.

**Severidade:** error (bloqueante — mudança aprovada não implementada)

### 4. DEC obsoleto não marcado

Para cada DEC em DECISIONS.md, verifique se há referência cruzada a
outra DEC que a substitui. Se uma DEC mais recente aborda o mesmo tema,
a antiga deve estar `superseded`.

**Severidade:** warning

### 5. ADR sem campo Decisor

Para cada ADR em DECISIONS.md, verifique se existe o campo `Decisor:`.
ADRs criados antes da correção IMP-010 podem não ter o campo — nesse
caso, registre como **observação** (warning) e siga em frente. Não
considere erro bloqueante e não exija preenchimento retroativo.
Se o campo existir mas estiver vazio ou `Não informado`, também registre
como warning.

**Severidade:** warning

### 6. Tabelas novas sem colunas de auditoria (se exigidas pela CONSTITUTION.md)

Para cada tabela em DATA_MODEL.md marcada como **nova** (não reaproveitada do legado), verifique se as colunas de auditoria definidas na CONSTITUTION.md do projeto estão presentes. Se a CONSTITUTION.md não definir colunas de auditoria, esta validação é ignorada.

**Severidade:** error (bloqueante — colunas de auditoria são obrigatórias quando definidas na CONSTITUTION.md)

### 7. Compliance obrigatório ausente (IMP-102)

Se PROJECT_CHARTER.md do módulo contém `compliance: true` (produto trata dado pessoal), verifique se existe `specs/COMPLIANCE.md` (fallback: raiz, módulos pré-IMP-011).

- `compliance: true` e artefato ausente → **finding "compliance obrigatório ausente"**
- Artefato presente → verificar se o eixo 1 declara claramente se o produto trata dado pessoal (artefato vazio/placeholder também é finding)
- Sem a flag no charter (módulos pré-IMP-102 ou produto sem dado pessoal) → N/A, sem finding
- Skill corretiva: `rdd-compliance-check` (via `@rdd-compliance-orchestrator`)

**Severidade:** error (bloqueante — dado pessoal em produção sem verificação LGPD)

### 8. Candidata approved sem RN (IMP-142)

Para cada candidata com status `approved→RN-NNN` nos arquivos `reverse/**/CANDIDATES.md` (flat ou por BC — IMP-143),
verifique se a RN-NNN existe em REQUIREMENTS.md e carrega a proveniência da
candidata (evidência/reverse). Produto sem `reverse/` → N/A.

**Severidade:** error (bloqueante — candidata aprovada sem graduação em RN)

### 9. RN de origem reverse sem candidata (IMP-142)

Para cada RN em REQUIREMENTS.md com proveniência de engenharia reversa
(referência a `reverse/REVERSE_REPORT` ou evidência do report), verifique se
existe candidata correspondente em `reverse/**/CANDIDATES.md` (flat ou por BC — IMP-143). Produto sem
`reverse/` → N/A.

**Severidade:** error (bloqueante — RN sem origem rastreada na fila viva)

### 10. reverse/ sem COVERAGE.md (IMP-142)

Se o produto tem `reverse/` com reports mas sem nenhum `COVERAGE.md`
(glob `reverse/**/COVERAGE.md` — flat ou por BC, IMP-143), a cobertura não
é comparável entre rodadas (KNOWLEDGE.md v1.2.0 P-11). Skill corretiva:
`rdd-restructure` (modo reverse-layer gera o retroativo).

**Severidade:** warning

### 11. Pendentes antigos na fila de candidatas (IMP-142)

Candidatas `pending` nos arquivos `reverse/**/CANDIDATES.md` (flat ou por BC — IMP-143) sem mudança de status há 2+
rodadas (ou mais de 30 dias desde a última movimentação) são re-sinalizadas
para a devolutiva do `rdd-doc` (KNOWLEDGE.md AP-10 — fila sem dono/movimento é
anti-pattern). Produto sem `reverse/` → N/A.

**Severidade:** warning

### 12. Anti-gigantismo da camada reverse/ (IMP-143)

Dois checks, ambos **warning** (nunca bloqueiam — o sharding nasce no próximo reverse):

- **Gatilho documentado mas layout flat:** o report (`REVERSE_REPORT_*`) ou o
  `REVERSE_STATE.md` registra o gatilho de sharding atingido (`>3 BCs` / `>80 tabelas` /
  `>60 endpoints` / projeção `>1.500 linhas`) e o layout de `reverse/` continua flat
  (sem pastas `reverse/<BC>/`) → warning `shard por BC recomendado (IMP-143)`.
- **Staged sem `reverse-index.md`:** `reverse/` com pastas por BC (staged) e
  `reverse/reverse-index.md` ausente → warning
  `reverse-index.md ausente — leitura downstream não-seletiva (IMP-143)`.

### 13. Integridade da captura visual (IMP-144)

Três checks sobre a camada de captura visual runtime (`reverse/UI_CAPTURE.md` +
`reverse/ui/**`):

- **PNG inexistente:** referência a arquivo PNG em `reverse/UI_CAPTURE.md` cujo
  arquivo não existe em `reverse/ui/**` (resolva os paths relativos ao
  manifesto) — evidência visual quebrada.
- **Imagem PII sem marcação:** screenshot listado no manifesto e citado como
  evidência (em candidatas/report) contendo possível dado pessoal sem a marcação
  `⚠️ PII` na linha correspondente do manifesto.
- **Sem captura:** produto sem `reverse/UI_CAPTURE.md` E sem `reverse/ui/` →
  N/A (a captura visual é opcional — nunca é finding).

**Severidade:** error (PNG referenciado inexistente) | warning (imagem sem
marcação PII) | N/A (sem captura). Triagem de dado pessoal:
`rdd-compliance-check` — nunca opine sobre tratamento.

### 14. Agregados reverse com PII sem marcação ⚠️ (IMP-146)

Nos reports `reverse/**/REVERSE_REPORT_*.md` (flat ou por BC — IMP-143),
cada agregado da seção §2 (Modelo de Dados), verifique se campos cujo nome casa
padrões de PII (`Cpf`, `Cnpj`, `Email`, `Telefone`/`Celular`, `Endereco`/
`Endereço`, `DataNascimento`, `NumeroCartao`/cartão e variantes) carregam a
tag `⚠️ PII`. Campo sensível sem tag → finding (report pré-padronização
anterior ao IMP-146 ou omissão da Fatia 2 do orchestrator). Produto sem
`reverse/` → N/A. Triagem de dado pessoal: `rdd-compliance-check` — nunca
opine sobre tratamento.

**Severidade:** warning (nunca error — reports são append-only, IMP-146;
a marcação vale para as rodadas novas).

## Resiliência a documentos ausentes

Se TRACEABILITY.md não existir (tier básico), pule validações que dependem
dele (CR aprovado sem reflexo, RN sem downstream). Valide apenas o que
existe.

## Template — VALIDATION_REPORT.md

```yaml
---
project: <NOME>
module: validacao
audience: [tecnica]
status: draft
---
```

```markdown
# Validation Report — [Nome do Sistema]

> **Data:** DD/MM/AAAA
> **Resultado:** ✅ Aprovado | ⚠️ Aprovado com ressalvas | ❌ Reprovado

---

## Resumo

| Categoria | Erros | Warnings | Status |
|---|---|---|---|
| RN sem downstream esperado | 0 | 2 | ⚠️ |
| Referência a ID inexistente | 1 | 0 | ❌ |
| CR aprovado sem reflexo | 0 | 0 | ✅ |
| DEC obsoleto não marcado | 0 | 1 | ⚠️ |
| ADR sem campo Decisor | 0 | 1 | ⚠️ |
| Tabelas novas sem colunas de auditoria | 0 | 0 | ✅ |
| Compliance obrigatório ausente | 0 | 0 | ✅ |
| Candidata approved sem RN (reverse/) | 0 | 0 | ✅ |
| RN de origem reverse sem candidata | 0 | 0 | ✅ |
| reverse/ sem COVERAGE.md | 0 | 0 | ✅ |
| Pendentes antigos na fila de candidatas | 0 | 0 | ✅ |
| Anti-gigantismo reverse/ (IMP-143) | 0 | 0 | ✅ |
| Integridade da captura visual (IMP-144) | 0 | 0 | ✅ |
| Agregados reverse com PII sem marcação (IMP-146) | 0 | 0 | ✅ |

---

## 1. RN sem Downstream Esperado

| RN | Downstream faltante | Sugestão |
|---|---|---|
| RN-012 | UI_SPEC | RN envolve interface de usuário |

---

## 2. Referência a ID Inexistente

| Arquivo | Linha | Referência | Problema |
|---|---|---|---|
| API_CONTRACTS.md | 45 | RN-999 | RN não encontrada em REQUIREMENTS.md |

---

## 3. CR Aprovado sem Reflexo

| CR | RN | Downstreams afetados | Status |
|---|---|---|---|
| CR-001 | RN-001 | DATA_MODEL | ❌ Não refletido |

---

## 4. ADR Obsoleto não Marcado (legado: DEC)

| ADR | Tema | ADR mais recente | Ação |
|---|---|---|---|
| ADR-001 | Autenticação | ADR-005 | Marcar ADR-001 como Superseded |

---

## 5. ADR sem Campo Decisor

| ADR | Campo | Severidade | Ação |
|---|---|---|---|
| ADR-001 | Decisor ausente | warning | Preencher se o autor for conhecido; caso contrário, manter e prosseguir |

---

## 6. Tabelas Novas sem Colunas de Auditoria Padrão

| `<tabela>` | Colunas ausentes | Severidade | Ação |
|--------|-----------------|------------|------|
| `TABELA_EXEMPLO` | CTR_DTH_INC, CTR_USU_INC | error | Reexecutar rdd-data-model |

---

## 7. Findings por Documento

| Documento | Achados | Severidade | Skill corretiva |
|-----------|---------|------------|-----------------|
| DATA_MODEL.md | 1 erro (RN-999), 1 warning | 🔴 erro | rdd-data-model |
| API_CONTRACTS.md | 1 warning (RN-012 sem UI) | 🟡 warning | rdd-api-contracts |
| UI_SPEC.md | — | ✅ ok | — |
| ARCHITECTURE.md | — | ✅ ok | — |
| REQUIREMENTS.md | 1 warning (RN-015 órfã) | 🟡 warning | rdd-requirements |
| DECISIONS.md | 1 warning (ADR-001 sem Decisor) | 🟡 warning | rdd-requirements |
| reverse/CANDIDATES.md | 1 erro (approved sem RN), 1 warning (pending antigo) | erro | rdd-doc / rdd-requirements |


---

## 8. Candidata approved sem RN (reverse/)

| Candidata | RN apontada | Problema |
|---|---|---|
| #3 (CANDIDATES.md) | RN-021 | RN não existe em REQUIREMENTS.md |

---

## 9. RN de Origem Reverse sem Candidata

| RN | Proveniência | Problema |
|---|---|---|
| RN-014 | reverse/REVERSE_REPORT_2026-10-01 | Sem candidata correspondente em CANDIDATES.md |

---

## 10. reverse/ sem COVERAGE.md

| Produto | Detalhe |
|---|---|
| <nome> | reverse/ com N reports, COVERAGE.md ausente — cobertura não comparável (P-11) |

---

## 11. Pendentes Antigos na Fila de Candidatas

| Candidata | Status | Última movimentação | Ação |
|---|---|---|---|
| #7 (CANDIDATES.md) | pending | 2026-09-01 (3 rodadas) | Re-sinalizar no rdd-doc |

---

## 12. Anti-Gigantismo da Camada reverse/ (IMP-143)

| Check | Produto | Detalhe | Severidade |
|---|---|---|---|
| Gatilho documentado, layout flat | <nome> | N BCs / N tabelas / N endpoints no report — shard por BC recomendado | warning |
| Staged sem reverse-index.md | <nome> | reverse/<BC>/ existente, reverse-index.md ausente | warning |

---

## 13. Integridade da Captura Visual (IMP-144)

| Check | Referência | Problema | Severidade |
|---|---|---|---|
| PNG inexistente | `reverse/ui/servicos-novo/erro-validacao-mobile.png` | Citado em UI_CAPTURE.md, arquivo ausente em reverse/ui/ | error |
| Imagem PII sem marcação | listagem de clientes (UI_CAPTURE.md) | Citada em candidata sem `⚠️ PII` na linha do manifesto | warning |

---

## 14. Agregados Reverse com PII sem Marcação (IMP-146)

| Report §2 — Agregado | Campo | Problema | Severidade | |---|---|---|---|
| reverse/REVERSE_REPORT_2026-09-19.md — ClienteAgendamento | `email` | Sem tag `⚠️ PII` (pré-padronização) | warning |
```

## Seção Findings por Documento

Sempre inclua a seção `## 7. Findings por Documento` no relatório.
Para cada documento com achados, liste:
- **Documento:** nome do arquivo
- **Achados:** lista de problemas encontrados (com referência à linha/seção da categoria anterior)
- **Severidade:** `error` (bloqueante) ou `warning` (não bloqueante)
- **Skill corretiva sugerida:** nome da skill de Fase 1/2 que deve ser reexecutada para corrigir

| Severidade | Ação |
|------------|------|
| `error` | Reexecução obrigatória da skill corretiva antes de prosseguir |
| `warning` | Reexecução recomendada; pode prosseguir com ressalva |

## Relatório de Confiança (CONFIDENCE_REPORT.md)

Gerado a partir dos marcadores 🟢/🟡/🔴 e `**Confiança:**` presentes em REQUIREMENTS.md e nos artefatos de `specs/`:

| Artefato | 🟢 | 🟡 | 🔴 | Percentual geral |
|---|---|---|---|---|
| REQUIREMENTS.md | 12 | 3 | 1 | (12 + 0,5×3)/16 = 84% |

- **Percentual geral por artefato:** fórmula `(🟢 + 0,5×🟡)/total`.
- **Lista dos 🔴/Baixa** com link para os PEND-XXX correspondentes (RN induzida de confiança Baixa não validada por humano segue IMP-094 — PEND).
- **Módulo sem marcadores:** emita o relatório com o aviso `⚠️ Sem calibração de confiança (análise reversa não aplicada)` — aviso, nunca falha de gate.

### Auditoria anti-🟢 disfarçado (Jev, opcional)

- No passo 4, além do grep de marcadores, as afirmações marcadas 🟢 (ou amostra, se >20) vão ao `@rdd-jev-classifier` com pergunta do tipo "há linguagem de inferência (provavelmente/deve/aparentemente) ou evidência ausente nesta afirmação?" — criteria: `{evidencia_direta, linguagem_inferencia, sem_evidencia}`.
- O resultado vira **coluna** no CONFIDENCE_REPORT (ex.: `🟢⤵ sugestão Jev: rebaixar (p=0.4)`) — **nunca edita o artefato de origem**; a reclassificação cabe a uma re-execução humana/reverse.
- O Jev é **opcional** — nunca gate bloqueante; se indisponível/falhar, gere o relatório sem a coluna e registre o aviso no CONFIDENCE_REPORT.

## Flag --fix

Se o usuário passar `--fix`, as seguintes correções automáticas são aplicadas:

1. IDs órfãos (referência a ID inexistente) → remover a referência
2. DECs obsoletos → marcar como `superseded` com referência à DEC mais recente

**Nunca** auto-corrigir:
- RN sem downstream (pode ser intencional)
- CR aprovado sem reflexo (requer ação humana)

## Casos de Borda

- **Documento ausente** — pule as validações que dependem dele; valide apenas o que existe.
- **Módulo pré-IMP-011** — resolva caminhos com fallback para a raiz antes de reportar "documento ausente".
- **`--fix`** — só auto-corrige itens estruturais; nunca RN sem downstream nem CR aprovado sem reflexo.
- **Nenhum achado** — emita relatório `✅ Aprovado`; não invente problemas para preencher o relatório.
- **ADR antigo sem decisor registrado** — warning apenas; não bloqueie nem exija correção retroativa.
- **Módulo sem marcadores de confiança** — gere CONFIDENCE_REPORT.md com o aviso "sem calibração de confiança (análise reversa não aplicada)"; isso NUNCA falha o gate (marcadores só existem quando a engenharia reversa foi aplicada).
- **Produto sem `reverse/`** — as categorias 8-12 e 14 (IMP-142/IMP-143/IMP-146) ficam N/A e não geram finding; `--fix` nunca aplica as categorias 8-11 (graduação de candidata é decisão humana).
- **Produto sem captura visual** (sem `reverse/UI_CAPTURE.md` e sem `reverse/ui/`) — a categoria 13 (IMP-144) fica N/A; captura é opcional e NUNCA falha o gate.
- **Report reverse pré-IMP-146** (§2 sem marcação PII): a categoria 14 reporta warning com a nota "pré-padronização" — NUNCA exige reescrita do report (append-only — convenção de errata IMP-146); a marcação vale para as rodadas novas.
- **`reverse/` flat de sistema pequeno/médio** — layout válido (IMP-143); a categoria 12 só dispara com o gatilho de gigantismo DOCUMENTADO no report/STATE — nunca por estimativa da própria skill.
