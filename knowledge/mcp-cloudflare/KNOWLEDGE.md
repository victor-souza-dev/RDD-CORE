---
dominio: mcp-cloudflare
versao: 1.0.0
data_pesquisa: 2026-10-25
proxima_revisao: 2027-04-25
escopo: servidor MCP oficial da Cloudflare no OpenCode (remote HTTP + OAuth) — API completa (~2.500 endpoints) via Code Mode de 4 ferramentas, instalação V2, templates de escopo OAuth e armadilhas
fontes:
  - titulo: "Cloudflare — cloudflare/mcp (README oficial do repositório)"
    url: https://github.com/cloudflare/mcp
    acessado_em: 2026-10-25
  - titulo: "Cloudflare — cloudflare/mcp _autodocs (api-reference/tools-codemode, api-reference/auth-scopes, index)"
    url: https://github.com/cloudflare/mcp/tree/main/_autodocs
    acessado_em: 2026-10-25
  - titulo: "OpenCode V2 Docs — MCP Servers (OAuth remoto, /mcps — mecanismo idêntico validado no setup do MCP Hostinger)"
    url: https://opencode.ai/v2/docs/mcp-servers
    acessado_em: 2026-10-24
---

# mcp-cloudflare — Servidor MCP oficial da Cloudflare no OpenCode

Base de conhecimento canônica do domínio. Fonte de critérios para a skill
`rdd-mcp-cloudflare-setup`. Nuances da organização NÃO vão aqui (ficam no
pack ativo, `packs/<pack>/accumulation/knowledge/`).

## 1. Visão geral

MCP **oficial** da Cloudflare (repo `cloudflare/mcp`): expõe a **API
completa da Cloudflare — 2.500+ endpoints** (zones, DNS records,
**tunnels**, Workers, R2, KV, firewall, etc.) com custo de tokens reduzido
por **Code Mode** (~1k tokens de tool-surface vs ~244k no modo de tools
individuais).

Nuance de nomenclatura: **`cloudflared` (o daemon de tunnel) não tem MCP
próprio** — gestão de tunnels, rotas e DNS entra pela API Cloudflare
exposta neste server. É o que `rdd-vps-setup`/`rdd-vps-troubleshoot`
consomem para tunnel/DNS.

**Postura adotada no RDD: servidor REMOTE com OAuth** (não API token
Bearer): zero segredo gerenciado pelo usuário — tokens ficam fora da
config, com refresh automático.

## 2. Servidor remoto (padrão)

| Aspecto | Valor |
|---------|-------|
| URL | `https://mcp.cloudflare.com/mcp` |
| Transporte | Streamable HTTP (remote) |
| Auth | OAuth no browser (tela de consent da Cloudflare) — tokens fora da config |
| Escopo padrão no OpenCode | Global (`~/.config/opencode`) — convenção das skills irmãs de MCP setup |
| Config resultante (V2) | `mcp.servers.cloudflare` no opencode.jsonc |

### 2.1 Instalação via CLI (preserva config existente)

```
opencode mcp add cloudflare --global --url https://mcp.cloudflare.com/mcp
```

- URL SEM query string → Code Mode ativo (padrão). **Nunca usar
  `?codemode=false` por padrão** — registra ~1 tool por endpoint (~2.500
  tools, ~244k tokens). Reservado para clientes que já fazem code mode
  próprio.
- Formato V2 (`mcp.servers.cloudflare`) coexiste com entradas legadas V1
  flat (`mcp.<nome>`) no mesmo arquivo — checar duplicidade.
- Idempotência: `opencode mcp list` antes; pós-add o estado esperado é
  `pending` (needs authentication).
- Reinício do OpenCode após add/auth — config não é hot-reloaded.

### 2.2 Autenticação OAuth

1. `opencode mcp list` pós-add mostra `pending` — estado ESPERADO, não é
   erro.
