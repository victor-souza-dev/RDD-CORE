---
dominio: knowledge-management
versao: 1.5.0
data_pesquisa: 2026-10-21
proxima_revisao: 2027-04-21
escopo: arquitetura de armazenamento de conhecimento do RDD (bases de domínio, acúmulo da org, rules lazy, artefatos de módulo, self-knowledge) e padrões de memória de agentes IA
fontes:
  - titulo: "Anthropic — Effective context engineering for AI agents"
    url: https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
    acessado_em: 2026-10-21
    versao: out/2025
  - titulo: "Anthropic Cookbook — Context engineering: memory, compaction, and tool clearing"
    url: https://platform.claude.com/cookbook/tool-use-context-engineering-context-engineering-tools
    acessado_em: 2026-10-21
    versao: 2026-03-20
  - titulo: "Anthropic — Advanced tool use (tool search / defer loading)"
    url: https://www.anthropic.com/engineering/advanced-tool-use
    acessado_em: 2026-10-21
  - titulo: "Anthropic — Equipping agents for the real world with Agent Skills"
    url: https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills
    acessado_em: 2026-10-21
  - titulo: "Claude Code Docs — How Claude remembers your project (memory hierarchy + Auto Memory)"
    url: https://code.claude.com/docs/en/memory
    acessado_em: 2026-10-21
  - titulo: "Packer et al. — MemGPT: Towards LLMs as Operating Systems"
    url: https://arxiv.org/abs/2310.08560
    acessado_em: 2026-10-21
    versao: arXiv 2023
  - titulo: "Park et al. — Generative Agents: Interactive Simulacra of Human Behavior"
    url: https://arxiv.org/abs/2304.03442
    acessado_em: 2026-10-21
    versao: UIST 2023
  - titulo: "Zep — A Temporal Knowledge Graph Architecture for Agent Memory (Graphiti)"
    url: https://arxiv.org/abs/2501.13956
    acessado_em: 2026-10-21
  - titulo: "Xu et al. — A-MEM: Agentic Memory for LLM Agents"
    url: https://arxiv.org/abs/2502.12110
    acessado_em: 2026-10-21
    versao: NeurIPS 2025
  - titulo: "Procida — Diátaxis (framework de documentação)"
    url: https://diataxis.fr/
    acessado_em: 2026-10-21
  - titulo: "Model Context Protocol — What is MCP / docs"
    url: https://modelcontextprotocol.io/docs/2026-07-28/getting-started/intro
    acessado_em: 2026-10-21
    versao: spec 2026-07-28
  - titulo: "LangChain — Context engineering for agents (write/select/compress/isolate)"
    url: https://www.langchain.com/blog/context-engineering-for-agents/
    acessado_em: 2026-10-21
    versao: secundária
  - titulo: "LangChain — LangMem SDK for agent long-term memory"
    url: https://www.langchain.com/blog/langmem-sdk-launch
    acessado_em: 2026-10-21
  - titulo: "LangChain Docs — Memory overview (semantic/episodic/procedural)"
    url: https://docs.langchain.com/oss/python/concepts/memory
    acessado_em: 2026-10-21
  - titulo: "OpenAI — Memory and new controls for ChatGPT"
    url: https://openai.com/index/memory-and-new-controls-for-chatgpt
    acessado_em: 2026-10-21
    versao: abr/2025
  - titulo: "Forte Labs — The PARA Method (Tiago Forte)"
    url: https://fortelabs.com/blog/para
    acessado_em: 2026-10-21
  - titulo: "Cursor Docs — Rules / AGENTS.md"
    url: https://cursor.com/docs/rules
    acessado_em: 2026-10-21
  - titulo: "Devin Docs — Cascade Memories (promoção auto-memória → Rule/AGENTS.md)"
    url: https://docs.devin.ai/desktop/cascade/memories
    acessado_em: 2026-10-21
  - titulo: "Mem0 — State of AI Agent Memory 2026 (benchmarks LoCoMo/LongMemEval/BEAM)"
    url: https://mem0.ai/blog/state-of-ai-agent-memory-2026
    acessado_em: 2026-10-21
  - titulo: "Digital Applied — Open-Source Agent Memory: Mem0 vs Letta vs Zep Compared"
    url: https://www.digitalapplied.com/blog/open-source-agent-memory-mem0-letta-zep-compared
    acessado_em: 2026-10-21
    versao: secundária
  - titulo: "Upsolve — AI Agent Memory Explained (scoping, TTL/decay, memória de trabalho)"
    url: https://upsolve.ai/blog/ai-agent-memory
    acessado_em: 2026-10-21
    versao: secundária
  - titulo: "The AI Engineer — RAG vs Fine-Tuning: When to Use Each in Production"
    url: https://theaiengineer.substack.com/p/rag-vs-fine-tuning
    acessado_em: 2026-10-21
    versao: secundária
  - titulo: "Anthropic — Building effective agents"
    url: https://www.anthropic.com/research/building-effective-agents
    acessado_em: 2026-10-21
  - titulo: "Críticas do operador — hit rate + tokens/tarefa · granularidade do item · modelo (qwen/PIA) e taxa de seguimento"
    url: file://sessão rdd-doc knowledge-management 2026-10-21
    acessado_em: 2026-10-21
  - titulo: "Evidência local RDD — consolidação de patterns no acúmulo do pack (gaps G1–G5)"
    url: file://sessões rdd-doc 2026-10-21 (detalhes de org no acúmulo privado do pack)
    acessado_em: 2026-10-21
