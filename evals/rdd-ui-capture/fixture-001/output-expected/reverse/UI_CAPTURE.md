# UI Capture — Produto Legado X (golden master visual do legado)

> **Data:** 2026-11-02 10:30
> **URL:** http://localhost:4200
> **Usuário de teste:** tester-sintetico (credenciais NUNCA registradas aqui)
> **Resoluções:** mobile 390×844 · desktop 1280×800
> **Rodada:** 1 (append por data — capturas anteriores preservadas)

| Rota | Estado | Arquivo PNG | Requisições observadas | Console | ⚠️ PII | Candidatas geradas |
|---|---|---|---|---|---|---|
| `/servicos` | vazio-desktop | `reverse/ui/servicos/vazio-desktop.png` | GET /api/servicos (200, 0 itens) | sem erros | não | CAND-V-001 |
| `/servicos` | vazio-mobile | `reverse/ui/servicos/vazio-mobile.png` | GET /api/servicos (200, 0 itens) | sem erros | não | — |
| `/servicos` | preenchido-desktop | `reverse/ui/servicos/preenchido-desktop.png` | GET /api/servicos (200, 42 itens) | sem erros | sim | CAND-V-002 |
| `/servicos/novo` | erro-validacao-mobile | `reverse/ui/servicos-novo/erro-validacao-mobile.png` | POST /api/servicos (400) | 1 erro (TypeError no onChange) | não | CAND-V-003 |
| `/servicos/novo` | erro-validacao-desktop | `reverse/ui/servicos-novo/erro-validacao-desktop.png` | POST /api/servicos (400) | sem erros | não | CAND-V-003 |