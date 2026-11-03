---
dominio: security-review
versao: 1.0.0
data_pesquisa: 2026-11-01
proxima_revisao: 2027-05-01
escopo: security review de código/solução — triagem de findings de segurança em reviews de diff, quality gates e auditorias (baseline e dif)
fontes:
  - titulo: OWASP Application Security Verification Standard (ASVS) v5.0.0
    url: https://asvs.owasp.org/
    acessado_em: 2026-11-01
    versao: 5.0.0 (stable, 30/05/2025)
  - titulo: OWASP Top 10:2025
    url: https://owasp.org/Top10/2025/
    acessado_em: 2026-11-01
    versao: 2025 (release corrente)
  - titulo: OWASP Cheat Sheet Series — Secure Code Review
    url: https://cheatsheetseries.owasp.org/cheatsheets/Secure_Code_Review_Cheat_Sheet.html
    acessado_em: 2026-11-01
    versao: corrente (guião mantido do Code Review Guide)
  - titulo: OWASP Code Review Guide v2.0
    url: https://owasp.org/www-project-code-review-guide/
    acessado_em: 2026-11-01
    versao: 2.0 (2017 — repo arquivado em abr/2025; método ainda válido)
  - titulo: NIST SP 800-218 — Secure Software Development Framework (SSDF) v1.1
    url: https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-218.pdf
    acessado_em: 2026-11-01
    versao: 1.1 (referência secundária citada pelo Secure Code Review Cheat Sheet)
---
# KNOWLEDGE — Security Review (security review de código/solução)

Base canônica do domínio para consumo por camadas/componentes RDD.
Fonte canônica de critérios — componentes que consomem este domínio listam
este arquivo no "Lê (upstream)" deles. Atualizar via rdd-domain-research
quando `proxima_revisao` vencer.

## Notas de versão das fontes (importante)

- **ASVS 5.0.0** é o padrão de verificação estável atual (30/05/2025). A estrutura
  de seções mudou em relação à v4.0.3 — v5 tem V1–V17 (ex.: V1 Encoding and
  Sanitization, V2 Validation and Business Logic, V8 Authorization, V11
  Cryptography, V13 Configuration, V14 Data Protection, V16 Security Logging and
  Error Handling). Mapeamentos oficiais v4.0.3↔v5.0.0 disponíveis em
  https://asvs.dev/v5.0.0/Mappings/.
- **OWASP Top 10:2025** substitui a lista 2021. Mudanças críticas vs 2021:
  **A03 Software Supply Chain Failures é NOVA** (expansão do A06:2021 Vulnerable
  and Outdated Components — maior exploit/impact médio de CVEs); **A10 Mishandling
  of Exceptional Conditions é NOVA**; Security Misconfiguration subiu #5→#2;
  Injection caiu #3→#5; SSRF foi absorvido em Broken Access Control (A01).
  Qualquer checklist que referencie a ordem/nomeação 2021 está desatualizado.
- **Code Review Guide v2 (2017)**: repositório arquivado (abr/2025). O método de
  review (baseline vs diff-based, data flow, threat-based) permanece válido; a
  guião MANTIDA é o **Secure Code Review Cheat Sheet**. Citar a Cheat Sheet como
  fonte primária de processo e a CRG v2 apenas para profundidade do método.

## Princípios

### P-01 — Review dif-based é o fluxo padrão; baseline é evento
Review de segurança dif-based (só o que mudou) integra o fluxo de PR/commit;
baseline (codebase inteira) é para onboarding de legado, releases maiores,
mudanças de arquitetura, pós-incidente e ciclos de compliance.
- **Heurística de violação**: revisar segurança só em auditorias anuais; PRs
  grandes sem passo de análise de impacto sobre controles existentes.
- Fonte: (OWASP Secure Code Review Cheat Sheet, Introduction/Review Types e
  Integration with SDLC)

### P-02 — Todo input é validado no servidor; allowlist; encode na saída
Validação client-side é UX, não segurança. Validar no servidor com allowlist
(nunca blocklist), limites de tamanho e encoding contextual na saída
(HTML/JS/CSS/URL). Queries sempre parametrizadas — nunca concatenadas.
- **Heurística de violação**: confiança em validação de formulário do front;
  sanitização por blocklist de caracteres; SQL construído por concatenação de
  string com input do usuário.
- Fonte: (Top 10:2025, A05 Injection; ASVS 5.0 V1/V2; Cheat Sheet, Review
  Checklists — Input Validation)

### P-03 — Controle de acesso server-side, default deny, por objeto
Autorização enforcement no servidor em TODA requisição, política default deny,
checagem por objeto/recurso (anti-IDOR) além do papel, negação de escalação
horizontal e vertical, lógica de acesso centralizada.
- **Heurística de violação**: endpoint novo sem checagem de permissão; controle
  só no menu/rota do front; ID acessível por sequência sem checagem de dono
  (IDOR); admin verificado apenas client-side.
- Fonte: (Top 10:2025, A01 Broken Access Control — risco #1, inclui SSRF e CSRF;
  ASVS 5.0 V8; Cheat Sheet, Review Checklists — Authorization)

