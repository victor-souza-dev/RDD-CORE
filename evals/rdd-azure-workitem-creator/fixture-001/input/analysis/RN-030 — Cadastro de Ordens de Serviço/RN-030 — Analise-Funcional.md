---
project: PRJ-EVAL
module: ordens-servico
audience: [negocio]
status: confirmed
---

# RN-030 — Cadastro de Ordens de Serviço — Análise Funcional

> Gerado por rdd-task-spec em 08/10/2026 a partir de REQUIREMENTS.md (RN-030).

## O que esta entrega faz

Permite ao atendente abrir Ordens de Serviço para clientes, informando
descrição e prioridade, com registro de quem abriu e quando.

## Comportamento esperado

- O atendente preenche cliente, descrição e prioridade no formulário de OS.
- A OS aberta recebe um número e fica registrada para acompanhamento.

## Regras de negócio

| Regra | O que garante |
|---|---|
| 1 | Descrição e prioridade são obrigatórias para abrir a OS. |
| 2 | A OS só é aberta para clientes cadastrados. |

## O que fica de fora

Execução e fechamento da OS não fazem parte desta entrega.
