#!/usr/bin/env node
/**
 * rdd-scan.mjs — pré-scan determinístico de um módulo RDD (R4: lista fechada).
 *
 * Produz EVIDÊNCIA estruturada (quality/scan.json) para skills agênticas
 * (rdd-validate, rdd-traceability, rdd-cr-propagation-guard, rdd-next,
 * rdd-progress, rdd-tasks-pending, rdd-wiki-lint) consumirem em vez de
 * re-ler/greppar tudo manualmente. O JULGAMENTO permanece agêntico.
 *
 * Uso:
 *   node rdd-scan.mjs <raiz-do-módulo>                      # docs (default): quality/scan.json + scan-history.jsonl
 *   node rdd-scan.mjs docs <raiz-do-módulo>                 # idem (explícito)
 *   node rdd-scan.mjs tasks <raiz-do-módulo> [--strict]     # delivery: quality/tasks.json
 *   node rdd-scan.mjs config [raiz-config] [--strict]       # saúde do workflow: quality/health.json
 *   node rdd-scan.mjs diff <repo> --base <b> [--rns ...]    # evidência de review (JSON via --out/--stdout)
 *   node rdd-scan.mjs prop <raiz-do-módulo>                 # propagação de CRs: quality/propagation-evidence.json
 *
 * Flags comuns: --stdout (JSON completo) · --strict (exit 1 = gate de CI)
 * docs: --sem-historico (não acrescenta linha em scan-history.jsonl)
 * diff: --base <branch> (obrigatório) · --rns RN-001,RN-002 · --out <caminho.json>
 *
 * Cada modo é lista fechada (R4): o script entrega EVIDÊNCIA/candidatos —
 * o julgamento permanece agêntico. IMP-140.
 *
 * UTF-8 forçado em todas as leituras (a armadilha ANSI/Get-Content que mascara
 * emoji 🟢🟡🔴 não se aplica aqui). Fallbacks de caminho IMP-011 codificados.
 * Sem dependências externas — Node >= 18.
 */

import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { spawnSync } from "node:child_process";

const SELF = path.resolve(process.argv[1]);
const args = process.argv.slice(2);
const SUBCOMANDOS = ["docs", "tasks", "config", "diff", "prop"];
let modo = "docs";
if (args.length > 0 && SUBCOMANDOS.includes(args[0])) modo = args.shift();

const NS = { rn: "RN", cr: "CR", adr: "ADR", dec: "DEC", pend: "PEND" };
const refRe = /\b(RN|CR|ADR|DEC|PEND)-(\d{2,4})\b/g;
// variante org: ADR-VG-001 (VeroGovernance), ADR-ABC-NNN — conta como namespace ADR com id completo
const refReOrg = /\bADR-([A-Z]{1,6})-(\d{2,4})\b/g;
const pad = (n) => String(n).padStart(3, "0");
const idOf = (ns, num) => `${ns}-${pad(num)}`;
const EXCLUDE_DIRS = new Set([".git", "node_modules", ".opencode", "contracts"]);
const EXCLUDE_FILES = new Set(["VALIDATION_REPORT.md", "CONFIDENCE_REPORT.md", "scan.json", "tasks.json", "health.json", "propagation-evidence.json"]);

// ---------- dispatcher de subcomandos (docs segue no fluxo linear abaixo) ----------
if (modo === "tasks") process.exit(runTasks(args));
if (modo === "config") process.exit(runConfig(args));
if (modo === "diff") process.exit(runDiff(args));
if (modo === "prop") process.exit(runProp(args));

function uso() {
  console.error(
    "uso: node rdd-scan.mjs <comando> <alvo> [flags]\n" +
    "  node rdd-scan.mjs <raiz-do-módulo>                      # docs (default): quality/scan.json + scan-history.jsonl\n" +
    "  node rdd-scan.mjs tasks <raiz-do-módulo> [--strict]     # delivery: quality/tasks.json\n" +
    "  node rdd-scan.mjs config [raiz-config] [--strict]       # saúde do workflow: quality/health.json\n" +
    "  node rdd-scan.mjs diff <repo> --base <b> [--rns RN-001,RN-002] [--out f.json] [--stdout] [--strict]\n" +
    "  node rdd-scan.mjs prop <raiz-do-módulo> [--stdout]      # propagação de CRs: quality/propagation-evidence.json\n" +
    "  docs flags extra: [--sem-historico]"
  );
}

// ---------- 0. raiz do módulo (modo docs) ----------
const strict = args.includes("--strict");
const printJson = args.includes("--stdout");
const rootArg = args.find((a) => !a.startsWith("--"));
if (!rootArg) {
  uso();
  process.exit(2);
}
const root = path.resolve(rootArg);
if (!fs.existsSync(root) || !fs.statSync(root).isDirectory()) {
  console.error(`raiz inválida: ${root}`);
  process.exit(2);
}

// ---------- 1. inventário de arquivos (.md, UTF-8) ----------

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (EXCLUDE_DIRS.has(entry.name) || entry.name === "meetings") continue;
      walk(path.join(dir, entry.name), out);
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith(".md")) {
      if (EXCLUDE_FILES.has(entry.name)) continue;
      out.push(path.join(dir, entry.name));
    }
  }
  return out;
}

// exclui checkpoints de reuniões (refs históricas resolvidas geram falso positivo)
const allFiles = walk(root).filter((f) => !f.split(path.sep).includes("meetings"));
const texts = new Map();
for (const f of allFiles) {
  texts.set(f, fs.readFileSync(f, "utf8")); // UTF-8 explícito
}
const rel = (f) => path.relative(root, f).split(path.sep).join("/");

// ---------- 2. resolução de artefatos (fallback IMP-011) ----------
function firstExisting(relPaths) {
  for (const p of relPaths) {
    const abs = path.join(root, p);
    if (fs.existsSync(abs)) return { abs, relPath: p };
  }
  return null;
}
const artifacts = {
  requirements: firstExisting(["REQUIREMENTS.md"]),
  decisions: firstExisting(["DECISIONS.md"]),
  changeRequests: firstExisting(["support/CHANGE_REQUESTS.md", "CHANGE_REQUESTS.md"]),
  dataModel: firstExisting(["specs/DATA_MODEL.md", "DATA_MODEL.md"]),
  apiContracts: firstExisting(["specs/API_CONTRACTS.md", "API_CONTRACTS.md"]),
  uiSpec: firstExisting(["specs/UI_SPEC.md", "UI_SPEC.md"]),
};