---
# KNOWLEDGE — Knowledge Management (arquitetura de armazenamento de conhecimento do RDD + memória de agentes IA)

Base canônica do domínio para consumo por camadas/componentes RDD.
Fonte canônica de critérios — componentes que consomem este domínio listam
este arquivo no "Lê (upstream)" deles. Atualizar via rdd-domain-research
quando `proxima_revisao` vencer.

## Mapa de leitura parcial (P-10 — prefira seção a arquivo inteiro)

| Preciso de... | Leia (âncora / como) |
|---------------|----------------------|
| Avaliar/desenhar uma store | `## Princípios` — grep `^### P-` |
| Comparar com o mercado | `## Padrões de mercado` — grep `^### MP-` |
| Triagem rápida de desenho | `## Checklist aplicável` |
| Reconhecer violações | `## Anti-patterns` — grep `^### AP-` |
| Visão consolidada stores × funções | `## Lente consolidada` |
| Decisões de destino de conhecimento | bloco `knowledge-routing` do AGENTS.md (não desta base) |

## Princípios

### P-01 — Atenção é orçamento finito (context rot)
A janela de contexto é recurso finito com retornos decimais: quanto mais
tokens, mais diluída a atenção. O objetivo é o menor conjunto de tokens de
alto sinal que maximiza o resultado (Anthropic chama de "attention budget").
- **Heurística de violação**: conteúdo carregado automaticamente em TODA
  sessão (system prompt/AGENTS.md inchados, arquivos "sempre-on"); crescimento
  linear do prompt default sem mecanismo de lazy loading.
- Fonte: (Anthropic, Effective context engineering for AI agents, 2025)

### P-02 — Hierarquia de memória em tiers com paging explícito
Memória principal (contexto de trabalho, limitada) ≠ memória externa
(persistente, ampla) — análogo RAM/disk. A informação "paga" entre tiers por
operação explícita (page-in/page-out), nunca por cópia permanente.
- **Heurística de violação**: ou tudo mora na janela (sem tier frio), ou tudo
  é arquivado sem caminho de volta (arquivo morto sem índice de paging).
- Fonte: (Packer et al., MemGPT, arXiv:2310.08560, 2023 — main context vs external context)

### P-03 — Separar por necessidade do consumidor, não por formato
Tipos de documento respondem a necessidades distintas: ação vs cognição,
aquisição (estudo) vs aplicação (trabalho) — Diátaxis: tutorial / how-to /
reference / explanation. Misturar necessidades num só artefato degrada todos
os usos.
- **Heurística de violação**: "reference" com parágrafos didáticos; regra
  operacional enterrada em explicação conceitual; tutorial que vira despejo
  de API.
- Fonte: (Diátaxis — diataxis.fr, "Start here")

### P-04 — Fonte única de verdade; derivados linkam, nunca copiam
Um fato canônico vive em exatamente um lugar. Artefatos derivados (índices,
espelhos, resumos) referenciam a fonte — cópia manual sem sincronização é
drift garantido.
- **Heurística de violação**: dois locais com o mesmo conteúdo e editores
  distintos; índice que repete o conteúdo em vez de linkar (evidência local:
  cópia byte-idêntica de patterns em repositório de docs da org, consolidada
  no acúmulo do pack — resolvido em 2026-10-21).