### P-04 — Falhe fechado; erros sem disclosure
Em condição excepcional, o sistema nega acesso em vez de conceder (fail closed).
Mensagens de erro nunca revelam stack trace, versão, connection string ou dado
sensível; tratamento de erro é explícito em caminhos críticos.
- **Heurística de violação**: `catch` genérico que segue o fluxo de sucesso;
  página de erro com stack trace; lógica "se der erro, permite".
- Fonte: (Top 10:2025, A10 Mishandling of Exceptional Conditions — NOVO em 2025;
  ASVS 5.0 V16; Cheat Sheet, Error Handling Cheat Sheet)

### P-05 — Config segura por padrão; segredos fora do código
Defaults seguros validados por ambiente, separação de ambientes, headers HTTP de
segurança e TLS configurados; segredos em gestão própria (vault/env com rotação),
nunca hardcoded nem em repositório.
- **Heurística de violação**: `password=`/`api_key=` literal no código; debug
  habilitado em produção; mesma config de CORS/cookie em dev e prod.
- Fonte: (Top 10:2025, A02 Security Misconfiguration — subiu #5→#2; ASVS 5.0 V13;
  Cheat Sheet, Secrets Management e Configuration & Deployment)

### P-06 — Supply chain é superfície de ataque de primeira classe
Dependências, build e distribuição fazem parte do modelo de ameaças: triagem de
CVEs, pinning de versões, verificação de integridade (hash/checksum/attestation),
SBOM quando aplicável. Categoria de maior exploit/impact médio no Top 10:2025.
- **Heurística de violação**: dependência sem triagem de vulnerabilidade
  conhecida; download de binário sem conferência de hash; `latest`/range aberto
  em CI.
- Fonte: (Top 10:2025, A03 Software Supply Chain Failures — NOVA em 2025;
  Cheat Sheet, Vulnerable Dependency Management e Software Supply Chain Security)

### P-07 — Criptografia moderna, chaves gerenciadas, aleatoriedade CSPRNG
Algoritmos modernos (AES-256, RSA-2048+, ECDSA P-256+), hash de senha com
algoritmo dedicado (argon2/bcrypt/scrypt/PBKDF2) + salt, IV/nonce conforme o
modo (CBC exige IV imprevisível; GCM exige IV único por chave), geração de
aleatórios criptograficamente segura, validação de certificado com hostname.
- **Heurística de violação**: MD5/SHA-1 para senha; `Math.random()`/rand simples
  para token; ECB; chave no código; TLS sem verificação de hostname.
- Fonte: (Top 10:2025, A04 Cryptographic Failures; ASVS 5.0 V11 e Appendix C;
  Cheat Sheet, Review Checklists — Cryptography)

### P-08 — Eventos de segurança são logados E alertados
Autenticação falha, violação de autorização e operações sensíveis geram log de
auditoria protegido contra tampering — e alerta acionável. Log bom sem alerta tem
valor mínimo para detecção de incidente. Nunca logar PII, senha ou token.
- **Heurística de violação**: endpoint de login sem log de falha; PII/senha em
  log; log sem alerta nem retenção; auditoria inconsistente entre operações
  sensíveis.
- Fonte: (Top 10:2025, A09 Security Logging & Alerting Failures; ASVS 5.0 V16;
  Cheat Sheet, Review Checklists — Security Monitoring e Logging Cheat Sheet)

### P-09 — Analise fluxo de dados: fontes → processamento → sinks
Toda revisão rastreia dados: identificar fontes (input, upload, API, env),
seguir o processamento (validação/transformação), verificar sinks (query, arquivo,
render, log, API externa) e validar controles em cada fronteira de confiança.
Dado sensível recebe proteção proporcional à classificação.
- **Heurística de violação**: revisar função por função sem rastrear de onde vem
  o input; validação existente só na primeira fronteira (não nos sinks).
- Fonte: (Cheat Sheet, Review Techniques — Data Flow Analysis; ASVS 5.0 V14)

### P-10 — Lógica de negócio é revisada contra abuso, não só contra erro
Workflows multi-etapa: validar estado/transição, atomicidade de transação,
limites de taxa e quota, autorização em CADA passo, e cenários de abuso (abuse
cases) — regra de negócio não pode ser burlada por acesso direto à API. Atenção
a race conditions (TOCTOU) em operações concorrentes.
- **Heurística de violação**: regra validada só na UI; etapa 3 do fluxo aceita
  chamada direta sem passar por 1-2; operação de saldo/crédito sem lock/transação;
  sem rate limit em endpoint sensível.
- Fonte: (Top 10:2025, A06 Insecure Design; Cheat Sheet, Business Logic Review e
  Advanced Techniques — Race Condition Analysis)

## Checklist aplicável

Aplicável a review de dif (PR/task) e auditável em baseline. Referência cruzada
com princípios:

