---
dominio: reverse-engineering
versao: 1.4.0
data_pesquisa: 2026-11-02
proxima_revisao: 2027-05-02
escopo: Engenharia reversa de sistemas existentes com IA (LLM-assisted RE) para documentação — extração de modelo de dados, contratos, regras de negócio e bounded context de código multi-repo com ancoragem em evidência e verificação anti-alucinação; e estrutura de artefatos de RE orientada a migração total de sistema (camada reverse/ de produto) com referências ADM/KDM/SMM, blueprints, ciclo de vida de regras candidatas e paridade comportamental
fontes:
  - titulo: "Potential and Challenges of Large Language Models for Reverse Engineering (survey sistemático — 48 papers, revisado out/2026)"
    url: https://arxiv.org/abs/2509.21821
    acessado_em: 2026-10-23
    versao: v2
  - titulo: "Citation-Grounded Code Comprehension: Preventing LLM Hallucination Through Hybrid Retrieval and Graph-Augmented Context"
    url: https://arxiv.org/html/2512.12117
    acessado_em: 2026-10-23
  - titulo: "Codebase-Memory: Tree-Sitter-Based Knowledge Graphs for LLM Code Exploration via MCP"
    url: https://arxiv.org/abs/2603.27277
    acessado_em: 2026-10-23
  - titulo: "Leveraging Generative AI for Extracting Business Requirements from Legacy COBOL and PL/I Code (EPAM — pipeline híbrido, 85% acurácia em regras)"
    url: https://aclanthology.org/2026.acl-industry.4.pdf
    acessado_em: 2026-10-23
  - titulo: "MDRE-LLM: A Tool for Analyzing and Applying LLMs in Software Reverse Engineering (SANER 2025 — validação contra baseline determinístico)"
    url: https://www.computer.org/csdl/proceedings-article/saner/2025/351000a850/26TIo54RfIA
    acessado_em: 2026-10-23
  - titulo: "LLM Driven Business Rule Extraction from Enterprise Applications (SANER 2026 — pipeline program slicing → inferência → NL)"
    url: https://www.computer.org/csdl/proceedings-article/saner/2026/858200a888/2hNeOv7HArK
    acessado_em: 2026-10-23
  - titulo: "Natural Language Summarization Enables Multi-Repository Bug Localization by LLMs in Microservice Architectures (46 repos, 1.1M LOC)"
    url: https://arxiv.org/abs/2512.05908
    acessado_em: 2026-10-23
  - titulo: "Hierarchical Repository-Level Code Summarization for Business Applications Using Local LLMs (TCS)"
    url: https://arxiv.org/abs/2501.07857
    acessado_em: 2026-10-23
  - titulo: "Agent4cs: A Multi-agent System for Code Summarization in Large Hierarchical Codebases"
    url: https://arxiv.org/html/2607.01425
    acessado_em: 2026-10-23
  - titulo: "Automating Domain-Driven Design: Experience with a Prompting Framework (5 passos: linguagem ubíqua → event storming → BCs → agregados → arquitetura)"
    url: https://arxiv.org/html/2603.26244v1
    acessado_em: 2026-10-23
  - titulo: "Chain-of-Verification Reduces Hallucination in Large Language Models (ACL Findings 2024)"
    url: https://aclanthology.org/2024.findings-acl.212.pdf
    acessado_em: 2026-10-23
  - titulo: "Towards Automated Domain Model Extraction from Source Code using Heuristics and Open-Source LLMs (acúmulo progressivo de contexto de domínio)"
    url: https://arxiv.org/pdf/2608.12228v1
    acessado_em: 2026-10-23
  - titulo: "AgentModernize: Preserving Business Logic in Legacy Modernization with Multi-Agent LLMs and Behavioral Specification Graphs (representation intermediária inspecionável como trust boundary)"
    url: https://arxiv.org/pdf/2605.17535v1
    acessado_em: 2026-10-23
  - titulo: "AI-Assisted Software Reverse Engineering: Workflow, Scope, Applications, and Techniques (IEEE Access 2025)"
    url: https://ieeexplore.ieee.org/abstract/document/11098869
    acessado_em: 2026-10-23
  - titulo: "Legacy IT Modernization with AI (MITRE — LLM logic extraction: comentários, UML, requirements docs)"
    url: https://www.mitre.org/sites/default/files/2025-06/PR-25-0278-5-Legacy-IT-Modernization-with-AI.pdf
    acessado_em: 2026-10-23
  - titulo: "COBRAIN: An LLM-based Tool for Extracting Business Rules from COBOL (EASE 2025 — one-shot prompting vs ferramenta rule-based)"
    url: https://dl.acm.org/doi/full/10.1145/3756681.3756982
    acessado_em: 2026-10-23
  - titulo: "codebase-memory-mcp (DeusData) — SECURITY.md e README v0.12.1 (ferramenta validada em piloto local)"
    url: https://github.com/DeusData/codebase-memory-mcp
    acessado_em: 2026-10-23
    versao: v0.12.1
  - titulo: "OMG KDM — Knowledge Discovery Metamodel v1.4 (ISO/IEC 19506:2012 — metamodelo padrão para representar software existente como fatos interligáveis entre ferramentas)"
    url: https://www.omg.org/spec/KDM/1.4/About-KDM
    acessado_em: 2026-10-31
    versao: v1.4 (ISO/IEC 19506:2012 confirmada em 2025)
  - titulo: "OMG SMM — Structured Metrics Metamodel v1.2 (medidas definidas em bibliotecas; medições aplicadas via observações datadas com ferramenta)"
    url: https://www.omg.org/spec/SMM/1.2
    acessado_em: 2026-10-31
    versao: v1.2
  - titulo: "CAST Imaging V3 — blueprint automático de aplicação (transações end-to-end UI→dados, annotations Document-It, cases de modernização PMMC/Accenture/Thoughtworks)"
    url: https://doc.castsoftware.com/imaging/
    acessado_em: 2026-10-31
  - titulo: "Martin Fowler — Strangler Fig Application (modernização incremental; 4 atividades de Patterns of Legacy Displacement)"
    url: https://www.martinfowler.com/bliki/StranglerFigApplication.html
    acessado_em: 2026-10-31
  - titulo: "Azure Architecture Center — Strangler Fig pattern (façade roteia legado→novo; anti-corruption layer; transform-coexist-eliminate)"
    url: https://learn.microsoft.com/en-us/azure/architecture/patterns/strangler-fig
    acessado_em: 2026-10-31
  - titulo: "AWS Prescriptive Guidance — Strangler Fig na decomposição de monólitos (transform, coexist, eliminate)"
    url: https://docs.aws.amazon.com/prescriptive-guidance/latest/modernization-decomposing-monoliths/strangler-fig.html
    acessado_em: 2026-10-31
  - titulo: "Characterization test / Golden Master Testing (Feathers — testar comportamento real, não o desejado; historical oracle)"
    url: https://en.wikipedia.org/wiki/Characterization_test
    acessado_em: 2026-10-31
  - titulo: "ModernizeSpec — Parity Testing (parity-tests.json com knownDeviation; golden files com diff campo-a-campo; lifecycle capture→parity→guard→retire)"
    url: https://modernizespec.dev/techniques/parity-testing/
    acessado_em: 2026-10-31
  - titulo: "SelectWise — Characterisation Tests for Legacy Migration (registro de desvios com aprovador e data; compatibilidade bug-a-bug como default; aceitação de milestone por evidência)"
    url: https://selectwise.io/blog/characterisation-tests-legacy-migration
    acessado_em: 2026-10-31
  - titulo: "Richard Seidl — Migration Testing (legado como test oracle; 7 passos; metas de cobertura em TSA)"
    url: https://www.richard-seidl.com/en/blog/migration-test/
    acessado_em: 2026-10-31
  - titulo: "Great Migrations — Verifying Functional Equivalence (FEQ) / ACT (comparação automatizada old-vs-new por entradas e saídas coletadas)"
    url: https://www.greatmigrations.com/downloads/sections/docs/articles-and-whitepapers/technical-topics/verifying-functional-equivalence-feq.pdf
    acessado_em: 2026-10-31
  - titulo: "Google Cloud Mainframe Assessment Tool — Extract business rules (regras extraídas em Gherkin com status atualizável e validação por dono de processo antes da modernização)"
    url: https://docs.cloud.google.com/mainframe-assessment-tool/docs/business-rules-extraction
    acessado_em: 2026-10-31
  - titulo: "Cosentino, Cabot et al. — BREX: Extracting Business Rules from COBOL (WCRE 2013 — vocabulário + program slicing; 4 fases: model discovery, variable id, rule id, rule representation)"
    url: https://inria.hal.science/hal-00869236v1/document
    acessado_em: 2026-10-31
  - titulo: "Montora — Business Rule Extraction (draft de regra em linguagem natural por unidade de código, linkada à fonte, com dono; especialistas confirmam/corrigem/rejeitam; confirmadas alimentam migração e testes)"
    url: https://www.montoralabs.com/business-rule-extraction
    acessado_em: 2026-10-31
  - titulo: "Fresche X-Analysis — Recovering Business Rules and Data Models (regras indexadas em repositório estruturado com cross-reference de volta ao código fonte)"
    url: https://fr.freschesolutions.com/wp-content/uploads/archive/white_papers/Recovering_Business_Rules_and_Data_Models.pdf
    acessado_em: 2026-10-31
  - titulo: "Access International — ATLAS Toolkit (padrões open-source de modernização com harness de parity testing contra valores golden capturados do legado)"
    url: https://github.com/AccessInter/atlas-toolkit
    acessado_em: 2026-10-31
  - titulo: "Thoughtworks — From black box to blueprint (assessment rápido de legado com CAST + análise de incidentes; ack explícito do cliente na descrição da arquitetura)"
    url: https://www.thoughtworks.com/insights/blog/legacy-modernization/from-black-box-to-blueprint-how-we-performed-rapid-assessment-of-legacy-system
    acessado_em: 2026-10-31