2. Sign-in pelo TUI: `/mcps` → `cloudflare` → autorizar no browser.
3. **NUNCA rodar `opencode mcp auth cloudflare` via shell tool** — o link
   de autorização pode ficar oculto em output de background process.
   Sempre `/mcps` interativo.
4. Refazer login/conta: `opencode mcp logout cloudflare` + novo sign-in.

## 3. Interface Code Mode — 4 ferramentas

| Tool | Papel |
|------|-------|
| `search` | Agente escreve JavaScript para consultar `spec.paths` do OpenAPI pré-resolvido ($refs inlined) — worker isolado, SEM acesso à rede |
| `execute` | Agente escreve JavaScript chamando `cloudflare.request()` nos endpoints descobertos — outbound restrito às URLs da API Cloudflare |
| `docs` | Busca na documentação de desenvolvedor da Cloudflare (parâmetro `query`) |
| `whoami` | Identidade da credencial — retorna `user:<id>` ou `account:<id>` (formato é contrato permanente do server) |

Padrão de uso: `whoami` (sanidade) → `search` (achar endpoint) →
`execute` (chamar via `cloudflare.request()`). O schema retornado pelo
server é autoritativo — nunca operar de memória.

## 4. Scopes e permissões (OAuth)

- `REQUIRED_SCOPES`: `user:read`, `offline_access`, `account:read` —
  identidade, descoberta de conta e refresh tokens; sempre restaurados no
  consent.
- Página de consent oferece **templates** (não há per-scope picker):
  minimal (default = required scopes), read-only e full-access (catálogo
  de produção exposto em `GET /oauth/scopes`).
- **Step-up**: chamada recusada por `insufficient_scope` → refazer o
  consent pedindo o escopo adicional necessário.
- Seção "Advanced" do consent permite editar a lista de escopos (útil
  quando proxy corporativo rejeita a URL de autorização longa do
  full-access). Escopos fora do catálogo bloqueiam o Continue.
- Alternativa Bearer/API token existe no protocolo — **não é o padrão
  RDD** (segredo em disco/chat; viola a postura OAuth das skills irmãs).

## 5. Armadilhas

- `?codemode=false` por engano → explosão de tool-surface (~244k tokens).
- Server duplicado/ambíguo → `mcp.servers.cloudflare` (V2) E
  `mcp.cloudflare` (V1 flat) no mesmo arquivo — manter UMA só (preferir a
  V2).
- `pending`/needs authentication persistente → refazer `/mcps`; se
  falhar, `opencode mcp logout cloudflare` e logar de novo.
- Timeout no add → checar conectividade com `https://mcp.cloudflare.com`
  (proxy corporativo → `HTTPS_PROXY`).
- Tools do server não aparecem na sessão → faltou reiniciar o OpenCode.
- Credenciais/refresh tokens ficam com o OpenCode (fora da config) —
  nunca imprimir, logar ou comitar; nunca pedir token no chat.

## 6. Estado de validação

- 2026-10-25: server adicionado via CLI — `mcp.servers.cloudflare` (V2,
  global), estado `pending` no momento da fundação (OAuth pendente).
- Smoke test canônico (após OAuth + reinício): `whoami` (read-only,
  existe em ambos os modos) → esperado `user:<id>` ou `account:<id>`.

## 7. Consumers canônicos

- `rdd-mcp-cloudflare-setup` — wizard de configuração (skill)
- `rdd-devops` — consumidor natural (tunnels, DNS, zones da org)

## Referências

1. cloudflare/mcp — README — https://github.com/cloudflare/mcp (acessado em 2026-10-25)
2. cloudflare/mcp — _autodocs (tools-codemode, auth-scopes, index) — https://github.com/cloudflare/mcp/tree/main/_autodocs (acessado em 2026-10-25)
3. OpenCode V2 Docs — MCP Servers — https://opencode.ai/v2/docs/mcp-servers (acessado em 2026-10-24)