- Fonte: (Evidência local RDD, 2026-10-21; análogo: regra de alocação
  AGENTS.md vs .mdc do Cursor — "não duplique entre camadas")

### P-05 — Memória é curada, não append-only; verdade por invalidação, não por idade
Contexto editável: remover informação stale, comprimir saídas verbosas,
reestruturar a janela ativa. Idade (`data_ultima_revisao > 6m`) é gatilho de
REVISÃO, não veredito de verdade — a verdade resolve-se por INVALIDAÇÃO POR
CONTRADIÇÃO: fato novo que conflita com um existente marca o antigo como
**superado** (`superado_por`), preservando o histórico (Zep: `invalid_at`,
não `delete`).
- **Heurística de violação**: histórico que só cresce; store sem
  `data`/`proxima_revisao`; item velho tratado como falso; item contradito
  tratado como válido por não ter revisão recente.
- Fonte: (Anthropic — context editing + memory tool, 2025-09-29; Cookbook
  memory/compaction/tool clearing, 2026-03-20; MemGPT — self-editing memory;
  Zep — edge invalidation, arXiv:2501.13956; crítica do operador, 2026-10-21)

### P-06 — Toda store tem contrato: escritor canônico + leitores declarados
Cada local de armazenamento tem UM gerador nomeado (skill/agent/processo) e
consumidores declarados. Store sem escritor ativo vira fantasma (contrato
prevê, disco não tem) ou terra de ninguém.
- **Heurística de violação**: README que promete pasta inexistente
  (evidência local: `accumulation/metrics/` e `accumulation/reverses/`
  ausentes no disco — metrics migrada em 2026-10-21); dois escritores para
  o mesmo arquivo.
- Fonte: (Evidência local RDD — accumulation/README.md vs disco, 2026-10-21;
  Anthropic Building effective agents — transparência de desenho)

### P-07 — Descoberta sob demanda com índice navegável
Conhecimento frío carrega-se on-demand via índice leve (defer loading /
tool search no modelo Anthropic; resources pull no MCP). Índice é roteiro
(curto, estável), não espelho do conteúdo.
- **Heurística de violação**: descoberta por grep cego full-text; índice
  gigante que replica conteúdo (viola também P-04); índice que ninguém
  atualiza.
- Fonte: (Anthropic — Advanced tool use / Tool Search Tool, 2025; MCP —
  resources, spec 2026-07-28; LangChain — "select" bucket)

### P-08 — Leitura passiva ≠ ação: resource vs tool
Dado de consulta é exposto como recurso passivo (reference/read-only);
operação que muda estado é exposta como ação (tool/skill). Inverter os papéis
gera skills-índice obesas ou recursos que fazem efeito colateral.
- **Heurística de violação**: skill existe só para "ler/consultar" algo;
  resource que grava/altera estado ao ser lido.
- Fonte: (MCP — tools vs resources vs prompts, spec 2026-07-28; Diátaxis —
  reference serve trabalho, não ação)

### P-09 — Medir uso, não estoque — com o PAR de métricas
Store existe para ser LIDA, e ser lida tem CUSTO. Duas métricas, sempre
juntas: **(1) hit rate** — fração de tarefas que de fato carregaram o
conhecimento relevante (o roteamento acerta?); **(2) tokens de conhecimento
por tarefa** — quanto custa acertar. Sem o par, otimiza-se no escuro.
Instrumentação barata deve PRECEDER decisões de infraestrutura.
- **Heurística de violação**: índices nunca auditados; "existe no disco"
  tratado como "em uso"; hit rate sem custo (ou custo sem hit rate); infra
  de memória decidida antes da primeira medição.
- Fonte: (Críticas do operador, 2026-10-21; MP-15 — benchmarks medem apply,
  não estoque)

### P-10 — Granularidade do item casa com granularidade da consulta
Item de conhecimento grande (ex.: arquivo de 8k tokens) transforma cada
acerto do INDEX em carga integral cara. Prefira **arquivos pequenos e
focados** ou **seções com âncora** (heading estável + leitura parcial via
grep/offset) — o INDEX deve rotear para a MENOR unidade suficiente.
- **Heurística de violação**: INDEX preciso mas todo hit carrega o arquivo
  inteiro; consumidor lê tudo "para não perder nada"; base que só é usada
  em bloco monolítico.
- Fonte: (Crítica do operador, 2026-10-21; MP-12 — topic files; MP-14 — notas
  atômicas; MP-04 — níveis de disclosure)