---
# KNOWLEDGE — Reverse Engineering (engenharia reversa de sistemas existentes com IA para documentação)

Base canônica do domínio para consumo pela camada de engenharia reversa do RDD
(`@rdd-reverse-orchestrator` e skills de documentação de sistemas existentes).
Fonte canônica de critérios — componentes que consomem este domínio listam
este arquivo no "Lê (upstream)" deles. Atualizar via rdd-domain-research
quando `proxima_revisao` vencer.

Síntese do survey de referência (arXiv:2509.21821, 48 papers): RE assistida
por LLM funciona melhor quando **ancorada em evidência determinística +
verificação explícita** — LLM puro degrada; híbrido determinístico+LLM é o
padrão de estado da arte.

## Ferramenta validada — codebase-memory-mcp (piloto 2026-10-23)

Grafo de conhecimento de código via MCP (tree-sitter + Hybrid LSP, binary C
único, MIT) **validado em piloto controlado local** — v0.12.1 (DeusData,
repo canônico; desconfiar de espelhos como `elarsaks/` com 0 stars) indexando
um projeto .NET Clean Architecture local: 5.832 nodes / 25.322 edges em 8,5s.

- **Supply-chain verificado antes de rodar**: SHA-256 = checksums.txt ·
  `gh attestation verify` (SLSA Level 3, workflow `_build.yml` do DeusData) ·
  Windows Defender scan limpo · `install.ps1` NUNCA executado (config MCP
  manual). Única chamada de rede em runtime: update-check no api.github.com
  (5s, bloqueável); `.env`/gitignored excluído do índice por design.
