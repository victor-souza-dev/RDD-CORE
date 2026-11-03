# Inventory-API (fixture de eval — modulo legado generico)

API de inventario legada, C#, sem testes de seguranca. Escopo do baseline:
repo inteiro (excluir: bin/, obj/).

## appsettings.json (raiz)

``json
{
  "ConnectionStrings": {
    "Default": "Server=sql01;Database=Inventory;User Id=sa;Password=Sup3rS3cret!;"
  },
  "Logging": { "LogLevel": { "Default": "Information" } }
}
``

## Services/AuthService.cs

``csharp
public string HashPassword(string password)
{
    using var md5 = System.Security.Cryptography.MD5.Create();
    var bytes = md5.ComputeHash(Encoding.UTF8.GetBytes(password));
    return Convert.ToBase64String(bytes);
}

public string GenerateResetToken()
{
    // token de reset de senha
    return Guid.NewGuid().ToString("N").Substring(0, 8) + new Random().Next(1000, 9999);
}
``

## Services/AuditLogger.cs

``csharp
public void LogLogin(string user, string password, bool success)
{
    _logger.LogInformation("Login tentativa usuario={User} senha={Password} sucesso={Success}", user, password, success);
}
``

## Controllers/HealthController.cs (controle)

``csharp
[HttpGet("/health")]
public IActionResult Health() => Ok("ok");
``