### P-11 — Roteamento é função do modelo que segue o gatilho
A economia de tokens (P-01) pressupõe boa aderência a instruções. Com modelos
de menor taxa de seguimento (ex.: qwen via PIA Broker), **gatilho ignorado
custa MAIS que contexto grande**: priorize seguimento — gatilhos explícitos e
verificáveis, redundância estratégica nos pontos de alta frequência, menos
indireção — e meça aderência POR MODELO (hit rate segmentado).
- **Heurística de violação**: roteamento sutil demais para o modelo em uso;
  otimizar tokens sem medir seguimento; assumir aderência de frontier models
  para modelos menores.
- Fonte: (Crítica do operador — contexto PIA Broker/qwen, 2026-10-21)

## Padrões de mercado (exemplos comparados)

### MP-01 — Extração com operações nomeadas (Mem0)
Pipeline de consolidação: LLM extrai fatos candidatos; segunda passada
compara com memórias existentes e decide **ADD/UPDATE/DELETE/NOOP**.
- **Lição RDD**: atualização de índices (patterns/knowledge) como operação
  nomeada e idempotente (merge incremental), nunca append cego.
- Fonte: (Digital Applied — Mem0 vs Letta vs Zep, 2026)

### MP-02 — Tiers auto-editáveis com blocos nomeados (Letta/MemGPT)
Core memory blocks — texto rotulado pinado no contexto que o próprio agente
edita (`core_memory_append`/`core_memory_replace`) — + archival searchável
sob demanda. Em produção em larga escala (ex.: um agente por usuário).
- **Lição RDD**: cada tier tem operação de paging explícita; "Lê (upstream)"
  e INDEX são os page-ins do RDD.
- Fonte: (MemGPT, arXiv:2310.08560; comparações Letta 2026)

### MP-03 — Validade temporal como propriedade do fato (Zep/Graphiti)
Grafo de conhecimento temporal: fatos carregam `valid_at`/`invalid_at` —
expiram, não desaparecem; recuperação combina travessia de grafo + busca
vetorial.
- **Lição RDD**: staleness (`proxima_revisao`, `data_ultima_revisao`) é
  atributo do ITEM, não da store.
- Fonte: (Digital Applied; Upsolve — AI Agent Memory, 2026)

### MP-04 — Progressive disclosure em 3 níveis (Anthropic Agent Skills)
Nível 1: metadados do front matter (sempre visíveis, mínimos); nível 2:
corpo do SKILL.md sob demanda; nível 3: arquivos adicionais referenciados,
carregados só quando a tarefa pede.
- **Lição RDD**: é o contrato rules-lazy + skills + knowledge/; o INDEX é o
  nível 1 — metadado que roteia sem carregar conteúdo.
- Fonte: (Anthropic — Equipping agents for the real world with Agent Skills, 2025)

### MP-05 — Organização por acionabilidade, não por tópico (PARA)
Projects / Areas / Resources / Archives — classificar informação por quão
acionável é, não por assunto; itens fluem entre categorias por operação
explícita.
- **Lição RDD**: T4 (módulos) ≈ Projects; T3 (rules) ≈ Areas; T1/T2 ≈
  Resources; reverses/métricas antigas ≈ Archives. Reforça roteamento por
  destino-função (§ Roteamento).
- Fonte: (Forte Labs — PARA, fortelabs.com/blog/para)

### MP-06 — Regra de alocação entre camadas (Cursor / AGENTS.md)
Convenção cross-tool → AGENTS.md; comportamento específico da ferramenta →
arquivos de rule com glob; **"se está no AGENTS.md, não repita no .mdc"** —
duplicação entre camadas gera contexto redundante e contradição stale.
- **Lição RDD**: valida P-04/G1 — e o bloco `knowledge-routing` único no
  AGENTS.md global, sem réplicas nos repos de produto.
- Fonte: (Cursor Docs — Rules, 2026; guias AGENTS.md 2026)

### MP-07 — Escoping por tenant + esquecimento ativo
Memórias com namespace por user/session/tenant (vazamento entre tenants é
incidente de segurança, não quirk); esquecimento por TTL, decay ou deleção
por contradição.
- **Lição RDD**: os escopos core (workflow) / pack (org) / módulo (produto)
  são os "tenants" do RDD — conhecimento nunca cruza escopo sem operação
  explícita de promoção (ex: pattern da org → PR no core).