- **Ganhos medidos por fatia do rdd-reverse-orchestrator:**
  - Fatia 1 (BCs): `get_architecture` devolve clusters Louvain + boundaries
    por fan-in/fan-out real (confirmou a Clean Architecture do repo por
    estrutura de call graph, não por pastas) — reforça P-07.
  - Fatia 2 (modelo): `search_graph "*Configuration*"` listou 19 configs EF
    com arquivo+linhas em 1 query (~100 tokens vs N greps).
  - Fatia 4 (regras): `trace_path` de uma regra de negócio de domínio
    (validação entre entidades relacionadas) devolveu **47 callers** com
    hop-distance atravessando Services → Repositories → Controllers →
    UnitTests — ~96% menos tokens que rastrear manualmente; grep não resolve
    call chains multi-arquivo.
- **Limitações conhecidas (manter grep como fonte primária onde aplica):**
  - Nodes `Route` **não capturam atributos ASP.NET** (`[HttpGet]`/`[Route]`) —
    Fatia 3 (endpoints) continua com matriz de grep por stack; grafo entra
    como complemento (call chains dos handlers).
  - CLI frágil no PowerShell: usar `--args-file <json>` (nunca JSON inline);
    exit code 1 mesmo em sucesso; filtrar warning de allocator com `2>$null`.
- **Postura adotada no RDD:** grafo é **complemento determinístico** do grep
  (P-01) — nunca substitui a matriz de padrões por stack; habilitado via
  skill `rdd-mcp-codegraph-setup` com permissão `mcp.*` no orchestrator.
- Fonte: (GitHub DeusData/codebase-memory-mcp v0.12.1 + SECURITY.md, acessado
  em 2026-10-23; piloto local em projeto .NET Clean Architecture, 2026-10-23 —
  detalhes de org no acúmulo privado do pack)

## Princípios

### P-01 — Pipeline híbrido determinístico → LLM → validação contra baseline
Mineração estrutural determinística (grep/glob/AST/migrations) produz "fatias
de código"; o LLM sintetiza em linguagem de negócio; o resultado é validado
contra o baseline determinístico (ex.: tabela citada existe na migration;
endpoint citado existe no controller). Pipeline COBOL/PL/I da EPAM atingiu
85% de acurácia em regras de negócio com esse arranjo.
- **Heurística de violação**: relatório gerado sem passo determinístico prévio
  (LLM lendo código "solto") ou sem validação final contra a fonte.
- Fonte: (EPAM/ACL 2026; MDRE-LLM, SANER 2025)

### P-02 — Ancoragem de evidência (citation-grounded)
Toda afirmação estrutural (regra, tabela, endpoint, tela) carrega citação
mecanicamente verificável: `[repo/caminho/arquivo:linha @hash]`. A falha
dominante de LLM em RE é citar arquivo inexistente, faixa de linha fora do
arquivo ou citação vaga demais para verificação.
- **Heurística de violação**: citação sem hash, sem linha, ou apontando
  entidade que não pode ser aberta e conferida por um terceiro.
- Fonte: (Citation-Grounded Code Comprehension, arXiv:2512.12117)

### P-03 — Verificação mecânica de citações
Citações não são confiáveis por construção — devem ser checadas por script
determinístico (arquivo existe? linha ≤ tamanho do arquivo? hash bate com o
HEAD congelado?). Verificação mecânica pega arquivo fabricado e faixa de
linha inventada antes do humano; verificação manual atrasa e escapa.
- **Heurística de violação**: relatório entregue sem pass de checagem, ou
  citação inválida aceita "para revisar depois".
- Fonte: (Citation-Grounded Code Comprehension, arXiv:2512.12117; SymGen,
  MIT CSAIL)

### P-04 — Baseline de completude (contagens verificáveis)
A análise declara explicitamente o que cobriu contra o que existe:
"migrations listam 42 tabelas — cobertas 42/42"; "controllers expõem 27
endpoints — mapeados 27/27". Lacuna vira número, não silêncio — o leitor vê
a cobertura sem reabrir o código.
- **Heurística de violação**: relatório sem contagens, ou cobertura parcial
  sem declaração da parte faltante.
- Fonte: (MDRE-LLM, SANER 2025 — validação contra baseline determinístico;
  EPAM/ACL 2026)

### P-05 — Sumarização hierárquica para repositórios grandes
Repos muito grandes (>~500 arquivos) não devem ser varridos linearmente:
construir índice function → file → directory → repo e fazer deep-dive
seletivo depois. Validado em sistema industrial com 46 repos e 1.1M LOC —
busca NL→NL em resumos hierárquicos supera retrieval cruzado.
- **Heurística de violação**: varredura linear em repo grande com declaração
  de escopo genérica ("analise o repo inteiro") e sem índice prévio.
- Fonte: (arXiv:2512.05908; Agent4cs, arXiv:2607.01425; TCS, arXiv:2501.07857)

### P-06 — Autoverificação em cadeia (CoVe) antes de finalizar
Antes de entregar o relatório, o analista planeja perguntas de verificação
(toda RN tem evidência? grau coerente com o tipo de evidência? endpoints dos
DTOs batem com controllers?), responde cada uma contra o código e corrige o
próprio rascunho. Reduz alucinação sem custo de modelo.
- **Heurística de violação**: relatório finalizado sem pass de autochecagem
  declarado.
- Fonte: (Chain-of-Verification, ACL Findings 2024)

### P-07 — Detecção de Bounded Contexts por eventos + estrutura (não só pastas)
Estrutura de pastas é sinal fraco em monólitos. Método estruturado: (1)
linguagem ubíqua dos nomes de classes/métodos, (2) event storming simulado —
minar eventos/handlers/consumidores e clusterizar por fluxo, (3) derivar BCs
dos clusters, (4) identificar agregados por dentro do cluster.
- **Heurística de violação**: BCs declarados apenas por pastas/top-level
  modules sem suporte de eventos ou vocabulário.
