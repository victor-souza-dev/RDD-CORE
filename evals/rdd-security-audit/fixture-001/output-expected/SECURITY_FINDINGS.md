═══ rdd-security-audit — dif main...feature/rn-031-pedidos ═══
base: security-review v1.0.0 · fluxo de dados: path param {id} e customerName (fontes) → sem processamento → SQL e resposta JSON (sinks)
findings: 2 (Crítico 2 · Alto 0 · Médio 0 · Baixo 0)
src/Api/Controllers/OrdersController.cs:2 — P-03 / AP-02 — Crítico — endpoint novo GET /api/orders/{id} sem authZ server-side (demais endpoints usam AuthorizeAsync "OwnerOnly") — IDOR: qualquer autenticado lê pedido de outro cliente — adicionar `await _authorizationService.AuthorizeAsync(User, order, "OwnerOnly")` (ou policy equivalente) antes do return
src/Api/Repositories/OrderRepository.cs:4 — P-02 / AP-01 — Crítico — SQL concatenado com input do usuário (`"... WHERE CustomerName = '" + customerName + "'"`) — injection — parametrizar a query (`@name`) e validar/limitar o input no servidor
bloqueantes: 2
pendências: nenhuma