- Fonte: (Upsolve — AI Agent Memory, 2026)

### MP-08 — Tipos funcionais de memória: semântica, episódica, procedural (LangMem/LangGraph)
Semântica = fatos duráveis (perfis, convenções, estado); episódica =
experiências passadas, frequentemente reutilizadas como few-shot; procedural
= instruções/comportamento (prompts e regras atualizados por feedback —
"prompt optimizer").
- **Lente sobre o RDD**: T1 (bases de domínio) e T2 (patterns/metrics) =
  memória **SEMÂNTICA**; T4 `meetings/`, `DECISIONS.md`, KNOWN_ERRORS,
  VALIDATION_REPORT = **EPISÓDICA**; T3 (rules) + skills + AGENTS.md =
  **PROCEDURAL**; WORKFLOW_IMPROVEMENTS ≈ prompt optimizer (instrução do
  workflow atualizada por falha observada).
- Fonte: (LangChain — LangMem SDK launch; LangChain Docs — Memory overview)

### MP-09 — Memory stream com recuperação por score composto (Generative Agents)
Observações carimbadas com timestamps; recuperação ranqueia por
recência × relevância × importância; "reflexões" (sínteses periódicas de
alto nível) voltam para o stream como memória de primeiro nível.
- **Lição RDD**: rdd-project-retrospective + rdd-pattern-extractor são a
  FUNÇÃO REFLEXÃO do workflow — convertem episódios (retros) em semântica
  (patterns); índices podem ordenar por recência/importância (maturidade)
  em vez de ordem alfabética.
- Fonte: (Park et al., Generative Agents, arXiv:2304.03442, UIST 2023)

### MP-10 — Curado vs derivado, com controle do titular (OpenAI ChatGPT)
Duas camadas explícitas: "saved memories" (curadas, explícitas, sempre
consideradas) vs "chat history" (insights derivados, mutáveis); o titular
vê, edita e apaga; chats temporários não tocam a memória.
- **Lição RDD**: classificar cada store como **CURADA** (bases, patterns,
  rules — editadas só pelo escritor canônico) ou **DERIVADA** (relatórios,
  índices gerados, dashboards — regeneráveis da fonte curada); store
  derivada nunca é fonte de verdade (valida G1: apagar a cópia era seguro
  porque derivada).
- Fonte: (OpenAI — Memory and new controls for ChatGPT, abr/2025)