- Fonte: (Automating DDD, arXiv:2603.26244)

### P-08 — Representation intermediária inspecionável (trust boundary)
A extração deve materializar lógica em representação explícita e inspecionável
(regras em EARS/Gherkin, modelos, contratos) ANTES de virar artefato
downstream — forçar o LLM a tornar explícito o que entendeu cria fronteira de
confiança entre compreensão e geração.
- **Heurística de violação**: geração direta de specs downstream sem passagem
  por representação intermediária verificável.
- Fonte: (AgentModernize — Behavioral Specification Graphs, arXiv:2605.17535;
  MITRE ITMOD)

### P-09 — Acúmulo progressivo de contexto de domínio
Conforme a análise avança (arquivo → diretório → contexto), o analista
acumula conhecimento de domínio (vocabulário, entidades, convenções) e o
utiliza para refinar a classificação domínio-vs-implementação das próximas
unidades — sob contexto limitado, iteração com memória supera passada única.
- **Heurística de violação**: fatias analisadas isoladamente, sem
  reaproveitar vocabulário/entidades descobertas nas anteriores.
- Fonte: (arXiv:2608.12228)

### P-10 — Modelo intermediário padronizado como contrato entre fases (KDM)
A compreensão do sistema existente deve materializar-se numa representação
intermediária explícita — "coleção de fatos" organizada em domínios/views
(KDM chama de segments; a ISO/IEC 19506 define isso como contrato de
intercâmbio entre ferramentas) — que separa a ANÁLISE da TRANSFORMAÇÃO: as
ferramentas/fases downstream consomem fatos, não código cru. No RDD, a
camada `reverse/` do produto é esse contrato: reports append-only + fila de
candidatas + cobertura são os fatos; specs/RN são o downstream que os consome.
- **Heurística de violação**: análise que alimenta specs diretamente, sem
  representação intermediária persistida e versionada por rodada.
- Fonte: (OMG KDM v1.4 / ISO/IEC 19506:2012; AgentModernize P-08)

### P-11 — Métrica de cobertura separa definição, resultado e observação (SMM)
O padrão OMG para métricas de modernização distingue: **measure** (definição
reutilizável do cálculo — ex.: "endpoints mapeados/endpoint expostos"),
**measurement** (resultado aplicado a um escopo) e **observation** (rodada
datada, tagged com a ferramenta que produziu). A cobertura de um reverse não
é um número solto no relatório: é uma série histórica de observações
comparáveis entre rodadas (full/delta) — tendência de cobertura é rastreável.
No RDD, `COVERAGE.md` incorpora isso: definição de contagem por fatia +
resultado da rodada atual com data/hash.
- **Heurística de violação**: contagem de cobertura sem data/ferramenta/escopo,
  ou definida de forma diferente entre rodadas (impossível comparar).
- Fonte: (OMG SMM v1.2 — conceitos measure/measurement/observation)

### P-12 — Regra candidata tem ciclo de vida com status e dono
Práticas de market de business rule extraction convergem: a regra extraída
nasce como **draft** vinculado à evidência de código, recebe **dono** (o
especialista que valida), passa por estados explícitos (draft →
confirmada/corrigida/rejeitada) e **só as confirmadas alimentam migração e
testes** (Google MAT: "review and validate rules" + "update rule status";
Montora: "Confirmed by people, not assumed by a model"; BREX: regras
"validadas por stakeholders"). Regra sem dono e sem status não entra no
pipeline downstream.
- **Heurística de violação**: regra extraída propagada para specs sem registro
  de quem confirmou e em que data.
- Fonte: (Google Cloud Mainframe Assessment — Extract business rules; Montora;
  BREX/WCRE 2013)

### P-13 — Paridade comportamental por characterization/golden master com registro de desvios
Para migração/refatoração, o legado É a especificação: captura-se o
comportamento real (inputs → outputs) como golden master antes da migração,
o novo sistema reproduz os mesmos outputs, e toda divergência é decidida
explicitamente (bug-a-bug por default) e registrada com aprovador e data
(`knownDeviation`). Cobertura da paridade vira critério de aceitação de
milestone (Seidl: legado como test oracle, metas em TSA). No RDD,
`PARITY_CHECKLIST.md` é esse registro; itens nascem das RNs confirmadas +
superfícies inventariadas no reverse.
- **Heurística de violação**: migração sem golden master prévio, ou divergência
  "corrigida" silenciosamente sem registro de aprovação.
- Fonte: (Feathers/Characterization test; ModernizeSpec parity-testing;
  SelectWise; Seidl; Great Migrations FEQ/ACT; ATLAS toolkit)

### P-14 — Migração incremental por fatias com coexistência (Strangler Fig)
Migração total de sistema não é big-bang: substitui-se por fatias (BCs de
preferência), com façade roteando legado→novo e anti-corruption layer nas
costuras; o ciclo é transform → coexist → eliminate por fatia, e as quatro
atividades-chave incluem "understand the outcomes" e "break the problem into
smaller parts" ANTES de entregas (a análise reverse alimenta exatamente essas
duas). No RDD, `MIGRATION_PLAN.md` ordena fatias por BC; cada fatia sai do
legado com paridade provada (P-13) antes do eliminate.
- **Heurística de violação**: plano de migração big-bang sem fatias, ou fatias
  sem paridade provada antes de desligar o legado correspondente.
- Fonte: (Fowler Strangler Fig 2024; Azure Architecture Center; AWS Prescriptive
  Guidance)

