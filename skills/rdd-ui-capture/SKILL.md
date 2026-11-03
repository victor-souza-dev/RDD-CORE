---
name: rdd-ui-capture
description: >-
  Captura evidência visual em runtime do sistema legado para migração (golden
  master de UI) via MCP Playwright — screenshots por rota/estado, requisições
  de rede observadas e erros de console, gravados em reverse/ui/ com manifesto
  reverse/UI_CAPTURE.md e candidatas visuais na fila reverse/CANDIDATES.md.
  Complemento runtime da engenharia reversa estática (IMP-144). Use quando o
  usuário pedir "captura visual", "golden master de UI", "screenshots do
  legado", "captura de UI" ou "ui capture".
---
# rdd-ui-capture — Captura Visual Runtime do Legado (Golden Master de UI)

Captura o "antes" do sistema legado em runtime — estados de tela (visual E
semântico), transições de comportamento, validações disparadas e requisições
reais — que o código estático não revela. Alimenta as DUAS metades do harness
de paridade de UI (KNOWLEDGE.md P-17 — paridade dual) para o futuro
`migration/PARITY_CHECKLIST.md`: o PNG é a metade VISUAL ("como parece") e o
ária snapshot é a metade SEMÂNTICA ("o que significa") — artefato de comparação
ESTRUTURAL old-vs-new que sobrevive a redesign (um label/perfil acessível que
se perde move zero pixels). É o complemento runtime da engenharia reversa
estática (`rdd-reverse-orchestrator`). A skill é **captura + fila**: a graduação
de candidatas é humana (dono + data — KNOWLEDGE.md P-12).

## Pré-requisitos (todos obrigatórios — sem eles: abort com orientação)

1. **Sistema RODANDO em URL de dev/staging declarada no prompt.** A URL deve vir
   explicitamente no prompt do operador/primary. **NUNCA produção — linha dura**
   (a captura dispara requisições reais contra o sistema).
2. **Credenciais de teste** (usuário sintético de dev/staging) — nunca credenciais
   reais.
3. **MCP Playwright configurado no projeto** — se ausente, oriente o setup pela
   skill `rdd-mcp-playwright-setup` e aborte esta execução.

## Lê (upstream)

- Prompt do operador/primary: URL de dev/staging, rotas a capturar (da Fatia 3
  estática do `rdd-reverse-orchestrator` ou listadas pelo operador) e credenciais
  de teste.
- MCP Playwright configurado no projeto (`.opencode/opencode.json`).
- (Opcional) `reverse/CANDIDATES.md` existente — a fila é atualizada em delta,
  no mesmo padrão P-12 do reverse estático.

## Gera (downstream)

- `<docs-do-produto>/<Produto>/reverse/ui/<rota-slug>/<estado>.png` — screenshots
  por rota × estado (metade VISUAL da paridade).
- `<docs-do-produto>/<Produto>/reverse/ui/<rota-slug>/<estado>.aria.yml` —
  snapshot de acessibilidade (árvore AX em YAML) por estado capturado — metade
  SEMÂNTICA da paridade dual (P-17): comparação ESTRUTURAL old-vs-new que
  sobrevive a redesign e detecta label/perfil acessível perdido (move zero
  pixels).
- `<docs-do-produto>/<Produto>/reverse/UI_CAPTURE.md` — manifesto da captura
  (cabeçalho de proveniência + tabela por rota/estado; append por rodada).
- `<docs-do-produto>/<Produto>/reverse/CANDIDATES.md` — candidatas VISUAIS novas
  (status `pending`, data, evidência `[screenshot: reverse/ui/...]`).

## Nunca edita

- REQUIREMENTS.md, specs/, código-fonte, testes — captura + fila; graduação é humana.
- Qualquer arquivo fora de `reverse/ui/**`, `reverse/UI_CAPTURE.md` e
  `reverse/CANDIDATES.md`.
- `knowledge/` (fundação é papel do `rdd-domain-research`).

## Tools

Ferramentas do MCP Playwright (catálogo do projeto):

| Tool | Uso na captura |
|------|----------------|
| `browser_navigate` | Navegar para a rota declarada |
| `browser_resize` | Alternar viewport (mobile 390×844 / desktop 1280×800) |
| `browser_snapshot` | Verificar estado acessível da página antes do screenshot E gravar o snapshot AX (árvore de acessibilidade) como `<estado>.aria.yml` — metade semântica da paridade (P-17) |
| `browser_take_screenshot` | Gravar o PNG do estado |
| `browser_click` | Disparar estados (submeter formulário, abrir modal) |
| `browser_type` | Preencher formulários com dados sintéticos |
| `browser_console_messages` | Coletar erros/warnings de console por tela |

Mais `read`, `write` (apenas nos caminhos de Gera), `glob` (fila/manifestos
existentes) e `grep`.

## Algoritmo

1. **Receber insumos:** rotas (da Fatia 3 estática ou listadas pelo operador) +
   credenciais de teste + URL de dev/staging. Qualquer pré-requisito ausente →
   abort (Modo de erro).
2. **Autenticar:** navegar para a URL, efetuar login com o usuário de teste e
   confirmar autenticação (snapshot).
3. **Por rota, capturar os estados padrão:** vazio (estado inicial); preenchido
   (dados sintéticos válidos); erro de validação (submeter formulário inválido e
   capturar a mensagem); modal aberto (se houver); mobile (viewport 390×844) E
   desktop (1280×800) para cada estado.