- [ ] Inputs novos validados no servidor (allowlist, length, Unicode) (P-02)
- [ ] Queries parametrizadas; sem concatenação de SQL/comando/Path (P-02)
- [ ] Output encoding contextual em renderização de dado do usuário (P-02)
- [ ] Todo endpoint novo tem auth + authZ server-side, com checagem por objeto (P-03)
- [ ] Default deny: permissão verificada no caminho do servidor, não só no menu (P-03)
- [ ] Falhas fecham acesso (fail closed); sem fluxo de sucesso em exceção (P-04)
- [ ] Mensagens de erro sem stack trace/versão/dado sensível (P-04)
- [ ] Zero segredo hardcoded; config sensível via gestão de segredos com rotação (P-05)
- [ ] Headers de segurança (CSP, HSTS, X-Frame-Options, cookie flags) coerentes (P-05)
- [ ] Dependências novas/alteradas com triagem de CVE e versão pinada (P-06)
- [ ] Download de artefato/binário com verificação de integridade (hash/attestation) (P-06)
- [ ] Crypto: algoritmos modernos, hash de senha dedicado + salt, CSPRNG, IV/nonce correto (P-07)
- [ ] TLS com validação de certificado e hostname; sem fallback inseguro (P-07)
- [ ] Eventos de segurança (login falho, acesso negado, op. sensível) logados sem PII e com alerta (P-08)
- [ ] Fluxo de dados do dif mapeado: fonte → processamento → sink, com validação em cada fronteira (P-09)
- [ ] Regras de negócio enforcement server-side; sem bypass por acesso direto à API (P-10)
- [ ] Operações concorrentes sensíveis protegidas de race condition/TOCTOU (P-10)
- [ ] Rate limit/quota em endpoints custosos ou sensíveis (P-10)

## Anti-patterns

### AP-01 — Query por concatenação
`"SELECT * FROM users WHERE id = " + req.params.id` (ou equivalente em ORM via
raw query concatenada). Input do usuário vira código SQL.
- Viola: P-02 · Severidade: Crítico

### AP-02 — Endpoint novo sem authZ server-side
Controller/service público exposto sem checagem de permissão (ou checada apenas
na navegação do front). Qualquer usuário autenticado (ou anônimo) acessa dado de
outros — inclui IDOR por ID sequencial sem checagem de dono.
- Viola: P-03 · Severidade: Crítico

### AP-03 — Segredo no repositório
Connection string, API key ou JWT secret literal no appsettings/config do código.
Vazamento permanente (histórico do git) mesmo após remoção.
- Viola: P-05 · Severidade: Crítico

### AP-04 — Crypto caseira ou fraca
MD5/SHA-1 para senha, `Math.random()` para token de sessão/reset, AES-ECB, chave
de criptografia hardcoded. Parece "funcionar" até o primeiro incidente.
- Viola: P-07 · Severidade: Crítico

### AP-05 — Fail open no handler de exceção
`catch { return true; }` / catch genérico que deixa passar a operação, ou página
de erro com stack trace em produção. Condição excepcional vira porta aberta.
- Viola: P-04 · Severidade: Alto

### AP-06 — Dependência vulnerável sem triagem
Biblioteca com CVE conhecida exploração remota mantida no lockfile; artefato
baixado em CI sem conferência de checksum; range aberto (`^latest`) no pipeline.
- Viola: P-06 · Severidade: Alto

### AP-07 — Dado sensível em log
Senha, token, PII ou cartão em log de aplicação; log de auditoria ausente nas
operações sensíveis; log sem alerta correlato.
- Viola: P-08 · Severidade: Alto

### AP-08 — Regra de negócio só na superfície
Regra validada apenas na UI/client; API aceita estados fora de ordem; operação
financeira/inventário sem transação ou lock (race condition).
- Viola: P-10 · Severidade: Alto

## Classificação/Severidade

| Nível | Critério | Ação na triagem |
|-------|----------|-----------------|
| Crítico | Explorável remotamente sem credencial: injection, authZ ausente, segredo exposto, crypto quebrada | bloqueia aprovação |
| Alto | Explorável com conta de baixo privilégio, condição excepcional ou esforço moderado: fail open, dependência com CVE explorável, dado sensível em log, bypass de regra de negócio | corrige antes de aprovar |
| Médio | Ausência de defense-in-depth sem exploração direta: header de segurança faltante, rate limit ausente, log sem alerta | backlog priorizado |
| Baixo | Higiene e best practice: naming, doc de config, refinamento de mensagem de erro | backlog comum |

## Referências

1. OWASP ASVS v5.0.0 — https://asvs.owasp.org/ (acessado em 2026-11-01)
2. OWASP Top 10:2025 — https://owasp.org/Top10/2025/ (acessado em 2026-11-01)
3. OWASP Secure Code Review Cheat Sheet — https://cheatsheetseries.owasp.org/cheatsheets/Secure_Code_Review_Cheat_Sheet.html (acessado em 2026-11-01)
4. OWASP Code Review Guide v2 — https://owasp.org/www-project-code-review-guide/ (2017; acessado em 2026-11-01)
5. NIST SP 800-218 SSDF v1.1 — https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-218.pdf (acessado em 2026-11-01)
6. Mapeamento ASVS v4.0.3→v5.0.0 — https://asvs.dev/v5.0.0/Mappings/ (acessado em 2026-11-01)