### P-15 — Sharding por Bounded Context para sistemas gigantes (IMP-143)
Os "fatos" do KDM são organizados em segments por domínio/viewpoint — para um
sistema gigante, a análise e os ARTEFATOS seguem o mesmo recorte: avaliado o
gatilho de tamanho na Fatia 1 (contagens determinísticas: >3 BCs OU >80 tabelas
OU >60 endpoints OU projeção de report >1.500 linhas), o scan vira **staged**
(um run por BC, retomável via REVERSE_STATE) e os artefatos particionam em
`reverse/<BC>/` (CANDIDATES, COVERAGE, REVERSE_REPORT por contexto), com
`reverse-index.md` como ponto de entrada único (TOC: BC → arquivos → contagens
da última rodada). Nunca gerar nem ler um relatório-monólito do sistema todo.
- **Heurística de violação**: scan full único em sistema que dispara o gatilho,
  ou skill downstream lendo a camada reverse inteira em vez de index + arquivo
  do BC alvo.
- Fonte: (OMG KDM v1.4 / ISO 19506 — segments; ver P-10; P-05 como fundação
  de entrada; gatilho operacional IMP-143)

### P-16 — Regras não vivem só no código da aplicação (DB, jobs, config)
Para migração completa, o inventário de onde a lógica mora inclui: stored
procedures e triggers (regras executáveis pelo banco — grau de confiança Alto),
jobs agendados/batch ("a cada X, o sistema faz Y"), **tabelas de configuração**
cujo conteúdo altera comportamento (regra dirigida por dado — confiança Média,
requer triagem) e a lógica imperativa de service. **Regra cross-unit**:
transaction boundaries atravessam múltiplas procedures e triggers cascateiam —
minar SPs/triggers exige sinalizar chamadas/cascatas entre unidades como
candidata a PEND (a regra é maior que a unidade onde foi encontrada).
- **Heurística de violação**: migração que inventariou apenas tabelas/colunas do
  banco e validadores da aplicação — SPs/triggers/jobs/config descobertos em
  produção após o cutover.
- Fonte: (AWS Migration Blog — business rules em SPs; Pineido — inventário
  completo de DB; Joanes/Medium — boundaries cross-procedure e cascata; ISEC
  2012 IITM — slicing de batch; prática de mercado de rule extraction)

