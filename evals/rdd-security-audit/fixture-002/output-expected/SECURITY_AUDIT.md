# SECURITY AUDIT — Inventory-API (fixture eval)

- data: 2026-11-02-0000 · modo: baseline
- base: knowledge/security-review/KNOWLEDGE.md v1.0.0 (proxima_revisao 2027-05-01)
- escopo: repo inteiro (exclusões: bin/, obj/)
- resumo: 4 findings — Crítico: 3 · Alto: 1 · Médio: 0 · Baixo: 0

## Findings

appsettings.json:3 — P-05 / AP-03 — Crítico — connection string com senha literal no repositório — mover para gestão de segredos (env/vault com rotação) e ROTAR a credencial exposta (vazamento permanece no histórico do git)
Services/AuthService.cs:3 — P-07 / AP-04 — Crítico — hash de senha com MD5 — trocar por algoritmo dedicado (argon2/bcrypt/PBKDF2) + salt por usuário
Services/AuthService.cs:10 — P-07 / AP-04 — Crítico — token de reset gerado com Random() e sufixo previsível — gerar com CSPRNG (RandomNumberGenerator) e entropia adequada
Services/AuditLogger.cs:3 — P-08 / AP-07 — Alto — senha do usuário logada em evento de login — remover credencial do log, manter log de auditoria sem PII e parear com alerta acionável

## Não verificado

Controllers além dos listados no input; dependências/lockfile (ausente no input da fixture).

## Observações

- Controllers/HealthController.cs: endpoint /health sem dado sensível — sem finding (controle limpo).
- Correção dos Críticos/Alto é pré-requisito de aprovação pelo consumidor do fluxo (rdd-dev-reviewer no eixo 3; rdd-doc no reverse) — esta skill classifica, não emite veredito.