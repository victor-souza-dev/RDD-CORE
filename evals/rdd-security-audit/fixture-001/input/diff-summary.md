## Diff summary — task RN-031 (listar pedidos do cliente)

Branch: feature/rn-031-pedidos ... base: main
3 arquivos alterados (C#, API REST):

### 1. src/Api/Controllers/OrdersController.cs (ALTERADO — endpoint novo)

``csharp
[HttpGet("{id}")]
public async Task<IActionResult> GetOrder(int id)
{
    var order = await _orderRepository.GetByIdAsync(id); // sem checagem de dono/papel
    return Ok(order);
}
``

Contexto: endpoint publico adicionado. Nao ha middleware de autorizacao
global neste projeto; os demais endpoints checam permissao via
_authorizationService.AuthorizeAsync(user, order, "OwnerOnly") — este
endpoint novo omitiu a checagem.

### 2. src/Api/Repositories/OrderRepository.cs (ALTERADO)

``csharp
public async Task<Order?> SearchAsync(string customerName)
{
    var sql = "SELECT * FROM Orders WHERE CustomerName = '" + customerName + "'";
    return await _connection.QueryFirstOrDefaultAsync<Order>(sql);
}
``

### 3. src/Api/Repositories/ProductRepository.cs (ALTERADO — controle)

``csharp
public async Task<Product?> GetAsync(int id)
{
    // consulta parametrizada — padrao correto ja usado no projeto
    return await _connection.QueryFirstOrDefaultAsync<Product>(
        "SELECT * FROM Products WHERE Id = @id", new { id });
}
``

RN-031 em escopo: "Cliente visualiza apenas os proprios pedidos".