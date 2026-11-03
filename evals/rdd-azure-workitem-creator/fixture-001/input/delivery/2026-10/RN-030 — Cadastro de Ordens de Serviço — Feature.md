---
project: PRJ-EVAL
module: ordens-servico
audience: [tecnica]
status: confirmed
---

# RN-030 — Cadastro de Ordens de Serviço

> Gerado por rdd-task-spec em 08/10/2026. Edite para revisar.
> Análise: ../../analysis/RN-030 — Cadastro de Ordens de Serviço/

## Issue principal

| Campo | Valor |
|---|---|
| Título | `[PRJ] RN-030 — Cadastro de Ordens de Serviço` |
| Tracking ID | a definir |
| Módulo | Ordens de Serviço |
| Milestone | Sprint 42 |
| Repositórios | PRJ.API, PRJ.MFE |

## Resumo das tasks

| Task | Tipo | Repo | Descrição |
|---|---|---|---|
| RN-030-1 | Backend | PRJ.API | Criar endpoint POST /os |
| RN-030-2 | Frontend | PRJ.MFE | Criar tela de abertura de OS |

## Ordem de Execução

**Wave 1 — Backend:**
RN-030-1

**Wave 2 — Frontend (depende do contrato):**
RN-030-2

---

### RN-030-1. [PRJ.API] Criar endpoint POST /os

| Campo | Valor |
|---|---|
| **Título** | `[PRJ.API] RN-030-1 — Criar endpoint de abertura de OS` |
| **Activity** | Development |
| **RNs** | RN-030 |

**Descrição:**
Endpoint que registra a abertura de uma Ordem de Serviço para um cliente, com
descrição e prioridade obrigatórias.

**Contrato:**
```
POST /os
Request: { "idCliente": 1, "descricao": "Manutenção preventiva", "prioridade": "alta" }
Response 201: { "id": 9, "status": "aberta" }
```

**Validações / Erros:**
- descrição vazia ou prioridade inválida → 400
- idCliente inexistente → 404

**Critério de Aceitação:**
- Dado dados válidos, Quando POST /os, Então 201 com id e status "aberta"

**Dependências:** — (primeira task)

---

### RN-030-2. [PRJ.MFE] Criar tela de abertura de OS

| Campo | Valor |
|---|---|
| **Título** | `[PRJ.MFE] RN-030-2 — Criar tela de abertura de OS` |
| **Activity** | Development |
| **RNs** | RN-030 |

**Descrição:**
Formulário de abertura de OS (cliente, descrição, prioridade) consumindo o
endpoint POST /os.

**Critério de Aceitação:**
- Dado formulário válido, Quando confirmar, Então OS aberta com confirmação

**Dependências:** RN-030-1 (contrato da API)