// ---------- 3. IDs definidos (fonte única por namespace + fallbacks estruturais) ----------
const defined = { RN: new Set(), PEND: new Set(), CR: new Set(), ADR: new Set(), DEC: new Set() };
const definedIn = {}; // id -> arquivo-fonte da definição (para auditoria estrutural)
function collectDefined(art, set, opts = {}) {
  if (!art) return 0;
  const t = texts.get(art.abs);
  for (const m of t.matchAll(refRe)) {
    const id = idOf(m[1], m[2]);
    if (opts.namespaces && !opts.namespaces.includes(id.split("-")[0])) continue;
    set.add(id);
    definedIn[id] ??= art.relPath;
  }
  if (!opts.namespaces || opts.namespaces.includes("ADR")) {
    for (const m of t.matchAll(refReOrg)) {
      const id = `ADR-${m[1]}-${m[2]}`;
      set.add(id);
      definedIn[id] ??= art.relPath;
    }
  }
  return set.size;
}
collectDefined(artifacts.requirements, defined.RN, { namespaces: ["RN"] });
collectDefined(artifacts.requirements, defined.PEND, { namespaces: ["PEND"] });
// CR: união de TODOS os CHANGE_REQUESTS*.md (alguns módulos têm raiz + support — IMP-011 em transição)
const crFiles = allFiles.filter((f) => /^CHANGE_REQUESTS.*\.md$/i.test(path.basename(f)));
for (const f of crFiles) collectDefined({ abs: f, relPath: rel(f) }, defined.CR, { namespaces: ["CR"] });
// ADR/DEC: DECISIONS.md é canônico; sem ele, fallbacks estruturais (ARCHITECTURE §5, REQUIREMENTS, PROJECT_CHARTER)
const noDecisions = !artifacts.decisions;
if (artifacts.decisions) {
  collectDefined(artifacts.decisions, defined.ADR, { namespaces: ["ADR"] });
  collectDefined(artifacts.decisions, defined.DEC, { namespaces: ["DEC"] });
} else {
  const fallbacks = [
    firstExisting(["specs/ARCHITECTURE.md", "ARCHITECTURE.md"]),
    artifacts.requirements,
    firstExisting(["PROJECT_CHARTER.md"]),
  ].filter(Boolean);
  for (const fb of fallbacks) {
    collectDefined(fb, defined.ADR, { namespaces: ["ADR"] });
    collectDefined(fb, defined.DEC, { namespaces: ["DEC"] });
  }
}

// ---------- 4. IDs referenciados + classificação ----------
const referenced = {}; // id -> [{file, line}]
for (const [f, text] of texts) {
  const lines = text.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    for (const m of lines[i].matchAll(refRe)) {
      const id = idOf(m[1], m[2]);
      (referenced[id] ??= []).push({ file: rel(f), line: i + 1 });
    }
    for (const m of lines[i].matchAll(refReOrg)) {
      const id = `ADR-${m[1]}-${m[2]}`;
      (referenced[id] ??= []).push({ file: rel(f), line: i + 1 });
    }
  }
}

const broken = [];
const namespaceMismatch = [];
const ok = { RN: 0, CR: 0, ADR: 0, DEC: 0, PEND: 0 };
for (const [id, places] of Object.entries(referenced)) {
  const ns = id.split("-")[0];
  if (defined[ns]?.has(id)) {
    ok[ns]++;
    continue;
  }
  if (ns === "DEC") {
    const num = id.split("-")[1];
    if (defined.ADR.has(`ADR-${num}`)) {
      namespaceMismatch.push({ id, sugestao: `ADR-${num}`, onde: places });
      continue;
    }
  }
  // DEC legado sem destino: warning leve, não error (rdd-decision-audit: DEC legado é imutável)
  const severity = ns === "DEC" ? "warning" : "error";
  broken.push({ id, severity, onde: places });
}

// ---------- 5. cobertura presencial RN × downstream (evidência p/ cat.1) ----------
// presença = menção exata do ID OU range expandido ("RN-063..088", "RN-063 a 088", "RN-063–088")
function expandRanges(text) {
  const covered = new Set();
  for (const m of text.matchAll(/RN-(\d{2,4})\s*(?:\.\.|–|—|\.\.\.|a|ate|até|to)\s*(?:RN-)?(\d{2,4})\b/gi)) {
    const a = parseInt(m[1], 10);
    const b = parseInt(m[2], 10);
    if (b > a && b - a <= 200) for (let n = a; n <= b; n++) covered.add(idOf("RN", n));
  }
  return covered;
}
const downstreamCovered = {};
for (const [key, art] of [["DATA_MODEL", artifacts.dataModel], ["API_CONTRACTS", artifacts.apiContracts], ["UI_SPEC", artifacts.uiSpec]]) {
  downstreamCovered[key] = art ? { text: texts.get(art.abs), ranges: expandRanges(texts.get(art.abs)) } : null;
}
const coverage = {};
for (const id of [...defined.RN].sort()) {
  const row = {};
  for (const [key, ds] of Object.entries(downstreamCovered)) {
    row[key] = ds ? ds.text.includes(id) || ds.ranges.has(id) : null; // null = artefato ausente
  }
  row._semNenhum = row.DATA_MODEL === false && row.API_CONTRACTS === false && row.UI_SPEC === false;
  coverage[id] = row;
}