### P-17 — Paridade de UI é dual (pixel + semântica) e inclui comportamento
Screenshot e ária snapshot são metades complementares: o pixel captura
"como parece" (layout, cor, espaçamento); o snapshot de acessibilidade captura
"o que significa" (roles, labels, hierarquia) — e cada um tem cegueira que o
outro cobre (um botão que perde aria-label move zero pixels; um gradiente
quebrado move zero nós de ária). **E nenhuma captura estática pega Logic
Drift**: UI visualmente idêntica com comportamento diferente (cálculo no
onBlur em vez de onClick; estado de passo de formulário não limpo entre etapas)
— apontado como causa dominante de falha em reescritas legacy. Captura de UI
para migração exige: screenshot + ária por estado E registro de transições/
eventos (fluxos multi-passo com o que é limpo/persistido entre passos).
- **Heurística de violação**: paridade validada só por screenshot ("parece
  igual" → ✅) sem comparação semântica nem teste de transição/evento.
- Fonte: (real-a11y — visual vs accessibility snapshots; orchestkit — ARIA
  diffing; Replay — Logic Drift Trap; Playwright — aria snapshots)

### P-18 — Captura visual determinística com aprovação humana de desvios
Golden master de UI só é comparável se a captura for determinística: viewport
fixo, dados de fixture sintéticos controlados, **regiões dinâmicas mascaradas**
(timestamps, animações — elemento com marcador de mask preenchido antes do
diff) e ambiente consistente (render varia por OS/fonts/browser). Para
old-vs-new: threshold inicial ≤0,5% de pixels diferentes por tela (ajustável),
diff PNG anexado como evidência — e o fluxo de review é humano (mudança visual
fica pendente de aprovação, não falha automática: cada desvio vira decisão
registrada — knownDeviation, P-13).
- **Heurística de violação**: baselines capturados com dados vivos/animados
  (suite instável), ou diff automático bloqueando sem registro de aprovação
  humana por desvio.
- Fonte: (Playwright — visual comparisons/pixelmatch/threshold; ADR loop-monitor
  2026-05 — migração UI com capture-once, mask, threshold ≤0.5%; Percy — fluxo
  de aprovação de mudanças visuais)

## Checklist aplicável

- [ ] Passo determinístico anterior à síntese LLM (grep/glob/migrations por stack) (ref: P-01)
- [ ] Toda afirmação estrutural com citação `[repo/caminho:linha @hash]` (ref: P-02)
- [ ] Pass de verificação mecânica das citações executado antes da entrega (ref: P-03)
- [ ] Contagens de completude declaradas (tabelas, endpoints, telas) (ref: P-04)
- [ ] Repo grande com índice hierárquico antes do deep-dive (ref: P-05)
- [ ] Checklist de autoverificação respondido e correções aplicadas (ref: P-06)
- [ ] BCs derivados de eventos/vocabulário, não só pastas (ref: P-07)
- [ ] Regras em formato inspecionável (EARS/Gherkin) antes de virar spec (ref: P-08)
- [ ] Glossário de domínio acumulado e reutilizado entre fatias (ref: P-09)
- [ ] Grau de confiança coerente com o tipo de evidência em toda RN (ref: P-01, P-08)
- [ ] Análise persistida como representação intermediária versionada por rodada, antes de alimentar specs (ref: P-10)
- [ ] Cobertura com definição de contagem + resultado + data/ferramenta da rodada (comparável entre rodadas) (ref: P-11)
- [ ] Toda regra candidata com status explícito e dono registrado antes de propagar (ref: P-12)
- [ ] Golden masters capturados do legado e registro de desvios com aprovador/data antes do cutover (ref: P-13)
- [ ] Plano de migração por fatias (BCs) com paridade provada por fatia antes do desligamento do legado (ref: P-14)
- [ ] Gatilho de gigantismo avaliado na Fatia 1 (>3 BCs / >80 tabelas / >60 endpoints / >1.500 linhas projetadas) com modo flat|staged declarado (ref: P-15)
- [ ] Sistema staged com reverse-index.md atualizado e leitura downstream seletiva (index + BC alvo) (ref: P-15)
- [ ] Fila de candidatas com arquivamento em bloco frio (graduadas/rejeitadas em 1 linha; área viva só com pendentes/recentes) (ref: P-12, P-15)
- [ ] Inventário de regras inclui SPs/triggers/CHECK/jobs agendados/tabelas de configuração, com chamadas e cascatas cross-unit sinalizadas como PEND (ref: P-16)
- [ ] Captura de UI por estado com screenshot + ária snapshot, e transições/eventos de fluxos multi-passo registrados como candidatas comportamentais (ref: P-17)
- [ ] Golden master de UI determinístico: viewport fixo, fixture sintética, regiões dinâmicas mascaradas; desvios de paridade com aprovação humana registrada (ref: P-18, P-13)

## Anti-patterns

### AP-01 — Análise LLM-sola (sem âncora determinística)
LLM lê arquivos livremente e produz relatório sem mineração estrutural prévia
nem validação final. Resultado: regras plausíveis mas inexistentes, tabelas
inventadas.
- Viola: P-01 · Severidade: Crítico

### AP-02 — Citação fabricada ou não verificável
Relatório cita `auth/validator.py` que não existe, `:800-850` num arquivo com
300 linhas, ou `[arquivo]` sem hash — os 3 modos de falha medidos no estudo de
citation-grounded comprehension.
- Viola: P-02, P-03 · Severidade: Crítico

### AP-03 — Varredura linear de repo gigante
Varrer 1000+ arquivos em sequência com contexto finito: as últimas fatias
degradam, sinal se perde, e o relatório reflete o começo do repo mais que o
todo.
- Viola: P-05 · Severidade: Alto

### AP-04 — Silêncio de cobertura
Relatório não diz o que NÃO cobriu — leitor assume completude; lacuna só
aparece quando dev implementa a partir da spec e esbarra no faltante.
- Viola: P-04 · Severidade: Alto

### AP-05 — Bounded Context por pastas
Declarar BCs a partir só de estrutura de diretório em monólito legado onde
pastas misturam subdomínios — gera agregados artificialmente grandes e
regras atribuídas ao contexto errado.
- Viola: P-07 · Severidade: Médio

### AP-06 — Grau de confiança otimista
Classificar regra como "Alta" por convenção de nomenclatura ou comentário
`// TODO` — o grau deve seguir a natureza da evidência (event/handler
explícito > constraint de schema > nomenclatura).
- Viola: P-01, P-08 · Severidade: Médio

### AP-07 — Passadas isoladas sem memória de domínio
Analisar cada fatia/Bounded Context do zero, reinventando vocabulário e
re-descobrindo entidades — desperdiça contexto e gera glossário
inconsistente entre seções.
- Viola: P-09 · Severidade: Baixo

### AP-08 — Blueprint sem acknowledgment (reconhecimento) humano
Blueprint/reverse completo e tecnicamente correto mas nunca revisado pelo
dono do sistema — a organização não "assume" a descrição como verdade
compartilhada; o blueprint degrada para documento morto (prática de mercado:
o cliente revisa e reconhece a descrição da arquitetura como parte do método).
- Viola: P-10, P-12 · Severidade: Alto

### AP-09 — Migração big-bang sem paridade
Rewrite completo de uma vez, sem fatias nem golden masters — divergências
funcionais só aparecem em produção; sem registro de desvios, ninguém sabe se
uma diferença foi decisão ou bug.
- Viola: P-13, P-14 · Severidade: Crítico

### AP-10 — Fila de regras candidatas sem dono
Regras candidatas acumuladas em snapshots append-only sem fila viva com
status/dono — candidatas não validadas são silenciosamente esquecidas entre
rodadas de reverse.
- Viola: P-12 · Severidade: Alto

### AP-11 — Relatório-monólito de sistema gigante
Sistema que dispara o gatilho de tamanho analisado/gerado como documento único
(scan full único, fila sem arquivamento, leitura downstream do arquivo inteiro):
geração degradada no subagent e atenção degradada (lost-in-the-middle) em
qualquer skill que consuma — a camada reverse cresce sem teto até virar
inutilizável.
- Viola: P-15, P-05, P-12 · Severidade: Alto

### AP-12 — Paridade visual-only (armadilha do Logic Drift)
Migração de UI validada apenas por comparação de screenshots — a nova tela
"passa" idêntica ao legado enquanto o comportamento diverge (evento no lugar
errado, estado não limpo entre passos, binding assíncrono ausente). Aparência
igual + lógica diferente é a falha mais cara de reescritas e não move um pixel.
- Viola: P-17, P-13 · Severidade: Alto

### AP-13 — Inventário de banco sem SPs/triggers/jobs/config
Modelo de dados da migração mapeia tabelas/colunas e ignora stored procedures,
triggers, jobs agendados e tabelas de configuração — regras descobertas em
produção após o cutover, quando o custo de correção é máximo.
- Viola: P-16 · Severidade: Alto

## Estrutura de artefatos para migração — síntese v1.2.0 (referências → RDD)

Mapeamento das práticas de mercado para a camada `reverse/` (matéria-prima)
e `migration/` (opcional, para migração total) dentro do produto RDD:

| Prática de mercado | Referência | Artefato RDD |
|---|---|---|
| Representação intermediária de fatos sobre o sistema existente | OMG KDM (ISO/IEC 19506) | `reverse/REVERSE_REPORT_<ts>.md` (append-only por rodada) + `reverse/REVERSE_STATE.md` (checkpoint) |
| Métricas com definição/resultado/observação datada | OMG SMM v1.2 | `reverse/COVERAGE.md` (baseline de cobertura por fatia, por rodada, comparável) |
| Regra extraída como draft com status e dono, validada por especialista antes de propagar | Google Mainframe Assessment (regras em Gherkin com status), Montora (dono + confirmação humana), BREX (vocabulário + slicing) | `reverse/CANDIDATES.md` (fila viva: pending/approved→RN/rejected→PEND com aprovador e data) |
| Blueprint com annotations e reconhecimento do dono do sistema | CAST Imaging (Document-It, cases PMMC/Thoughtworks) | Validação humana da Etapa 3 do `rdd-doc` + acknowledgment no REQUIREMENTS |
| Paridade comportamental legado→novo com registro de desvios aprovados | Feathers (characterization tests), ModernizeSpec (`knownDeviation`), Seidl (legado como test oracle), FEQ/ACT, ATLAS toolkit | `migration/PARITY_CHECKLIST.md` (item por RN/superfície; golden master; desvio com aprovador) |
| Migração incremental por fatias com coexistência | Strangler Fig (Fowler/Azure/AWS — transform, coexist, eliminate) | `migration/MIGRATION_PLAN.md` (ordenação por BC; façade/ACL por fatia) |
| Mapeamento de dados legado→novo | X-Analysis (repositório de regras cross-referenciado ao código), `rdd-migration` (cutover de dados) | `migration/DATA_MAP.md` |

**Fronteira dura (compatível com a DAG):** a camada `reverse/` alimenta
`REQUIREMENTS.md`/`specs/` — nunca compete com eles. Candidata só ancora
feature depois de graduada em RN (com dono e data — P-12). Para produtos sem
objetivo de migração total, `migration/` não existe; a camada `reverse/`
sozinha já cobre documentação viva.

## Classificação/Severidade

| Nível | Critério | Ação na triagem |
|-------|----------|-----------------|
| Crítico | Citação fabricada/não verificável; regra sem evidência; análise LLM-sola | bloqueia aceitação do relatório — refazer com âncora |
| Alto | Cobertura incompleta não declarada; grau de confiança incoerente; BC sem suporte de eventos | corrige antes de propagar para specs downstream |
| Médio | Vocabulário ubíquo inconsistente; agregado mal agrupado; PII não sinalizada em campo claro | backlog priorizado — ajusta na revisão do rdd-doc |
| Baixo | Glossário com termos duplicados; convenção de nomenclatura divergente sem impacto | backlog comum |

## Referências

1. Potential and Challenges of LLMs for Reverse Engineering — https://arxiv.org/abs/2509.21821 (acessado em 2026-10-23)
2. Citation-Grounded Code Comprehension — https://arxiv.org/html/2512.12117 (acessado em 2026-10-23)
3. Codebase-Memory: Tree-Sitter Knowledge Graphs via MCP — https://arxiv.org/abs/2603.27277 (acessado em 2026-10-23)
4. Leveraging Generative AI for Extracting Business Requirements from Legacy COBOL and PL/I (EPAM) — https://aclanthology.org/2026.acl-industry.4.pdf (acessado em 2026-10-23)
5. MDRE-LLM (SANER 2025) — https://www.computer.org/csdl/proceedings-article/saner/2025/351000a850/26TIo54RfIA (acessado em 2026-10-23)
6. LLM Driven Business Rule Extraction (SANER 2026) — https://www.computer.org/csdl/proceedings-article/saner/2026/858200a888/2hNeOv7HArK (acessado em 2026-10-23)
7. NL Summarization for Multi-Repository Bug Localization — https://arxiv.org/abs/2512.05908 (acessado em 2026-10-23)
8. Hierarchical Repository-Level Code Summarization (TCS) — https://arxiv.org/abs/2501.07857 (acessado em 2026-10-23)
9. Agent4cs — https://arxiv.org/html/2607.01425 (acessado em 2026-10-23)
10. Automating DDD: Prompting Framework — https://arxiv.org/html/2603.26244v1 (acessado em 2026-10-23)
11. Chain-of-Verification (ACL Findings 2024) — https://aclanthology.org/2024.findings-acl.212.pdf (acessado em 2026-10-23)
12. Automated Domain Model Extraction with Heuristics and Open-Source LLMs — https://arxiv.org/pdf/2608.12228v1 (acessado em 2026-10-23)
13. AgentModernize — https://arxiv.org/pdf/2605.17535v1 (acessado em 2026-10-23)
14. AI-Assisted Software Reverse Engineering (IEEE Access 2025) — https://ieeexplore.ieee.org/abstract/document/11098869 (acessado em 2026-10-23)
15. Legacy IT Modernization with AI (MITRE) — https://www.mitre.org/sites/default/files/2025-06/PR-25-0278-5-Legacy-IT-Modernization-with-AI.pdf (acessado em 2026-10-23)
16. COBRAIN (EASE 2025) — https://dl.acm.org/doi/full/10.1145/3756681.3756982 (acessado em 2026-10-23)
17. OMG KDM v1.4 — Knowledge Discovery Metamodel — https://www.omg.org/spec/KDM/1.4/About-KDM (acessado em 2026-10-31)
18. ISO/IEC 19506:2012 — ADM: KDM (confirmada em revisão 2025) — https://www.iso.org/standard/32625.html (acessado em 2026-10-31)
19. OMG SMM v1.2 — Structured Metrics Metamodel — https://www.omg.org/spec/SMM/1.2 (acessado em 2026-10-31)
20. CAST Imaging V3 — documentation e use cases — https://doc.castsoftware.com/imaging/ (acessado em 2026-10-31)
21. Thoughtworks — From black box to blueprint (rapid assessment com CAST) — https://www.thoughtworks.com/insights/blog/legacy-modernization/from-black-box-to-blueprint-how-we-performed-rapid-assessment-of-legacy-system (acessado em 2026-10-31)
22. Martin Fowler — Strangler Fig Application — https://martinfowler.com/bliki/StranglerFigApplication.html (acessado em 2026-10-31)
23. Azure Architecture Center — Strangler Fig pattern — https://learn.microsoft.com/en-us/azure/architecture/patterns/strangler-fig (acessado em 2026-10-31)
24. AWS Prescriptive Guidance — Strangler Fig (decomposing monoliths) — https://docs.aws.amazon.com/prescriptive-guidance/latest/modernization-decomposing-monoliths/strangler-fig.html (acessado em 2026-10-31)
25. Wikipedia — Characterization test (Feathers, Golden Master) — https://en.wikipedia.org/wiki/Characterization_test (acessado em 2026-10-31)
26. ModernizeSpec — Parity Testing — https://modernizespec.dev/techniques/parity-testing/ (acessado em 2026-10-31)
27. SelectWise — Characterisation Tests for Legacy Migration — https://selectwise.io/blog/characterisation-tests-legacy-migration (acessado em 2026-10-31)
28. Richard Seidl — Migration Testing (legado como test oracle) — https://www.richard-seidl.com/en/blog/migration-test/ (acessado em 2026-10-31)
29. Great Migrations — Verifying Functional Equivalence (FEQ/ACT) — https://www.greatmigrations.com/downloads/sections/docs/articles-and-whitepapers/technical-topics/verifying-functional-equivalence-feq.pdf (acessado em 2026-10-31)
30. Google Cloud — Mainframe Assessment Tool: Extract business rules (regras em Gherkin com status) — https://docs.cloud.google.com/mainframe-assessment-tool/docs/business-rules-extraction (acessado em 2026-10-31)
31. Cosentino, Cabot et al. — Extracting Business Rules from COBOL: A Model-Based Tool (BREX, WCRE 2013) — https://inria.hal.science/hal-00869236v1/document (acessado em 2026-10-31)
32. Montora — Business Rule Extraction (draft + dono + confirmação humana) — https://www.montoralabs.com/business-rule-extraction (acessado em 2026-10-31)
33. Fresche X-Analysis — Recovering Business Rules and Data Models — https://fr.freschesolutions.com/wp-content/uploads/archive/white_papers/Recovering_Business_Rules_and_Data_Models.pdf (acessado em 2026-10-31)
34. Access International — ATLAS Toolkit (parity-tester harness open-source) — https://github.com/AccessInter/atlas-toolkit (acessado em 2026-10-31)
35. AWS Migration Blog — Escaping Legacy Database Constraints (business rules em stored procedures) — https://aws.amazon.com/blogs/migration-and-modernization/escaping-legacy-database-constraints-modernize-business-rule-processing-with-aws-cloud-technologies/ (acessado em 2026-11-02)
36. Pineido — Legacy Database Modernization Guide (inventário: SPs, triggers, jobs agendados, config) — https://pineido.com/blog/legacy-database-modernization-guide (acessado em 2026-11-02)
37. Anthony Joanes (Medium) — Modernizing Legacy Stored Procedures (transaction boundaries cross-procedure; cascata de triggers) — https://medium.com/@anthonyjoanes_72638/modernizing-legacy-stored-procedures-a-practical-guide-a1a66ec05eab (acessado em 2026-11-02)
38. Identifying Services from Legacy Batch (ISEC 2012, IITM Madras — slicing de WRITE statements + tag conditionals) — https://www.cse.iitm.ac.in/~krishna/preprints/isec12/isec12.pdf (acessado em 2026-11-02)
39. logic-cov — classificação GUI/LOGIC/MIXED por Target Density (AST + weighting semântico) — https://github.com/Krzysztofci/logic-cov (acessado em 2026-11-02)
40. Playwright — Visual comparisons (toHaveScreenshot/pixelmatch/threshold/consistência de ambiente) — https://playwright.dev/docs/test-snapshots (acessado em 2026-11-02)
41. Playwright — Aria snapshots (toMatchAriaSnapshot; árvore de acessibilidade em YAML) — https://playwright.dev/docs/aria-snapshots (acessado em 2026-11-02)
42. loop-monitor ADR 0002 — UI migration visual regression (capture-once, viewport fixo, fixtures determinísticas, mask de regiões dinâmicas, threshold ≤0.5%) — https://github.com/svv2014/loop-monitor/blob/main/docs/adr/0002-visual-regression.md (acessado em 2026-11-02)
43. Replay — The Logic Drift Trap (paridade visual-only perde comportamento; transições de estado e event handlers) — https://www.replay.build/blog/the-logic-drift-trap-why-traditional-qa-misses-40-of-visual-regression-testing-gaps (acessado em 2026-11-02)
44. real-a11y — Accessibility snapshots vs visual regression (metades complementares: aparência × semântica) — https://github.com/real-a11y/real-a11y-dev/blob/main/website/guide/accessibility-snapshots-comparisons.md (acessado em 2026-11-02)
45. orchestkit — ARIA Snapshot Diffing (diff semântico estrutural com score % de nós alterados) — https://github.com/yonatangross/orchestkit/blob/main/plugins/ork/skills/expect/references/aria-diffing.md (acessado em 2026-11-02)
46. BrowserStack Percy — fluxo de aprovação humana para mudanças visuais (review em vez de fail automático) — https://www.browserstack.com/docs/percy/references/playwright-tohavescreenshot (acessado em 2026-11-02)
