# Índice de Bases de Conhecimento — `knowledge/`

> Bases canônicas de domínio fundadas via `rdd-domain-research`.
> Merge incremental — nunca remover entradas existentes.
> Domínio válido até `proxima_revisao`; vencida, re-pesquisar antes de reuso.

### reverse-engineering
- **Escopo**: engenharia reversa de sistemas existentes com IA (LLM-assisted RE) para documentação — extração de modelo de dados, contratos, regras de negócio e bounded context de código multi-repo com ancoragem em evidência e verificação anti-alucinação; e estrutura de artefatos de RE orientada a migração total de sistema (camada reverse/ de produto: reports append-only + fila de candidatas com dono + cobertura comparável por rodada; migration/ opcional com plano por fatias, paridade e mapa de dados)
- **Base**: knowledge/reverse-engineering/KNOWLEDGE.md (v1.4.0)
- **data_pesquisa**: 2026-11-02 · **proxima_revisao**: 2027-05-02
- **Fontes principais**: survey LLM-assisted RE (arXiv:2509.21821), Citation-Grounded Code Comprehension (arXiv:2512.12117), EPAM COBOL/PL-I pipeline (ACL 2026), MDRE-LLM (SANER 2025), Chain-of-Verification (ACL 2024), Automating DDD prompting (arXiv:2603.26244), codebase-memory-mcp v0.12.1 (piloto validado local — projeto .NET Clean Architecture); v1.2.0: OMG KDM/ISO 19506 + OMG SMM v1.2, CAST Imaging, Strangler Fig (Fowler/Azure/AWS), characterization/parity testing (Feathers, ModernizeSpec, Seidl, FEQ/ACT, ATLAS), Google Mainframe Assessment (regras Gherkin com status), Montora, BREX (WCRE 2013), X-Analysis; v1.3.0: P-15 sharding por BC (KDM segments + IMP-143 — gatilho de gigantismo e reverse-index); v1.4.0: P-16 regras em DB/jobs/config (AWS, Pineido, Joanes, ISEC'12 slicing) · P-17 paridade de UI dual pixel+ária e Logic Drift (Replay, real-a11y, Playwright aria) · P-18 captura determinística com mask/threshold/aprovação (Playwright visual, ADR loop-monitor, Percy)

### knowledge-management
- **Escopo**: arquitetura de armazenamento de conhecimento do RDD (bases de domínio, acúmulo da org, rules lazy, artefatos de módulo, self-knowledge) + padrões de memória de agentes IA
- **Base**: knowledge/knowledge-management/KNOWLEDGE.md (v1.5.0)
- **data_pesquisa**: 2026-10-21 · **proxima_revisao**: 2027-04-21
- **Fontes principais**: Anthropic (context engineering / memory tool / Agent Skills / Claude Code memory), MemGPT (arXiv:2310.08560), Generative Agents (arXiv:2304.03442), Zep/Graphiti (arXiv:2501.13956), A-MEM (arXiv:2502.12101), LangMem, Mem0/Letta/Zep, Diátaxis, PARA
- **Nuance da org**: no acúmulo privado do pack (não publicado)

### mcp-hostinger
- **Escopo**: servidor MCP oficial da Hostinger no OpenCode (remote Streamable HTTP + OAuth) — instalação V2 (`mcp.servers`), interface de 3 ferramentas (search/execute/multi-execute, ~410 operações em 13 grupos), alternativa stdio local (@hostinger/mcp) e armadilhas validadas em produção
- **Base**: knowledge/mcp-hostinger/KNOWLEDGE.md (v1.0.0)
- **data_pesquisa**: 2026-10-24 · **proxima_revisao**: 2027-04-24
- **Fontes principais**: npm @hostinger/mcp (README oficial), Hostinger Support 11079316, OpenCode V2 docs (mcp-servers — OAuth PKCE/CIMD/DCR, /mcps), setup validado em produção 2026-10-24

### mcp-cloudflare
- **Escopo**: servidor MCP oficial da Cloudflare no OpenCode (remote HTTP + OAuth em `https://mcp.cloudflare.com/mcp`) — API completa (~2.500 endpoints) via Code Mode de 4 ferramentas (search/execute/docs/whoami), templates de escopo OAuth e armadilhas
- **Base**: knowledge/mcp-cloudflare/KNOWLEDGE.md (v1.0.0)
- **data_pesquisa**: 2026-10-25 · **proxima_revisao**: 2027-04-25
- **Fontes principais**: cloudflare/mcp README (github.com/cloudflare/mcp), _autodocs (tools-codemode/auth-scopes), OpenCode V2 docs (mcp-servers)

### linkedin-perfil-profissional
- **Escopo**: auditoria, redação e otimização de perfil pessoal LinkedIn (headline, About, experiência, skills) para visibilidade em buscas de recrutadores — base de critérios para drafting assistido por IA (consumo via MCP linkedin-profile-manager-mcp)
- **Base**: knowledge/linkedin-perfil-profissional/KNOWLEDGE.md (v1.0.0)
- **data_pesquisa**: 2026-10-26 · **proxima_revisao**: 2027-04-26
- **Fontes principais**: LinkedIn Help (skills a549047 — limite oficial 100), AuthoredUp (limites/visibilidade real, análise 372k posts), CareerBldr (fatores de ranking do algoritmo), Jobscan/Growleads (fórmulas de headline)

### security-review
- **Escopo**: security review de código/solução — triagem de findings de segurança em reviews de diff, quality gates e auditorias (baseline e dif), fundado em OWASP ASVS 5.0.0, Top 10:2025 e Secure Code Review Cheat Sheet
- **Base**: knowledge/security-review/KNOWLEDGE.md (v1.0.0)
- **data_pesquisa**: 2026-11-01 · **proxima_revisao**: 2027-05-01
- **Fontes principais**: OWASP ASVS 5.0.0 (stable 30/05/2025), OWASP Top 10:2025 (A03 Supply Chain e A10 Exceptional Conditions novas), OWASP Secure Code Review Cheat Sheet (guião mantida; CRG v2/2017 arquivado)