// ---------- 6. evidência de CRs (status + RNs afetadas, best-effort por seção) ----------
const crs = [];
if (artifacts.changeRequests) {
  const lines = texts.get(artifacts.changeRequests.abs).split(/\r?\n/);
  let current = null;
  const headerRe = /(?:^|\s)(?:#{1,4}\s*)?\**?(CR-\d{2,4})\b/;
  for (const line of lines) {
    const h = line.match(headerRe);
    if (h && h[1] !== current?.id) {
      if (current) crs.push(current);
      current = { id: h[1], status: null, rnsAfetadas: [], _raw: [] };
    }
    if (!current) continue;
    current._raw.push(line);
    const s = line.match(/\b(approved|implemented|rejected|pending)\b/i);
    if (s && !current.status) current.status = s[1].toLowerCase();
    for (const m of line.matchAll(/\bRN-\d{2,4}\b/g)) {
      if (!current.rnsAfetadas.includes(m[0])) current.rnsAfetadas.push(m[0]);
    }
  }
  if (current) crs.push(current);
  for (const c of crs) delete c._raw;
}

// ---------- 7. confiança (UTF-8 explícito; emoji SÓ conta quando pareado com contexto de "Confiança") ----------
// emojis de severidade (PEND/KNOWN ISSUES/SECURITY) geram falso calibrado — o marcador legítimo
// de análise reversa vive em linha/tabela com "Confiança" (±2 linhas) ou "**Confiança:** Alta|Média|Baixa".
const confidence = {};
const confidenceTargets = [
  ...(artifacts.requirements ? [["REQUIREMENTS.md", artifacts.requirements.abs]] : []),
  ...allFiles
    .filter((f) => f.split(path.sep).includes("specs"))
    .map((f) => [rel(f), f]),
];
let calibrado = false;
for (const [name, f] of confidenceTargets) {
  const lines = texts.get(f).split(/\r?\n/);
  let g = 0, y = 0, r = 0, expl = 0, emojiTotal = 0;
  for (let i = 0; i < lines.length; i++) {
    const ctx = lines.slice(Math.max(0, i - 4), i + 5).join(" ");
    const hasCtx = /confian[çc]a/i.test(ctx) || /\|\s*confian[çc]a\s*\|/i.test(lines[i]);
    for (const m of lines[i].matchAll(/🟢|🟡|🔴/g)) {
      emojiTotal++;
      if (!hasCtx) continue;
      if (m[0] === "🟢") g++;
      else if (m[0] === "🟡") y++;
      else r++;
    }
    for (const mm of lines[i].matchAll(/\*\*Confiança:\*\*\s*(Alta|Média|Baixa)/gi)) {
      expl++;
      if (/alta/i.test(mm[1])) g++;
      else if (/m[ée]dia/i.test(mm[1])) y++;
      else r++;
    }
  }
  const total = g + y + r;
  if (total > 0 || expl > 0) calibrado = true;
  confidence[name] = {
    verde: g,
    amarelo: y,
    vermelho: r,
    marcadoresExplicitos: expl,
    emojisNaoPareados: emojiTotal - (g + y + r), // severidades de PEND/riscos — não são confiança
    percentual: total > 0 ? Math.round(((g + 0.5 * y) / total) * 100) : null,
  };
}

// ---------- 8. front matter + staleness MP-03 (> 183 dias) ----------
const STALE_DAYS = 183;
const stale = [];
const frontMatterRe = /^---\r?\n([\s\S]*?)\r?\n---/;
for (const [f, t] of texts) {
  const fm = t.match(frontMatterRe);
  if (!fm) continue;
  const dateM = fm[1].match(/data_ultima_revisao:\s*["']?(\d{4}-\d{2}-\d{2})/);
  if (!dateM) continue;
  const days = Math.floor((Date.now() - new Date(dateM[1] + "T00:00:00Z")) / 86_400_000);
  if (days > STALE_DAYS) stale.push({ file: rel(f), data: dateM[1], dias: days });
}

// ---------- 9. links internos quebrados ----------
// strip de code fences e inline code ANTES da extração: links dentro de
// crases são exemplos literais de sintaxe, não links reais
function stripCode(text) {
  return text
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/~~~[\s\S]*?~~~/g, " ")
    .replace(/`[^`\n]*`/g, " ");
}
const brokenLinks = [];
for (const [f, t] of texts) {
  for (const m of stripCode(t).matchAll(/\[[^\]]*\]\(([^)#?]+\.md)\)/g)) {
    const target = path.resolve(path.dirname(f), decodeURIComponent(m[1]));
    if (!fs.existsSync(target)) {
      brokenLinks.push({ de: rel(f), para: m[1] });
    }
  }
}

// ---------- 9b. sequência de RNs — gaps de numeração (IMP-140) ----------
const rnNums = [...defined.RN].map((id) => parseInt(id.slice(3), 10)).sort((a, b) => a - b);
const rnMax = rnNums.length ? rnNums[rnNums.length - 1] : 0;
const rnGaps = [];
for (let n = 1; n <= rnMax; n++) if (!defined.RN.has(idOf("RN", n))) rnGaps.push(idOf("RN", n));

// ---------- 10. saída ----------
const result = {
  meta: {
    module: path.basename(root),
    generatedAt: new Date().toISOString(),
    filesScanned: allFiles.length,
    exclusions: [".git/", "node_modules/", ".opencode/", "contracts/", "meetings/", "quality/{VALIDATION,CONFIDENCE}_REPORT.md", "scan.json"],
    namespaces: NS,
  },
  artifacts: Object.fromEntries(Object.entries(artifacts).map(([k, v]) => [k, v ? v.relPath : null])),
  estrutural: {
    semDecisionsMd: noDecisions, // ADR/DEC definidos em fallback — higiene: migrar p/ DECISIONS.md
    changeRequestFiles: crFiles.map(rel),
  },
  ids: {
    definidos: Object.fromEntries(Object.entries(defined).map(([k, v]) => [k, [...v].sort()])),
    referenciados: Object.keys(referenced).length,
    okContagem: ok,
    quebrados: broken,
    namespaceMismatch, // ex.: DEC-001 citado, ADR-001 definido → sugerir DEC→ADR
  },
  crs,
  coverage,
  coberturaCandidatos: Object.entries(coverage)
    .filter(([, r]) => r._semNenhum)
    .map(([id]) => id),
  sequenciaRn: { rnMax, gaps: rnGaps },
  confidence,
  calibrado,
  staleness: stale,
  brokenLinks,
};

const qualityDir = path.join(root, "quality");
fs.mkdirSync(qualityDir, { recursive: true });
const outPath = path.join(qualityDir, "scan.json");
fs.writeFileSync(outPath, JSON.stringify(result, null, 2), "utf8");
if (!args.includes("--sem-historico")) {
  // 1 linha de drift por execução — consumido pelo rdd-drift-detector (IMP-140)
  fs.appendFileSync(
    path.join(qualityDir, "scan-history.jsonl"),
    JSON.stringify({ ts: result.meta.generatedAt, modulo: result.meta.module, arquivos: allFiles.length, refsQuebradas: broken.length, semDownstream: result.coberturaCandidatos.length, calibrado, stale: stale.length, linksQuebrados: brokenLinks.length, seqGaps: rnGaps.length }) + "\n",
    "utf8"
  );
}

if (printJson) console.log(JSON.stringify(result, null, 2));
const errCount = broken.filter((b) => b.severity === "error").length;
console.log(
  `scan ${result.meta.module}: ${allFiles.length} arquivos | ` +
    `RN ${defined.RN.size} CR ${defined.CR.size} ADR ${defined.ADR.size} DEC ${defined.DEC.size} PEND ${defined.PEND.size} | ` +
    `quebrados ${broken.length} (err ${errCount}) | mismatchNS ${namespaceMismatch.length} | ` +
    `sem-downstream ${result.coberturaCandidatos.length} | calibrado ${calibrado} | ` +
    `semDecisions ${noDecisions} | stale ${stale.length} | links quebrados ${brokenLinks.length} | seq-gaps ${rnGaps.length} -> ${path.relative(root, outPath)}`
);
process.exit(strict && errCount > 0 ? 1 : 0);

// ============================================================================
// modo tasks — parser determinístico de delivery (IMP-140, R4: lista fechada)
// Fontes enumeradas (ordem de prioridade): Feature.md (IMP-093) > Tasks.md
// (IMP-092) > pasta IMP-040 > flat RN-*.md (pré-IMP-040/034) > TASKS*.md
// (sprint). O julgamento permanece agêntico — o JSON é EVIDÊNCIA.
// ============================================================================
function parseFrontMatter(text) {
  const t = text.replace(/^\uFEFF/, ""); // BOM (IMP-097)
  const m = t.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return { ok: false, problema: "front matter ausente ou delimitador quebrado (IMP-086)", data: {}, bloco: "" };
  const data = {};
  const fl = m[1].split(/\r?\n/);
  for (let i = 0; i < fl.length; i++) {
    const kv = fl[i].match(/^([A-Za-z_-]+):\s*(.*)$/);
    if (!kv || kv[1] === "tools") continue;
    let val = kv[2].trim();
    if (/^(?:>|-?>|\|-?)$/.test(val)) {
      // folded/literal block scalar (ex.: description: >-) — consome linhas indentadas
      const parts = [];
      let j = i + 1;
      for (; j < fl.length && /^\s+\S/.test(fl[j]); j++) parts.push(fl[j].trim());
      val = parts.join(" ");
      i = j - 1;
    } else val = val.replace(/^["']|["']$/g, "");
    data[kv[1]] = val;
  }
  return { ok: true, data, bloco: m[1], problema: null };
}

function runTasks(args) {
  const strict = args.includes("--strict");
  const printJson = args.includes("--stdout");
  const rootArg = args.find((a) => !a.startsWith("--"));
  if (!rootArg) { uso(); return 2; }
  const root = path.resolve(rootArg);
  if (!fs.existsSync(root) || !fs.statSync(root).isDirectory()) { console.error(`raiz inválida: ${root}`); return 2; }

  const STATUS_MAP = { implemented: "done", done: "done", concluido: "done", concluído: "done", "in-progress": "in-progress", draft: "draft" };
  const normStatus = (s) => {
    if (!s) return "unknown";
    const k = String(s).toLowerCase().trim().replace(/^["']|["']$/g, "");
    return STATUS_MAP[k] ?? "unknown";
  };
  const FEAT_RE = /^(.+?) — (Feature|Tasks)\.md$/;            // IMP-093 / fallback IMP-092
  const ANCHOR_RE = /^((?:RN|PEND)-\d{2,4}) — (.+)$/;         // split no 1º " — " (título pode conter —)
  const FLAT_RE = /^((?:RN|PEND)-\d{2,4})(?: — (.+))?\.md$/;  // pré-IMP-040/034
  const TEC_RE = / — Analise-(?:Tecnica|Funcional)\.md$/;     // arquivos da pasta IMP-040
  const prio = { feature: 5, tasks: 4, "pasta-IMP-040": 3, flat: 2, sprint: 1 };
  const found = new Map();
  const dupes = [];
  const consider = (rec) => {
    const cur = found.get(rec.id);
    if (!cur) { found.set(rec.id, rec); return; }
    const pNew = prio[rec.camada], pCur = prio[cur.camada];
    if (pNew > pCur) { dupes.push({ id: rec.id, mantido: rec.arquivo, descartado: cur.arquivo }); found.set(rec.id, rec); }
    else if (pNew === pCur && rec.arquivo !== cur.arquivo) dupes.push({ id: rec.id, mantido: cur.arquivo, descartado: rec.arquivo });
  };
  const relOf = (abs) => path.relative(root, abs).split(path.sep).join("/");

  // ---------- descoberta ----------
  const deliveryDir = path.join(root, "delivery");
  const sprintFiles = [];
  if (fs.existsSync(deliveryDir)) {
    for (const abs of walk(deliveryDir)) {
      const relPath = relOf(abs);
      const base = path.basename(abs);
      const dirFeat = path.basename(path.dirname(abs)).match(ANCHOR_RE);
      if (dirFeat && TEC_RE.test(base)) { consider({ id: dirFeat[1], titulo: dirFeat[2], camada: "pasta-IMP-040", arquivo: relPath, repos: [], analise: null, promovidaDe: null, implementadoEm: null, tasks: [], status: null, statusNorm: "unknown", problema: null, legado: true }); continue; }
      if (TEC_RE.test(base)) continue;
      const feat = base.match(FEAT_RE);
      if (feat) {
        const a = feat[1].match(ANCHOR_RE);
        if (a) consider({ id: a[1], titulo: a[2], camada: feat[2] === "Feature" ? "feature" : "tasks", arquivo: relPath, repos: [], analise: null, promovidaDe: null, implementadoEm: null, tasks: [], status: null, statusNorm: "unknown", problema: null, legado: false });
        continue;
      }
      if (/^TASKS.*\.md$/i.test(base)) { sprintFiles.push(abs); continue; }
      const flat = base.match(FLAT_RE);
      if (flat) consider({ id: flat[1], titulo: flat[2] ?? "", camada: "flat", arquivo: relPath, repos: [], analise: null, promovidaDe: null, implementadoEm: null, tasks: [], status: null, statusNorm: "unknown", problema: null, legado: true });
    }
  }
  // TASKS.md na raiz (pré-IMP-034)
  const rootTasks = path.join(root, "TASKS.md");
  if (fs.existsSync(rootTasks)) sprintFiles.push(rootTasks);
  for (const abs of sprintFiles) {
    let t = "";
    try { t = fs.readFileSync(abs, "utf8"); } catch { continue; }
    const seen = new Set();
    for (const m of t.matchAll(/^#{1,4}\s+((?:RN|PEND)-\d{2,4})\b\s*[-—:]?\s*(.*)$/gm)) {
      if (seen.has(m[1])) continue;
      seen.add(m[1]);
      consider({ id: m[1], titulo: (m[2] ?? "").trim(), camada: "sprint", arquivo: relOf(abs), repos: [], analise: null, promovidaDe: null, implementadoEm: null, tasks: [], status: null, statusNorm: "unknown", problema: null, legado: true });
    }
  }

  // ---------- parse de cada feature ----------
  for (const rec of found.values()) {
    if (rec.camada === "sprint") continue;
    let text = "";
    try { text = fs.readFileSync(path.join(root, rec.arquivo), "utf8"); } catch { rec.problema = "arquivo ilegível"; continue; }
    const fm = parseFrontMatter(text);
    rec.status = fm.ok ? fm.data.status ?? null : null;
    rec.statusNorm = fm.ok ? normStatus(fm.data.status) : "unknown";
    if (!fm.ok) rec.problema = fm.problema;
    const lines = text.split(/\r?\n/);
    // proveniência: bloco ">" após o H1 (tolera linhas em branco entre eles)
    let i = lines.findIndex((l) => /^#\s+/.test(l));
    let j = i + 1;
    while (j < lines.length && lines[j].trim() === "") j++;
    const prov = [];
    for (; j < lines.length && lines[j].startsWith(">"); j++) prov.push(lines[j]);
    const provText = prov.join("\n");
    rec.analise = (provText.match(/Análise:\s*([^\s].*?)\s*$/m) || [])[1] ?? null;
    rec.promovidaDe = (provText.match(/Promovid[ao] de (PEND-\d{2,4})/i) || [])[1] ?? null;
    rec.implementadoEm = (provText.match(/Implementado em (\d{2}\/\d{2}\/\d{4})/i) || [])[1] ?? null;
    // issue principal → repos (org/repo)
    const issueIdx = lines.findIndex((l) => /^##\s+Issue principal/.test(l));
    if (issueIdx >= 0) {
      const reposRow = lines.slice(issueIdx, issueIdx + 15).find((l) => /^\s*\|\s*Repositórios\s*\|/i.test(l));
      if (reposRow) rec.repos = [...new Set(reposRow.match(/[\w.-]+\/[\w.-]+/g) ?? [])];
    }
    // resumo das tasks (tabela | Task | Tipo | Repo | Descrição |)
    const tasksMap = new Map();
    const resumoIdx = lines.findIndex((l) => /^##\s+Resumo das tasks/.test(l));
    if (resumoIdx >= 0) {
      for (let j = resumoIdx + 1; j < lines.length; j++) {
        if (/^##\s+/.test(lines[j])) break;
        const row = lines[j].match(/^\s*\|\s*((?:RN|PEND)-\d{2,4}-\d{1,3})\s*\|\s*([^|]*)\|\s*([^|]*)\|\s*([^|]*)\|/);
        if (!row) continue;
        tasksMap.set(row[1], { id: row[1], tipo: row[2].trim(), repo: row[3].trim(), titulo: row[4].trim(), fontes: ["resumo"] });
      }
    }
    // headings detalhados ### RN-NNN-M. título
    for (const m of text.matchAll(/^###\s+((?:RN|PEND)-\d{2,4}-\d{1,3})[.:]\s*(.+)$/gm)) {
      const t = tasksMap.get(m[1]);
      if (t) { t.fontes.push("heading"); if (!t.titulo) t.titulo = m[2].trim(); }
      else tasksMap.set(m[1], { id: m[1], tipo: null, repo: null, titulo: m[2].trim(), fontes: ["heading"] });
    }
    rec.tasks = [...tasksMap.values()];
  }

  // ---------- PENDs §11 de REQUIREMENTS.md ----------
  const pends = { total: 0, abertas: [] };
  const reqPath = path.join(root, "REQUIREMENTS.md");
  if (fs.existsSync(reqPath)) {
    const lines = fs.readFileSync(reqPath, "utf8").split(/\r?\n/);
    // escolhe o heading "Pend" com mais entradas PEND (evita falso seção anterior)
    let best = null;
    for (let s = 0; s < lines.length; s++) {
      if (!/^#{1,3}\s+.*[Pp]end/.test(lines[s])) continue;
      let n = 0;
      for (let j = s + 1; j < lines.length && !/^#{1,3}\s+/.test(lines[j]); j++) {
        if (/\bPEND-\d{2,4}\b/.test(lines[j])) n++;
      }
      if (!best || n > best.n) best = { s, n };
    }
    if (best && best.n > 0) {
      for (let j = best.s + 1; j < lines.length && !/^#{1,3}\s+/.test(lines[j]); j++) {
        const m = lines[j].match(/^\s*[-*]?\s*\*{0,2}\s*(PEND-\d{2,4})\b(.*)$/);
        if (!m) continue;
        pends.total++;
        const fechada = /\[(?:resolvido|bloqueado)\]|promovid[ao] a (?:RN|feature)|resolvid[ao] em/i.test(m[2]);
        if (!fechada) pends.abertas.push({ id: m[1], linha: m[2].trim().slice(0, 100) });
      }
    }
  }

  // ---------- anomalias (candidates — --strict falha com qualquer uma) ----------
  const anomalias = [];
  for (const rec of found.values()) {
    if (rec.camada === "sprint") continue;
    if (rec.problema) anomalias.push({ feature: rec.id, problema: rec.problema, arquivo: rec.arquivo });
    else if (rec.statusNorm === "unknown") anomalias.push({ feature: rec.id, problema: `status fora do vocabulário (draft/in-progress/implemented): "${rec.status}"`, arquivo: rec.arquivo });
    else if (rec.tasks.length === 0 && rec.statusNorm !== "draft") anomalias.push({ feature: rec.id, problema: "0 tasks parseadas (sem resumo nem headings)", arquivo: rec.arquivo });
    if (rec.id.startsWith("PEND-")) rec.legado = true; // âncora PEND pré-IMP-094 (leitura ok)
  }

  const resumoPorStatus = {};
  for (const rec of found.values()) resumoPorStatus[rec.statusNorm] = (resumoPorStatus[rec.statusNorm] ?? 0) + 1;
  const totalTasks = [...found.values()].reduce((n, r) => n + r.tasks.length, 0);
  const result = {
    meta: { modulo: path.basename(root), generatedAt: new Date().toISOString(), vocabularioStatus: ["draft", "in-progress", "implemented", "done", "concluido"], fontes: ["feature (IMP-093)", "tasks (IMP-092)", "pasta-IMP-040", "flat", "sprint"] },
    resumo: { features: found.size, tasks: totalTasks, porStatus: resumoPorStatus, pendenciasAbertas: pends.abertas.length },
    features: [...found.values()].sort((a, b) => a.id.localeCompare(b.id)),
    pendencias: pends,
    duplicados: dupes,
    anomalias,
  };
  const qdir = path.join(root, "quality");
  fs.mkdirSync(qdir, { recursive: true });
  const outPath = path.join(qdir, "tasks.json");
  fs.writeFileSync(outPath, JSON.stringify(result, null, 2), "utf8");
  if (printJson) console.log(JSON.stringify(result, null, 2));
  console.log(
    `tasks ${result.meta.modulo}: ${found.size} features (draft ${resumoPorStatus.draft ?? 0}, in-progress ${resumoPorStatus["in-progress"] ?? 0}, done ${resumoPorStatus.done ?? 0}, unknown ${resumoPorStatus.unknown ?? 0}) | ${totalTasks} tasks | pendências abertas ${pends.abertas.length} | anomalias ${anomalias.length} -> ${path.relative(root, outPath)}`
  );
  return strict && anomalias.length > 0 ? 1 : 0;
}

// ============================================================================
// modo config — saúde determinística do workflow (IMP-140, IMP-086/080/016)
// Regras de CHECKLISTS.md codificadas como lista fechada; qualidade de
// description/semantic drift permanece agêntica (+Jev).
// ============================================================================
function runConfig(args) {
  const strict = args.includes("--strict");
  const printJson = args.includes("--stdout");
  const rootArg = args.find((a) => !a.startsWith("--"));
  const root = path.resolve(rootArg ?? path.join(os.homedir(), ".config", "opencode"));
  if (!fs.existsSync(root) || !fs.statSync(root).isDirectory()) { console.error(`raiz inválida: ${root}`); return 2; }
  const agentsDir = path.join(root, "agents");
  const skillsDir = path.join(root, "skills");
  const findings = [];
  const add = (severidade, componente, arquivo, check, detalhe) => findings.push({ severidade, componente, arquivo, check, detalhe });

  // registry.yaml — seções primary_agents/subagents/skills com entradas "- id:"
  const reg = { primary_agents: new Set(), subagents: new Set(), skills: new Set() };
  const regPath = path.join(root, "registry.yaml");
  if (fs.existsSync(regPath)) {
    let section = null;
    for (const line of fs.readFileSync(regPath, "utf8").split(/\r?\n/)) {
      const sec = line.match(/^([a-z_]+):\s*$/);
      if (sec) { section = sec[1]; continue; }
      const id = line.match(/^\s+- id:\s*(\S+)/);
      if (id && reg[section]) reg[section].add(id[1]);
    }
  } else add("warning", "registry", "registry.yaml", "registry_ausente", "registry.yaml não encontrado");

  const machinePathRe = /(?:Users[\/\\][^\/\\ "\']+|[A-Z]:[\/\\]|\/home\/)/; // IMP-016 (candidato)

  // ---------- skills ----------
  const secoesSkill = ["## Lê", "## Gera", "## Nunca edita", "## Tools", "## Modo de erro", "## Casos de Borda"];
  const skillIds = new Set();
  const skillDirs = fs.existsSync(skillsDir) ? fs.readdirSync(skillsDir, { withFileTypes: true }).filter((d) => d.isDirectory()) : [];
  for (const d of skillDirs) {
    const id = d.name;
    skillIds.add(id);
    const arq = `${id}/SKILL.md`;
    const fmFile = path.join(skillsDir, id, "SKILL.md");
    if (!fs.existsSync(fmFile)) { add("critical", "skill", arq, "skmd_ausente", "SKILL.md não encontrado na pasta"); continue; }
    const text = fs.readFileSync(fmFile, "utf8");
    const fm = parseFrontMatter(text);
    if (!fm.ok) { add("critical", "skill", arq, "fm_quebrado", fm.problema); continue; }
    const name = fm.data.name ?? "";
    if (!name) add("critical", "skill", arq, "name_ausente", "campo name ausente");
    else {
      if (name !== id) add("critical", "skill", arq, "name_pasta", `name "${name}" ≠ pasta "${id}"`);
      if (!/^[a-z0-9-]+$/.test(name) || name.length > 64) add("warning", "skill", arq, "name_formato", "fora do padrão lowercase-hyphen ≤64");
      if (!name.startsWith("rdd-")) add("warning", "skill", arq, "prefixo", "sem prefixo rdd-");
    }
    const desc = fm.data.description ?? "";
    if (!desc || desc.length < 10) add("warning", "skill", arq, "description", "description ausente/curta demais");
    if (/^tools:/m.test(fm.bloco)) add("critical", "skill", arq, "tools_proibido", "campo tools: no front matter (proibido — CHECKLISTS)");
    const low = text.toLowerCase();
    for (const sec of secoesSkill) if (!low.includes(sec.toLowerCase())) add("warning", "skill", arq, "secao_ausente", `seção "${sec}" ausente`);
    if (!/\n## (algoritmo|workflow)/i.test(text)) add("warning", "skill", arq, "algoritmo", "seção ## Algoritmo ou ## Workflow ausente");
    if (machinePathRe.test(fm.bloco)) add("warning", "skill", arq, "path_maquina", "path absoluto de máquina no front matter (IMP-016)");
    if (/\bTODO\b|FIXME|PLACEHOLDER|NÃO IMPLEMENTADO/.test(stripCode(text.replace(/^---\r?\n[\s\S]*?\r?\n---/, "")))) add("warning", "skill", arq, "marcador", "TODO/FIXME/PLACEHOLDER no corpo (fora de code fence)");
    if (!reg.skills.has(id) && id.startsWith("rdd-")) add("critical", "skill", arq, "nao_registrada", "pasta existe mas skill não está no registry.yaml");
  }
  for (const id of reg.skills) {
    if (!skillIds.has(id)) add("critical", "skill", id, "registry_drift", "registrada no registry.yaml mas pasta/SKILL.md inexistente");
  }

  // ---------- agents (subagents + primary agents) ----------
  const agentFiles = fs.existsSync(agentsDir) ? fs.readdirSync(agentsDir).filter((f) => f.endsWith(".md")) : [];
  // pré-popula ANTES do loop de checks — referências a agentes processados depois
  // não podem virar falso "ref_orfa" por ordem alfabética
  const agentIds = new Set(agentFiles.map((f) => f.replace(/\.md$/, "")));
  const secoesPrim = ["Identidade", "Preced", "Subagents", "Roteamento", "Comportamento"];
  const compRe = /\b(?:rdd|mcp|sda)-[a-z0-9]+(?:-[a-z0-9]+)*\b(?!\.(?:mjs|ps1|md|json|yaml|yml|sh|ts|js))/g;
  for (const f of agentFiles) {
    const id = f.replace(/\.md$/, "");
    const arq = `agents/${f}`;
    const text = fs.readFileSync(path.join(agentsDir, f), "utf8");
    const fm = parseFrontMatter(text);
    if (!fm.ok) { add("critical", "agent", arq, "fm_quebrado", fm.problema); continue; }
    const mode = fm.data.mode ?? "(ausente)";
    const isPrimary = mode === "primary";
    const body = text.replace(/^---\r?\n[\s\S]*?\r?\n---/, "");
    if (!fm.data.description) add("warning", isPrimary ? "primary" : "subagent", arq, "description", "description ausente");
    if (isPrimary) {
      if (fm.data.name) add("warning", "primary", arq, "name_proibido", "primary não deve ter campo name: (convenção)");
      if (fm.data.temperature !== "0.3") add("warning", "primary", arq, "temperature", `esperado 0.3, encontrado "${fm.data.temperature ?? "ausente"}"`);
      for (const sec of secoesPrim) if (!body.toLowerCase().includes(sec.toLowerCase())) add("warning", "primary", arq, "secao_ausente", `seção "${sec}" ausente`);
      if (!reg.primary_agents.has(id)) add("warning", "primary", arq, "nao_registrado", "primary ausente do registry.yaml");
    } else {
      if (mode !== "subagent") add("critical", "subagent", arq, "mode", `mode "${mode}" inválido (esperado subagent)`);
      const name = fm.data.name ?? "";
      if (name !== id) add("critical", "subagent", arq, "name_arquivo", `name "${name}" ≠ arquivo "${id}"`);
      if (name && (name.length > 64 || !/^[a-z0-9-]+$/.test(name))) add("warning", "subagent", arq, "name_formato", "fora do padrão lowercase-hyphen ≤64");
      const temp = fm.data.temperature;
      if (temp !== "0.1" && temp !== "0.2") add("warning", "subagent", arq, "temperature", `esperado 0.1/0.2, encontrado "${temp ?? "ausente"}"`);
      if (/^tools:/m.test(fm.bloco)) add("critical", "subagent", arq, "tools_proibido", "campo tools: no front matter (proibido — não existe na schema)");
      if (!/^permission:/m.test(fm.bloco)) add("critical", "subagent", arq, "permission", "permission: ausente");
      if (/^\s+(edit|write):\s*allow\s*$/m.test(fm.bloco)) add("critical", "subagent", arq, "escrita_ampla", "edit/write allow amplo (deny/ask/restrito — CHECKLISTS)");
      if (/^\s+bash:\s*allow\s*$/m.test(fm.bloco)) add("warning", "subagent", arq, "bash_ampla", "bash allow amplo (esperado ask)");
      if (machinePathRe.test(fm.bloco)) add("warning", "subagent", arq, "path_maquina", "path de máquina no front matter (IMP-016)");
      if (!reg.subagents.has(id)) add("warning", "subagent", arq, "nao_registrado", "ausente do registry.yaml (subagents)");
    }
    // IMP-080: referências a componentes (skills/subagents citados no corpo)
    const refs = [];
    for (const m of body.matchAll(compRe)) {
      if (m[0] === id) continue;
      const before = body[m.index - 1] ?? "";
      if (before === "<") continue; // placeholder de template (<rdd-s1>) — não é citação
      if (body.slice(m.index + m[0].length, m.index + m[0].length + 2) === "-*") continue; // wildcard de família (rdd-stack-*)
      refs.push(m[0]);
    }
    for (const tok of new Set(refs)) {
      const skillOk = fs.existsSync(path.join(skillsDir, tok, "SKILL.md"));
      if (skillOk) {
        if (!reg.skills.has(tok)) add("warning", isPrimary ? "primary" : "subagent", arq, "ref_nao_registrada", `${tok} existe em skills/ mas ausente do registry`);
        continue;
      }
      if (agentIds.has(tok)) {
        if (!reg.subagents.has(tok) && !reg.primary_agents.has(tok)) add("warning", isPrimary ? "primary" : "subagent", arq, "ref_nao_registrada", `${tok} existe em agents/ mas ausente do registry`);
        continue;
      }
      // indexOf que respeita o fim do token — "rdd-core" não deve casar
      // dentro de "rdd-core-update" (senão o contexto avaliado é o errado)
      let idx = -1;
      for (let from = 0; from <= body.length; ) {
        const p = body.indexOf(tok, from);
        if (p < 0) break;
        const after = body[p + tok.length] ?? "";
        if (!/[a-z0-9-]/i.test(after)) { idx = p; break; }
        from = p + 1;
      }
      const ctx = idx >= 0 ? body.slice(Math.max(0, idx - 120), idx + 120) : "";
      const qualif = /project-local|quando existir|se existir|podem não existir|pode não existir|não existir n|opcional|quando presente|quando instalad|se instalad|espelho|público|pack|stack|plugin/i.test(ctx);
      add(qualif ? "warning" : "critical", isPrimary ? "primary" : "subagent", arq, qualif ? "ref_externa_qualificada" : "ref_orfa", `${tok} não existe em skills/ nem agents/${qualif ? " (citado como condicional/externo)" : ""}`);
    }
  }
  for (const id of reg.subagents) {
    if (!agentIds.has(id)) add("critical", "subagent", id, "registry_drift", "no registry.yaml mas agents/<id>.md inexistente");
  }

  const criticos = findings.filter((x) => x.severidade === "critical").length;
  const warnings = findings.filter((x) => x.severidade === "warning").length;
  const result = {
    meta: { root: path.relative(os.homedir(), root).split(path.sep).join("/"), generatedAt: new Date().toISOString(), skills: skillIds.size, agents: agentIds.size, registry: { primary_agents: reg.primary_agents.size, subagents: reg.subagents.size, skills: reg.skills.size } },
    resumo: { criticos, warnings, componentesOk: skillIds.size + agentIds.size - new Set(findings.map((x) => x.arquivo)).size },
    findings,
  };
  const qdir = path.join(root, "quality");
  fs.mkdirSync(qdir, { recursive: true });
  const outPath = path.join(qdir, "health.json");
  fs.writeFileSync(outPath, JSON.stringify(result, null, 2), "utf8");
  if (printJson) console.log(JSON.stringify(result, null, 2));
  console.log(`config ${path.basename(root)}: ${skillIds.size} skills, ${agentIds.size} agents | críticos ${criticos} | warnings ${warnings} -> ${path.relative(root, outPath)}`);
  return strict && criticos > 0 ? 1 : 0;
}

// ============================================================================
// modo diff — evidência de review (IMP-140): RNs citadas no diff × RNs da task.
// EVIDÊNCIA: presença no diff ≠ implementação (julgamento do rdd-dev-reviewer).
// ============================================================================
function runDiff(args) {
  const strict = args.includes("--strict");
  const printJson = args.includes("--stdout");
  const rest = [];
  const flags = {};
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "--base" || a === "--rns" || a === "--out") { flags[a] = args[i + 1]; i++; continue; }
    if (a === "--strict" || a === "--stdout") continue;
    rest.push(a);
  }
  const repoArg = rest[0];
  const base = flags["--base"];
  if (!repoArg || !base) { uso(); return 2; }
  const repoAbs = path.resolve(repoArg);
  if (!fs.existsSync(path.join(repoAbs, ".git"))) { console.error(`não é um repo git: ${repoAbs}`); return 2; }
  const rnsTask = (flags["--rns"] ?? "").split(/[,;\s]+/).filter((r) => /^RN-\d{2,4}$/.test(r));

  const git = (a) => {
    const r = spawnSync("git", ["-C", repoAbs, ...a], { encoding: "utf8" });
    if (r.status !== 0) throw new Error(r.stderr.trim().split("\n")[0] || `git ${a[0]} falhou`);
    return r.stdout ?? "";
  };
  const arquivos = new Set();
  let modoGit;
  try {
    const dotdot = git(["diff", "--name-only", `${base}...HEAD`]).split(/\r?\n/).filter(Boolean);
    if (dotdot.length) { dotdot.forEach((f) => arquivos.add(f)); modoGit = `${base}...HEAD`; }
    else { git(["diff", "--name-only", base]).split(/\r?\n/).filter(Boolean).forEach((f) => arquivos.add(f)); modoGit = `${base} (worktree)`; }
    for (const line of git(["status", "--porcelain"]).split(/\r?\n/)) {
      const m = line.match(/^\?\?\s+(.+)$/);
      if (m) arquivos.add(m[1].replace(/^"|"$/g, ""));
    }
  } catch (e) { console.error(`git falhou em ${repoAbs}: ${e.message}`); return 2; }

  const rnsNoDiff = {};
  for (const f of arquivos) {
    const abs = path.resolve(repoAbs, f);
    let st; try { st = fs.statSync(abs); } catch { continue; }
    if (!st.isFile() || st.size > 2_000_000) continue;
    let t; try { t = fs.readFileSync(abs, "utf8"); } catch { continue; }
    for (const m of t.matchAll(/\bRN-\d{2,4}\b/g)) (rnsNoDiff[m[0]] ??= new Set()).add(f);
  }
  const rns = Object.keys(rnsNoDiff).sort();
  const faltando = rnsTask.filter((r) => !rnsNoDiff[r]);
  const extras = rns.filter((r) => !rnsTask.includes(r));
  const result = {
    meta: { repo: repoAbs, base, modoGit, generatedAt: new Date().toISOString() },
    arquivosAlterados: [...arquivos].sort(),
    totalRnsNoDiff: rns.length,
    rnsNoDiff: Object.fromEntries(rns.map((r) => [r, [...rnsNoDiff[r]].sort()])),
    taskRns: rnsTask,
    faltandoNoDiff: faltando,
    extrasNoDiff: rnsTask.length ? extras : [],
  };
  const json = JSON.stringify(result, null, 2);
  if (flags["--out"]) {
    const o = path.resolve(flags["--out"]);
    fs.mkdirSync(path.dirname(o), { recursive: true });
    fs.writeFileSync(o, json, "utf8");
  }
  if (printJson || !flags["--out"]) console.log(json);
  console.error(`diff ${path.basename(repoAbs)} vs ${modoGit}: ${arquivos.size} arquivos | ${rns.length} RNs no diff | task ${rnsTask.length ? `faltando ${faltando.length} de ${rnsTask.length}` : "sem --rns"}`);
  return strict && rnsTask.length > 0 && faltando.length > 0 ? 1 : 0;
}

// ============================================================================
// modo prop — propagação de CRs (IMP-140): CRs approved/implemented ×
// PROPAGATION_STATUS.md × cobertura downstream (do scan.json). Não bloqueia —
// sinaliza candidatos (contrato do rdd-cr-propagation-guard).
// ============================================================================
function runProp(args) {
  const printJson = args.includes("--stdout");
  const rootArg = args.find((a) => !a.startsWith("--"));
  if (!rootArg) { uso(); return 2; }
  const root = path.resolve(rootArg);
  if (!fs.existsSync(root) || !fs.statSync(root).isDirectory()) { console.error(`raiz inválida: ${root}`); return 2; }
  // garante scan.json (re-executa o modo docs se ausente)
  const scanPath = path.join(root, "quality", "scan.json");
  if (!fs.existsSync(scanPath)) {
    const r = spawnSync(process.execPath, [SELF, root, "--sem-historico"], { stdio: "inherit" });
    if (r.status !== 0 || !fs.existsSync(scanPath)) { console.error("falha ao gerar quality/scan.json — rode o modo docs manualmente"); return 2; }
  }
  const scan = JSON.parse(fs.readFileSync(scanPath, "utf8"));

  // PROPAGATION_STATUS.md (IMP-011: quality/ primeiro, fallback raiz)
  const psPath = [path.join(root, "quality", "PROPAGATION_STATUS.md"), path.join(root, "PROPAGATION_STATUS.md")].find((p) => fs.existsSync(p));
  const pendentesCrs = new Set();
  const resolvidos = [];
  if (psPath) {
    let secao = null;
    for (const line of fs.readFileSync(psPath, "utf8").split(/\r?\n/)) {
      const h = line.match(/^##\s+(Pendentes|Resolvidos)/i);
      if (h) { secao = h[1].toLowerCase(); continue; }
      if (/^##\s+/.test(line)) secao = null;
      if (!secao || /\*\*Nenhuma/i.test(line)) continue;
      if (secao === "pendentes") for (const m of line.matchAll(/\bCR-\d{2,4}\b/g)) pendentesCrs.add(m[0]);
      if (secao === "resolvidos") {
        const row = line.match(/^\s*\|\s*([^|]+)\|\s*(CR-\d{2,4})\s*\|\s*([^|]+)\|/);
        if (row) resolvidos.push({ rn: row[1].trim(), cr: row[2], artefato: row[3].trim() });
      }
    }
  }

  const crs = scan.crs ?? [];
  const aprovados = crs.filter((c) => c.status === "approved" || c.status === "implemented");
  const semDownstreamSet = new Set(scan.coberturaCandidatos ?? []);
  const evidencia = aprovados.map((c) => ({
    id: c.id,
    status: c.status,
    rnsAfetadas: c.rnsAfetadas,
    noPendentes: pendentesCrs.has(c.id),
    resolvidoEntries: resolvidos.filter((r) => r.cr === c.id).length,
    rnsSemDownstream: c.rnsAfetadas.filter((rn) => semDownstreamSet.has(rn)),
  }));
  const semRegistro = aprovados.filter((c) => !pendentesCrs.has(c.id) && !resolvidos.some((r) => r.cr === c.id)).map((c) => c.id);
  const result = {
    meta: { modulo: path.basename(root), generatedAt: new Date().toISOString(), propagationStatus: psPath ? path.relative(root, psPath).split(path.sep).join("/") : null },
    crsAprovadosOuImplementados: aprovados.length,
    evidencia,
    semRegistroNoPropagationStatus: semRegistro,
    pendentesCrs: [...pendentesCrs].sort(),
    resolvidosTotal: resolvidos.length,
    candidatosStale: [...new Set(evidencia.flatMap((e) => e.rnsSemDownstream))].sort(),
  };
  const qdir = path.join(root, "quality");
  fs.mkdirSync(qdir, { recursive: true });
  const outPath = path.join(qdir, "propagation-evidence.json");
  fs.writeFileSync(outPath, JSON.stringify(result, null, 2), "utf8");
  if (printJson) console.log(JSON.stringify(result, null, 2));
  console.log(`prop ${result.meta.modulo}: ${aprovados.length} CRs approved/implemented | sem registro ${semRegistro.length} | stale candidatos ${result.candidatosStale.length} -> ${path.relative(root, outPath)}`);
  return 0;
}