4. **Capturar transições comportamentais em fluxos multi-passo (Logic Drift —
   KNOWLEDGE.md P-17/AP-12):** além dos estados por tela, capture TRANSIÇÕES —
   preencher o passo N → avançar → capturar o passo N+1 e REGISTRAR o que foi
   limpo/persistido entre passos; campos com validação onBlur vs onClick —
   dispare cada evento quando detectável; dados que reaparecem ao voltar.
   Cada comportamento observado → candidata **comportamental** em
   `reverse/CANDIDATES.md` com evidência
   `[screenshot: reverse/ui/fluxo-<nome>/passo-N+1.png]` + descrição da
   transição (ex.: "ao avançar do passo 2 para 3, campo X é limpo").
5. **Gravar PNGs + ária snapshots** em `reverse/ui/<rota-slug>/<estado>.png` e
   `<estado>.aria.yml` (ex.: `reverse/ui/servicos-novo/erro-validacao-mobile.png`
   + `erro-validacao-mobile.aria.yml`) — PNG e ária para TODO estado capturado
   (paridade dual — P-17).
6. **Capturar requisições de rede observadas + erros de console** por tela
   (`browser_console_messages`; requisições listadas no manifesto).
7. **Gravar `reverse/UI_CAPTURE.md`** (template abaixo): cabeçalho de
   proveniência + nota de captura determinística (P-18) na primeira execução e
   rodadas novas ANEXADAS por data (a série de capturas é comparável entre
   rodadas).
8. **Gerar candidatas visuais e comportamentais** em `reverse/CANDIDATES.md` —
   validações de formulário observadas, transições de fluxo (passo 4), estados
   anômalos, erros de console com comportamento de negócio — entrando na fila
   viva com status `pending`, data da rodada e evidência
   `[screenshot: reverse/ui/...]`.

## Guardas (linhas duras)

- **Dados sintéticos/anonimizados sempre que possível** — nunca inserir dado
  pessoal real em formulários do sistema capturado.
- **Toda imagem com possível dado pessoal** (mesmo em tela alheia — ex.:
  listagem com nomes/CPFs) é marcada `⚠️ PII` no manifesto. Só sinalize — a
  triagem de tratamento é papel do `rdd-compliance-check`; NUNCA opine sobre
  base legal, anonimização ou conformidade.
- **NUNCA navegar para URL não declarada no prompt** (inclui links externos
  encontrados nas telas) e **NUNCA produção**.
- **Escrita restrita** a `reverse/ui/**`, `reverse/UI_CAPTURE.md` e
  `reverse/CANDIDATES.md`.

## Template — reverse/UI_CAPTURE.md

```markdown
# UI Capture — <Nome do Produto> (golden master visual do legado)

> **Data:** YYYY-MM-DD HH:mm
> **URL:** <URL de dev/staging declarada no prompt>
> **Usuário de teste:** <usuário sintético> (credenciais NUNCA registradas aqui)
> **Resoluções:** mobile 390×844 · desktop 1280×800
> **Rodada:** N (append por data — capturas anteriores preservadas)
> **Captura determinística (KNOWLEDGE.md P-18):** viewport fixo + fixture
> sintética são pré-condição de comparabilidade da série (old-vs-new sem
> recaptura); regiões dinâmicas (timestamps, animações) mascaradas/excluídas
> da captura quando possível. Threshold de paridade anotado POR TELA (default
> `≤0,5% pixels`) para a comparação futura sem recaptura.

| Rota | Estado | Tipo evidência | Arquivo PNG | Ária .yml | Regiões dinâmicas mascaradas | Threshold de paridade | Requisições observadas | Console | ⚠️ PII | Candidatas geradas |
|---|---|---|---|---|---|---|---|---|---|---|
| `/servicos/novo` | erro-validacao-mobile | estado | `reverse/ui/servicos-novo/erro-validacao-mobile.png` | `reverse/ui/servicos-novo/erro-validacao-mobile.aria.yml` | relógio do header | ≤0,5% pixels | POST /api/servicos (400) | 1 erro (TypeError) | não | CAND-V-003 |
| `/cadastro` | passo-2→3 | transição | `reverse/ui/fluxo-cadastro/passo-3.png` | `reverse/ui/fluxo-cadastro/passo-3.aria.yml` | — | ≤0,5% pixels | POST /api/cadastro/etapa2 (200) | — | não | CAND-V-004 (comportamental — "ao avançar do passo 2 para 3, campo X é limpo") |
```

## Modo de erro

`abort` — pré-requisito ausente (URL não declarada, credenciais de teste
ausentes, MCP Playwright não configurado, URL apontando para produção): NÃO
capture nada, explique o pré-requisito faltante com a orientação de correção
(ex.: rodar `rdd-mcp-playwright-setup`) e encerre SEM escrever artefatos.

## Casos de Borda

- **Rota inacessível após login (404/403/erro runtime):** registre a linha no
  manifesto com estado `inacessível` + motivo e capture o que for possível —
  nunca falhe a rodada inteira por uma rota.
- **Login falha com credenciais de teste:** aborte a rodada, registre no retorno
  e peça credenciais válidas ao operador — sem autenticação não há captura.
- **`reverse/CANDIDATES.md` inexistente:** crie a fila com as candidatas visuais
  da rodada (`pending`), no mesmo padrão do reverse estático (P-12).
- **Estado sem representação (rota sem modal):** registre `n/a` no manifesto —
  não invente estado.
- **Captura em sistema staged (por BC — IMP-143):** o manifesto aceita escopo no
  cabeçalho (`Escopo: <BC>`); os PNGs seguem em `reverse/ui/` (o slug da rota já
  desambigua).
- **Dado pessoal em tela de terceiros** (listagem com CPF de clientes de
  staging): marque `⚠️ PII = sim` na linha — imagem fica para triagem via
  `rdd-compliance-check`.