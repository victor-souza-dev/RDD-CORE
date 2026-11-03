---
dominio: mcp-hostinger
versao: 1.0.0
data_pesquisa: 2026-10-24
proxima_revisao: 2027-04-24
escopo: servidor MCP oficial da Hostinger no OpenCode (remote Streamable HTTP + OAuth), interface de 3 ferramentas, instalação V2 (mcp.servers), alternativa stdio local e armadilhas validadas em produção
fontes:
  - titulo: "Hostinger — @hostinger/mcp (README oficial do pacote npm)"
    url: https://www.npmjs.com/package/@hostinger/mcp
    acessado_em: 2026-10-24
    versao: pacote oficial @hostinger/mcp
  - titulo: "Hostinger Support — Hostinger API MCP Server (11079316)"
    url: https://www.hostinger.com/support/11079316-hostinger-api-mcp-server/
    acessado_em: 2026-10-24
  - titulo: "OpenCode V2 Docs — MCP Servers (shapes mcp.servers, OAuth PKCE/CIMD/DCR, timeouts, /mcps)"
    url: https://opencode.ai/v2/docs/mcp-servers
    acessado_em: 2026-10-24
  - titulo: "Setup validado em produção na máquina do operador (TM.RDD — 2026-10-24)"
    url: "(sessão de setup — remote OAuth global, smoke test billing OK)"
    acessado_em: 2026-10-24
---

# mcp-hostinger — Servidor MCP oficial da Hostinger no OpenCode

Base de conhecimento canônica do domínio. Fonte de critérios para a skill
`rdd-mcp-hostinger-setup` — nuances da organização NÃO vão aqui (ficam no
pack ativo, `packs/<pack>/accumulation/knowledge/`).

## 1. Visão geral

MCP **oficial** da Hostinger: expõe a **API completa da Hostinger via 3
ferramentas** — ~410 operações em 13 grupos: `vps`, `hosting`, `domains`,
`dns`, `billing`, `mail`, `wordpress`, `agency-hosting`, `ecommerce`,
`horizons`, `reach`, `agent-readiness`, `oss`.

**Postura adotada no RDD: servidor REMOTE com OAuth** (não stdio local).
Zero segredo gerenciado pelo usuário — tokens ficam fora da config, com
refresh automático via PKCE.

## 2. Servidor remoto (padrão)

| Aspecto | Valor |
|---------|-------|
| URL | `https://mcp.hostinger.com` |
| Transporte | Streamable HTTP (remote) |
| Auth | OAuth no browser (login Hostinger) — PKCE, tokens fora da config |
| Escopo padrão no OpenCode | Global (`~/.config/opencode`) — convenção das skills irmãs de MCP setup |
| Config resultante (V2) | `mcp.servers.hostinger` no opencode.jsonc |

### 2.1 Instalação via CLI (preserva config existente)

```
opencode mcp add hostinger --global --url https://mcp.hostinger.com
```

- Formato V2 (`mcp.servers.hostinger`) coexiste com entradas legadas V1
  flat (`mcp.<nome>`) no mesmo arquivo — sem conflito.
- Idempotência: verificar antes com `opencode mcp list`.
- Escopo project-local (sem `--global`) só sob pedido explícito.

### 2.2 Autenticação OAuth

1. `opencode mcp list` pós-add mostra `⚠ hostinger  needs authentication`
   — estado ESPERADO, não é erro.
2. Sign-in pelo TUI: `/mcps` → `hostinger` → autorizar no browser.
3. Estado final: `✓ hostinger  connected`.
4. **NUNCA rodar `opencode mcp auth hostinger` via shell tool** — o link de
   autorização pode ficar oculto em output de background process. Sempre
   `/mcps` interativo.
5. Refazer login/conta: `opencode mcp logout hostinger` + sign-in novamente.

## 3. Interface de 3 ferramentas

| Tool | Papel |
|------|-------|
| `search` | Encontra operação por keyword; retorna o `inputSchema` AUTORITATIVO (as shapes vêm daqui, nunca de memória) |
| `execute` | Roda 1 operação (params flat: path, query, body) |
| `multi-execute` | Até 20 operações em cadeia, parando na 1ª falha; referências `$steps.<i>.<path>` encadeiam saída → entrada |

Padrão de uso: `search` → ler `inputSchema` → `execute` (ou `multi-execute`
para cadeias). Operações assíncronas (ex.: criação de VPS) retornam "queued"
— pollar a operação de leitura correspondente com backoff; nunca reenviar a
escrita.

## 4. Validação em produção (2026-10-24)

Setup completo executado e validado na máquina do operador:

- `opencode mcp add hostinger --global --url https://mcp.hostinger.com` →
  gravou `mcp.servers.hostinger` (V2) sem tocar nas entradas legadas V1.
- OAuth via `/mcps` → `✓ hostinger  connected`.
- Smoke test: `search("list subscriptions billing")` →
  `billing_subscriptions_list` (`readOnly: true`) → `execute` → JSON com as
  assinaturas da conta.

## 5. Alternativa stdio local (caso de borda — NÃO é o padrão)

Pacote npm oficial `@hostinger/mcp`:

- Binários por categoria (`hostinger-vps-mcp`, `hostinger-dns-mcp`,
  `hostinger-domains-mcp`, ...) ou unificado (`hostinger-api-mcp`).
- Exige **Node.js ≥ 24**.
- Auth: OAuth PKCE do próprio pacote no 1º tool call (credenciais em
  `%APPDATA%\\hostinger-mcp\\credentials.json` no Windows) **ou** env var
  `HOSTINGER_API_TOKEN` (bypassa OAuth).
- Só recomendar se o operador precisar de ferramentas por categoria isoladas
  ou ambiente sem OAuth no browser.

## 6. Armadilhas validadas

- `needs authentication` persistente → refazer `/mcps`; se falhar,
  `opencode mcp logout hostinger` e logar de novo.
- Server duplicado/ambíguo → entrada em `mcp.servers.hostinger` (V2) E
  `mcp.hostinger` (V1 flat) no mesmo arquivo — manter UMA só.
- Timeout no add → checar conectividade com `https://mcp.hostinger.com`.
- Credenciais OAuth do modo stdio (`credentials.json`) são segredo — nunca
  imprimir, logar ou comitar.

## 7. Consumers canônicos

- `rdd-mcp-hostinger-setup` — wizard de configuração (skill)
- `rdd-devops` — consumidor natural (VPS/infra da org hospedada na Hostinger)