### MP-11 — Resolver por tipo de problema: acesso vs comportamento (RAG vs fine-tuning)
RAG muda o que o modelo **vê** na resposta (fatos que mudam, privados,
citáveis); fine-tuning muda **como** se comporta. Edição pontual na base
corrige todas as respostas futuras ("a single document fix corrects every
future answer").
- **Lição RDD**: o modelo file-based curado do RDD (editar o .md, não
  treinar nada) é o extremo correto para conhecimento mutável de domínio —
  prompt primeiro, store editável depois, pesos nunca.
- Fonte: (The AI Engineer — RAG vs Fine-Tuning; Monte Carlo — RAG vs Fine Tuning)

### MP-12 — Hierarquia de escopos + auto-memória com índice capado (Claude Code)
Cascata de escopos com donos e meios distintos: managed policy (org/IT) →
user (`~/.claude`, pessoal cross-projeto) → project (`CLAUDE.md` + rules/,
time via git) → local (`CLAUDE.local.md`, gitignored). **Auto Memory**: notas
do próprio agente por repo, com `MEMORY.md` como índice sempre-carregado e
**cap explícito (200 linhas / 25KB)** + topic files on demand; critérios
implícitos de curadoria: recorrência, não-obviedade, estabilidade,
especificidade de projeto.
- **Lição RDD**: (a) índice sempre-carregado tem CAP medido — orçamento de
  atenção é gerido, não pressuposto; (b) critérios de curadoria explícitos
  decidem o que merece store; (c) escopo = dono + meio de versionamento
  (core git / pack git / módulo git / profile gitignored).
- Fonte: (Claude Code Docs — Memory, code.claude.com/docs/en/memory; Vectorize —
  Claude Code Memory, 2026)

### MP-13 — Bi-temporalidade: validade no mundo ≠ momento de ingestão (Zep/Graphiti)
Edges bi-temporais: `valid_from`/`valid_to` (verdade no mundo) separados de
ingestão/provenance (quando o sistema soube); fatos superados são
**INVALIDADOS, nunca deletados**; provenance por episódio.
- **Lição RDD**: a base deste domínio já é bi-temporal sem saber
  (`data_pesquisa` = ingestão; `proxima_revisao` = validade); em módulos,
  CR implemented e DECISIONS mantêm histórico — invalidar COM REFERÊNCIA,
  nunca apagar.
- Fonte: (Zep — arXiv:2501.13956; getzep.com; github.com/getzep/graphiti)

### MP-14 — Notas atômicas com linking e evolução (A-MEM / Zettelkasten)
Notas atômicas com atributos estruturados (contexto, keywords, tags); link
generation para as top-k relacionadas; **memory evolution**: nota nova pode
ATUALIZAR atributos de notas antigas relacionadas; rede de links > hierarquia
rígida. Ablação: linking + evolution juntos > isolados.
- **Lição RDD**: patterns e bases como notas atômicas ligadas (INDEX por
  categoria + links cruzados); extração pode EVOLUIR padrões existentes
  (merge incremental já prevê); hierarquia de pastas é roteamento, não
  estrutura de conhecimento.
- Fonte: (Xu et al. — A-MEM, arXiv:2502.12110, NeurIPS 2025)

### MP-15 — Avaliar memória pelas operações, não pelo volume (LoCoMo/LongMemEval)
Benchmarks do domínio medem as operações: store, retrieve, update, apply
(+forget), com categorias de knowledge updates, temporal reasoning e
multi-session. Com janelas de 1M tokens, "despejar tudo" pontua bem — a
dificuldade real migrou da RECUPERAÇÃO para a DISCRIMINAÇÃO (o que entra).
- **Lição RDD**: teste de aceitação de qualquer store do redesign — responde
  bem às 5 operações? store=escritor canônico · retrieve=INDEX lazy ·
  update=merge idempotente · apply=gatilhos declarados · forget=staleness.
- Fonte: (Mem0 — State of AI Agent Memory 2026; Snap Research — LoCoMo;
  LongMemEval)

### MP-16 — Caminho de promoção explícito: auto-memória → regra versionada (Windsurf/Devin)
Memórias auto-geradas ficam locais por workspace; a doc oficial manda para
conhecimento durável/equipe: **"peça ao Cascade para escrever numa Rule em
`.devin/rules/` ou no AGENTS.md do repo"** — promoção é operação nomeada
entre escopos, não cópia manual.
- **Lição RDD**: mesma gramática — aprendizado de sessão → T4/T2; nuance da
  org → pack; padrão generalizável → PR no core. Mover conhecimento entre
  escopos SEM a skill dona do destino = AP-07.
- Fonte: (Devin Docs — Cascade Memories, docs.devin.ai; MemNexus — Windsurf
  Persistent Memory, 2026)

## Lente consolidada — memória funcional × stores do RDD

| Função (MP-08) | Stores RDD | Curado/Derivado (MP-10) |
|----------------|-----------|-------------------------|
| Semântica | T1 `knowledge/` · T2 patterns/metrics | Curado (escritor canônico) |
| Episódica | T4 meetings/ · DECISIONS · KNOWN_ERRORS · reports · PERF_REPORT | Episódios crus; reports = derivados regeneráveis |
| Procedural | T3 rules/ · skills · AGENTS.md · T5 registry/ARCHITECTURE | Curado (muda só via builder/improver/setup) |
| Reflexão (MP-09) | rdd-project-retrospective → rdd-pattern-extractor → T2 | Operação que converte episódio em semântica |

## Checklist aplicável

Avaliar qualquer store de conhecimento (nova ou existente) no RDD:

- [ ] Responde a UMA necessidade dominante do consumidor (estudo × trabalho × ação)? (ref: P-03)
- [ ] É fonte única — nenhum derivado copia este conteúdo sem mecanismo de render/sync? (ref: P-04)
- [ ] Tem escritor canônico nomeado (skill/agent) e consumidores declarados? (ref: P-06)
- [ ] Tem política de staleness: data de origem + gatilho de revisão/expiração? (ref: P-05, MP-03)
- [ ] Carregamento é lazy/on-demand via índice leve — nada "sempre-on" sem justificativa? (ref: P-01, P-07, MP-04)
- [ ] Índice roteia (linka) em vez de replicar conteúdo? (ref: P-04, P-07)
- [ ] Classifica-se corretamente como leitura passiva (reference/resource) ou ação (tool/skill)? (ref: P-08)
- [ ] Migração entre tiers é operação explícita (page-in/page-out), não cópia silenciosa? (ref: P-02, MP-05)
- [ ] Respeita escopo: conhecimento não cruza core/pack/módulo sem promoção explícita? (ref: MP-07, MP-16)
- [ ] Atualização de índice usa operação nomeada e idempotente (merge/NOOP)? (ref: MP-01)
- [ ] Classifica-se como memória semântica, episódica ou procedural — e está na store certa para a função? (ref: MP-08)
- [ ] Se é derivada: é regenerável da fonte curada e nunca tratada como fonte de verdade? (ref: MP-10)
- [ ] Índice sempre-carregado tem cap/limite definido? (ref: MP-12)
- [ ] Existe o PAR de métricas — hit rate E tokens de conhecimento por tarefa? (ref: P-09)
- [ ] Conflito detectado marca o antigo como superado (`superado_por`), não apenas velho? (ref: P-05, MP-13)
- [ ] Granularidade do item casa com a consulta — INDEX roteia para a menor unidade suficiente (arquivo focado ou seção âncora)? (ref: P-10)
- [ ] Gatilhos dimensionados para o modelo em execução — aderência medida, não assumida? (ref: P-11)

## Anti-patterns

### AP-01 — Mirror manual
Cópia de uma store em outro local sem sincronização automática (ex.: biblioteca
de patterns duplicada no repo de docs enquanto o canônico vive no pack).
- Viola: P-04 · Severidade: Crítico

### AP-02 — Append-only eternal
Store que só acumula: sem data, sem revisão, sem remoção. Envelhece em silêncio
e contamina decisões futuras com informação stale.
- Viola: P-05 · Severidade: Alto

### AP-03 — Front-load total
Todo conhecimento empilhado no contexto sempre-carregado (AGENTS.md/system
prompt) "para não esquecer". Consome o orçamento de atenção em todo turno.
- Viola: P-01 · Severidade: Alto

### AP-04 — Store fantasma
Contrato (README/prompt/skill) declara um local de conhecimento que não existe
ou está vazio no disco — o fluxo "funciona" pulando etapas invisíveis.
- Viola: P-06 · Severidade: Médio

### AP-05 — Documento híbrido
Artefato único misturando tutorial, referência e explicação — serve mal todos
os consumos e não tem dono de manutenção claro por seção.
- Viola: P-03 · Severidade: Médio

### AP-06 — Grep cego
Descoberta de conhecimento por busca full-text ad hoc por falta de índice
navegável — custo O(n) por sessão e resultado não-determinístico.
- Viola: P-07 · Severidade: Baixo

### AP-07 — Vazamento de escopo
Conhecimento de um escopo (produto) gravado como se fosse de outro (org/core)
— ex.: nuance de cliente no core, padrão de um produto promovido a regra global
sem validação cruzada.
- Viola: MP-07 · Severidade: Alto

### AP-08 — Derivado tratado como fonte
Relatório, índice gerado ou dashboard editado/consultado como se fosse a
fonte curada — correções vão para o derivado e se perdem na próxima
regeneração.
- Viola: MP-10 · Severidade: Médio

### AP-09 — Semântica presa em episódio
Fato durável (decisão, convenção) que existe apenas dentro de um artefato
episódico (ata de reunião, transcript) sem ser promovido à store semântica —
o conhecimento existe mas não é recuperável por função.
- Viola: MP-08 · Severidade: Médio

### AP-10 — Memória cativa (lock-in de ferramenta)
Conhecimento que só existe dentro de um agente/ferramenta/máquina, sem
exportação legível e versionada — trocar de ferramenta = começar do zero.
Mitigação RDD: conhecimento em Markdown versionado em git (core/pack/docs),
nunca em formato proprietário.
- Viola: P-06 · Severidade: Médio

### AP-11 — Biblioteca morta
Store existente e nunca lida: roteamento/gatilhos que o modelo ignora e
ninguém mediu — o custo de manutenção é pago, o benefício nunca vem.
Mitigação: par de métricas hit rate + tokens/tarefa (P-09) + eval de recall.
- Viola: P-09 · Severidade: Alto

### AP-12 — Item-baleia
Item de conhecimento único e gigante: o INDEX acerta, mas cada acerto carrega
tudo — custo por acerto desproporcional à necessidade. Mitigação: arquivos
focados, seções âncora com heading estável, split na revisão maior.
- Viola: P-10 · Severidade: Médio

### AP-13 — Gatilho otimista
Roteamento desenhado para a aderência de um frontier model e executado por
modelo de menor seguimento — gatilhos sutis ignorados, store nunca acionada.
Mitigação: gatilhos explícitos, redundância estratégica, hit rate segmentado
por modelo.
- Viola: P-11 · Severidade: Alto

## Classificação/Severidade

| Nível | Critério | Ação na triagem |
|-------|----------|-----------------|
| Crítico | Conhecimento canônico copiado em 2+ stores sem sync (AP-01); fonte única violada em decisão arquitetural | bloqueia aprovação |
| Alto | Front-load não justificado (AP-03); store sem política de staleness (AP-02); vazamento de escopo (AP-07); biblioteca morta sem métrica (AP-11); gatilho otimista (AP-13) | corrige antes de aprovar |
| Médio | Store fantasma (AP-04); híbrido (AP-05); derivado como fonte (AP-08); semântica presa em episódio (AP-09); memória cativa (AP-10); item-baleia (AP-12) | backlog priorizado |
| Baixo | Grep cego (AP-06); item de índice sem data | backlog comum |

## Referências

1. Anthropic — Effective context engineering for AI agents — https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents (acessado em 2026-10-21)
2. Anthropic Cookbook — Context engineering: memory, compaction, and tool clearing — https://platform.claude.com/cookbook/tool-use-context-engineering-context-engineering-tools (acessado em 2026-10-21)
3. Anthropic — Advanced tool use — https://www.anthropic.com/engineering/advanced-tool-use (acessado em 2026-10-21)
4. Anthropic — Equipping agents for the real world with Agent Skills — https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills (acessado em 2026-10-21)
5. Claude Code Docs — Memory — https://code.claude.com/docs/en/memory (acessado em 2026-10-21)
6. Packer et al. — MemGPT: Towards LLMs as Operating Systems — https://arxiv.org/abs/2310.08560 (acessado em 2026-10-21)
7. Park et al. — Generative Agents: Interactive Simulacra of Human Behavior — https://arxiv.org/abs/2304.03442 (acessado em 2026-10-21)
8. Zep — A Temporal Knowledge Graph Architecture for Agent Memory — https://arxiv.org/abs/2501.13956 (acessado em 2026-10-21)
9. Xu et al. — A-MEM: Agentic Memory for LLM Agents — https://arxiv.org/abs/2502.12110 (acessado em 2026-10-21)
10. Diátaxis — https://diataxis.fr/ (acessado em 2026-10-21)
11. Model Context Protocol — https://modelcontextprotocol.io/docs/2026-07-28/getting-started/intro (acessado em 2026-10-21)
12. LangChain — Context engineering for agents — https://www.langchain.com/blog/context-engineering-for-agents/ (acessado em 2026-10-21)
13. LangChain — LangMem SDK for agent long-term memory — https://www.langchain.com/blog/langmem-sdk-launch (acessado em 2026-10-21)
14. LangChain Docs — Memory overview — https://docs.langchain.com/oss/python/concepts/memory (acessado em 2026-10-21)
15. OpenAI — Memory and new controls for ChatGPT — https://openai.com/index/memory-and-new-controls-for-chatgpt (acessado em 2026-10-21)
16. Forte Labs — The PARA Method — https://fortelabs.com/blog/para (acessado em 2026-10-21)
17. Cursor Docs — Rules / AGENTS.md — https://cursor.com/docs/rules (acessado em 2026-10-21)
18. Devin Docs — Cascade Memories — https://docs.devin.ai/desktop/cascade/memories (acessado em 2026-10-21)
19. Mem0 — State of AI Agent Memory 2026 — https://mem0.ai/blog/state-of-ai-agent-memory-2026 (acessado em 2026-10-21)
20. Digital Applied — Open-Source Agent Memory: Mem0 vs Letta vs Zep Compared — https://www.digitalapplied.com/blog/open-source-agent-memory-mem0-letta-zep-compared (acessado em 2026-10-21)
21. Upsolve — AI Agent Memory Explained — https://upsolve.ai/blog/ai-agent-memory (acessado em 2026-10-21)
22. The AI Engineer — RAG vs Fine-Tuning — https://theaiengineer.substack.com/p/rag-vs-fine-tuning (acessado em 2026-10-21)
23. Anthropic — Building effective agents — https://www.anthropic.com/research/building-effective-agents (acessado em 2026-10-21)
