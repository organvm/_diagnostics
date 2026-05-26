import { useState } from "react";

/* ─────────────────────────────────────────────────────────────────────────
   Expansive Inquiry — "The Ideal Machinations of a Diagnostics System"
   Instrument-panel report. All data inlined; no external fonts or chart libs.
   ───────────────────────────────────────────────────────────────────────── */

type Lens = {
  n: string;
  name: string;
  role: string;
  posture: string;
  accent: string;
  claim: string;
  contribution: string;
  blindspot?: string;
};

const LENSES: Lens[] = [
  {
    n: "00",
    name: "Scope",
    role: "Clarification",
    posture: "phenomenological reduction",
    accent: "#8a94a6",
    claim:
      "What invariant mechanisms must any system possess to faithfully know the live state of another system it cannot fully observe — without corrupting either the observed system or its own judgment?",
    contribution:
      "Set the teleological frame — the only lens to ask “ideal for whom?” and to plant the deepest reading: that an ideal diagnostics system works to make itself unnecessary.",
  },
  {
    n: "01",
    name: "Logic",
    role: "Rational branching",
    posture: "analytic philosophy",
    accent: "#4fb0c6",
    claim:
      "Faithful diagnosis is not the production of true reports but the maintenance of a relation between belief and a continuously-refreshed observation — such that no belief outlives the volatility of the signal that produced it.",
    contribution:
      "The only constructive formalism: faithfulness as the relation R(B,S,t), the staleness bound, the two-axis trust calculus. Proved every other invariant reduces to faithfulness-as-reconciliation.",
    blindspot:
      "Never reached for external doctrine — re-derived from first principles what central banking had already systematized. Rigor without raid.",
  },
  {
    n: "02",
    name: "Mythos",
    role: "Intuitive branching",
    posture: "mythopoetic",
    accent: "#d6a35c",
    claim:
      "The ideal diagnostics system is an Apophatic Oracle — a seer that knows only by what it refuses, whose deepest machination is to scheme toward its own silence.",
    contribution:
      "Supplied what Logic is constitutionally blind to: the affective unity of refusal. Converted a list of constraints into one character — the seer defined by what it will not do.",
    blindspot:
      "Over-converged — funneled all five framings into a single archetype. Elegant, but “find one cause everywhere” is the kill-the-loudest-process pathology in literary form.",
  },
  {
    n: "03",
    name: "Bridge",
    role: "Lateral",
    posture: "transdisciplinary",
    accent: "#5fae7e",
    claim:
      "Central-bank monetary policy is the only field that already built a mature playbook for the exact triple-bind — signals that lag, get revised, and are self-referential.",
    contribution:
      "Left the building. Crossed into sonar, ecology, archaeology, apophatics — and surfaced the only idea in the whole inquiry that contradicts the others: publish your reaction function (forward guidance).",
    blindspot:
      "Slightly over-claimed central banking as “the answer,” and imported forward guidance without testing whether announcing yourself violates non-perturbation.",
  },
  {
    n: "04",
    name: "Meta",
    role: "Recursive design",
    posture: "reflexive",
    accent: "#c2607a",
    claim:
      "This inquiry is itself a diagnostics system; its honest verdict is one productive contradiction to keep (silence vs. transparency) and one suspicious convergence to stress-test (negation).",
    contribution:
      "Diagnosed the inquiry as a system: routed its sharpest objection back into its most rigorous lens, and flagged that high convergence is a yellow flag — either deep truth or leaked framing.",
  },
  {
    n: "05",
    name: "Pattern",
    role: "Emergent recognition",
    posture: "cross-lens overlay",
    accent: "#d97546",
    claim:
      "The topic's shape is a cone, not a fan — and the single fracture at its tip (silence vs. transparency) is the most productive output of the whole inquiry.",
    contribution:
      "Computed the topology. Found four motifs recurring across ≥3 lenses, three meta-patterns, and exactly one clean fracture where the cone splits.",
  },
];

const SIGNATURE: { axis: string; value: number; note: string }[] = [
  { axis: "Logical depth", value: 96, note: "3-level recursion held; re-derived the others" },
  { axis: "Metaphorical fit", value: 94, note: "5 earned archetypes, zero generic" },
  { axis: "Cross-domain reach", value: 95, note: "sonar · central banking · ecology · archaeology" },
  { axis: "Reflexive", value: 82, note: "the inquiry diagnosed itself" },
  { axis: "Convergence", value: 88, note: "cone, not fan — rare" },
  { axis: "Actionability", value: 72, note: "formalism + playbook; telos less so" },
];

const METAPATTERNS = [
  {
    id: "MP1",
    title: "Faithfulness is subtractive, not additive",
    body:
      "Better diagnosis means admitting less signal, not more — quarantine the liar, report the delta, name what is provably-not-happening. The ideal instrument is a filter, not an accumulator. This inverts the add-more-sensors default.",
    lenses: "Logic · Mythos · Bridge",
  },
  {
    id: "MP2",
    title: "Observation and capture are conjugate",
    body:
      "You cannot have zero resident footprint and guaranteed capture of an unannounced transient — an uncertainty relation derived three ways. The resolution is identical each time: externalize the trigger, make the observation impulsive.",
    lenses: "Logic · Mythos · Bridge",
  },
  {
    id: "MP3",
    title: "The objective points away from its own use",
    body:
      "The ideal diagnostics system optimizes against its own engagement — success is a falling duty-cycle toward a dormant verifier. A system whose utility rises with the patient's sickness is misaligned by construction.",
    lenses: "all five lenses",
  },
];

/* ── Custom SVG radar — epistemic signature ───────────────────────────── */
function Radar() {
  const size = 320;
  const cx = size / 2;
  const cy = size / 2;
  const R = 118;
  const n = SIGNATURE.length;
  const angle = (i: number) => -Math.PI / 2 + (i * 2 * Math.PI) / n;
  const pt = (i: number, r: number): [number, number] => [cx + r * Math.cos(angle(i)), cy + r * Math.sin(angle(i))];
  const rings = [0.25, 0.5, 0.75, 1];
  const dataPts = SIGNATURE.map((s, i) => pt(i, (s.value / 100) * R));
  const poly = dataPts.map((p) => p.join(",")).join(" ");

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[340px]" role="img" aria-label="Epistemic signature radar">
      {rings.map((rr, ri) => (
        <polygon
          key={ri}
          points={SIGNATURE.map((_, i) => pt(i, rr * R).join(",")).join(" ")}
          fill="none"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth={1}
        />
      ))}
      {SIGNATURE.map((_, i) => {
        const [x, y] = pt(i, R);
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="rgba(255,255,255,0.07)" strokeWidth={1} />;
      })}
      <polygon points={poly} fill="rgba(79,176,198,0.16)" stroke="#4fb0c6" strokeWidth={1.5} />
      {dataPts.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r={2.6} fill="#7fd0e0" />
      ))}
      {SIGNATURE.map((s, i) => {
        const [x, y] = pt(i, R + 16);
        const anchor = Math.abs(x - cx) < 12 ? "middle" : x > cx ? "start" : "end";
        return (
          <text
            key={i}
            x={x}
            y={y}
            fontSize={9}
            fill="#9fb0c4"
            textAnchor={anchor}
            dominantBaseline="middle"
            className="ff-mono"
            style={{ textTransform: "uppercase", letterSpacing: "0.04em" }}
          >
            {s.axis}
          </text>
        );
      })}
    </svg>
  );
}

/* ── Custom SVG — the cone (not a fan), with one fracture at the tip ───── */
function Cone() {
  const W = 640;
  const H = 360;
  const tipX = W / 2;
  const tipY = 250;
  const tops = LENSES.map((l, i) => ({
    x: 60 + (i * (W - 120)) / (LENSES.length - 1),
    y: 56,
    l,
  }));
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Cone topology of the inquiry">
      {tops.map((t, i) => (
        <line key={i} x1={t.x} y1={t.y + 8} x2={tipX} y2={tipY} stroke={t.l.accent} strokeWidth={1.4} opacity={0.55} />
      ))}
      {tops.map((t, i) => (
        <g key={i}>
          <circle cx={t.x} cy={t.y} r={5} fill={t.l.accent} />
          <text x={t.x} y={t.y - 14} fontSize={10} fill="#c7d2de" textAnchor="middle" className="ff-mono" style={{ letterSpacing: "0.05em" }}>
            {t.l.name}
          </text>
        </g>
      ))}
      <circle cx={tipX} cy={tipY} r={6} fill="#e6edf3" />
      <text x={tipX} y={tipY + 24} fontSize={11} fill="#e6edf3" textAnchor="middle" className="ff-mono" style={{ letterSpacing: "0.08em" }}>
        NEGATION · SELF-ERASURE
      </text>
      <line x1={tipX} y1={tipY} x2={tipX - 120} y2={tipY + 78} stroke="#8a94a6" strokeWidth={1.4} strokeDasharray="3 3" />
      <line x1={tipX} y1={tipY} x2={tipX + 120} y2={tipY + 78} stroke="#d6a35c" strokeWidth={1.4} strokeDasharray="3 3" />
      <text x={tipX - 122} y={tipY + 94} fontSize={10} fill="#a9b6c6" textAnchor="middle" className="ff-mono">
        SILENT
      </text>
      <text x={tipX - 122} y={tipY + 107} fontSize={8.5} fill="#6f7d8f" textAnchor="middle" className="ff-mono">
        (sensing)
      </text>
      <text x={tipX + 122} y={tipY + 94} fontSize={10} fill="#d6a35c" textAnchor="middle" className="ff-mono">
        TRANSPARENT
      </text>
      <text x={tipX + 122} y={tipY + 107} fontSize={8.5} fill="#9a854f" textAnchor="middle" className="ff-mono">
        (governance)
      </text>
    </svg>
  );
}

function LensCard({ lens }: { lens: Lens }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bezel bg-card border border-border/70" style={{ borderLeft: `2px solid ${lens.accent}` }}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full text-left px-4 py-3 flex items-baseline gap-3 hover:bg-white/[0.02] transition-colors"
      >
        <span className="ff-mono text-xs" style={{ color: lens.accent }}>
          {lens.n}
        </span>
        <span className="ff-serif text-lg text-slate-100">{lens.name}</span>
        <span className="ff-mono text-[10px] uppercase tracking-wider text-slate-500 ml-auto">
          {lens.role} · {lens.posture}
        </span>
        <span className="ff-mono text-slate-600 text-xs">{open ? "–" : "+"}</span>
      </button>
      <div className="px-4 pb-4 -mt-1">
        <p className="ff-serif text-[15px] leading-relaxed text-slate-300">{lens.claim}</p>
        {open && (
          <div className="mt-3 pt-3 border-t border-border/60 space-y-2">
            <p className="text-sm leading-relaxed text-slate-400">
              <span className="ff-mono text-[10px] uppercase tracking-wider text-slate-500 mr-2">contributed</span>
              {lens.contribution}
            </p>
            {lens.blindspot && (
              <p className="text-sm leading-relaxed text-slate-500">
                <span className="ff-mono text-[10px] uppercase tracking-wider mr-2" style={{ color: "#b06a6a" }}>
                  missed
                </span>
                {lens.blindspot}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function SectionLabel({ k, children }: { k: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span className="ff-mono text-[11px] text-cyan-500/80">{k}</span>
      <h2 className="ff-mono text-xs uppercase tracking-[0.2em] text-slate-400">{children}</h2>
      <div className="flex-1 h-px bg-border/60" />
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-background text-slate-200 scanline">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 py-10 sm:py-16">
        {/* ── Masthead ── */}
        <header className="border border-border/70 bezel bg-card/50">
          <div className="flex items-center justify-between px-4 py-2 border-b border-border/60">
            <span className="ff-mono text-[10px] uppercase tracking-[0.22em] text-slate-500">
              Expansive Inquiry · 6-lens orchestration
            </span>
            <span className="ff-mono text-[10px] flex items-center gap-2" style={{ color: "#5fae7e" }}>
              <span className="inline-block w-1.5 h-1.5" style={{ background: "#5fae7e" }} />
              VERDICT: CONVERGENT
            </span>
          </div>
          <div className="px-5 sm:px-8 py-8">
            <h1 className="ff-serif text-3xl sm:text-[42px] leading-[1.08] text-slate-50">
              The Ideal Machinations<br className="hidden sm:block" /> of a Diagnostics System
            </h1>
            <p className="ff-serif text-base sm:text-lg text-slate-400 mt-4 max-w-2xl leading-relaxed">
              Six cognitive postures run over one question, grounded in a tool built the same night —
              <span className="text-slate-300"> memdiag</span>, a read-only diagnostic loop born from a crisis read 48 hours too late.
            </p>
            <p className="ff-mono text-[11px] text-slate-500 mt-5 leading-relaxed">
              convergent · negation-centric · teleologically self-erasing · logic-rigorous and myth-rich in rare
              agreement · fractured on exactly one axis
            </p>
          </div>
        </header>

        {/* ── Thesis: cone not fan ── */}
        <section className="mt-14">
          <SectionLabel k="§1">Topology — a cone, not a fan</SectionLabel>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <p className="ff-serif text-[17px] leading-relaxed text-slate-300">
                Most expansive inquiries <em>diverge</em> — six postures spray a topic into six regions. This one
                <span className="text-slate-100"> converged.</span> Rigor, myth, and far-field analogy — instruments
                that share no method — funneled onto a single point: faithfulness by <em>subtraction</em>, observation
                without <em>residence</em>, and an objective that points at the system's own <em>dormancy.</em>
              </p>
              <p className="ff-serif text-[17px] leading-relaxed text-slate-400">
                When maximally different lenses agree, the agreement is load-bearing. The cone has exactly one clean
                fracture at its tip — and that crack is the most valuable thing the inquiry produced.
              </p>
            </div>
            <div className="bezel bg-card border border-border/70 p-4">
              <Cone />
            </div>
          </div>
        </section>

        {/* ── Epistemic signature ── */}
        <section className="mt-14">
          <SectionLabel k="§2">Epistemic signature</SectionLabel>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="bezel bg-card border border-border/70 p-5 flex justify-center">
              <Radar />
            </div>
            <div className="divide-y divide-border/50">
              {SIGNATURE.map((s) => (
                <div key={s.axis} className="py-2.5 flex items-baseline gap-4">
                  <span className="ff-mono text-[11px] uppercase tracking-wider text-slate-400 w-40 shrink-0">
                    {s.axis}
                  </span>
                  <div className="flex-1 h-1.5 bg-white/[0.05]">
                    <div className="h-full" style={{ width: `${s.value}%`, background: "#4fb0c6" }} />
                  </div>
                  <span className="ff-mono text-xs text-slate-300 w-8 text-right">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── The six lenses ── */}
        <section className="mt-14">
          <SectionLabel k="§3">The six lenses · click to expand</SectionLabel>
          <div className="grid sm:grid-cols-2 gap-3">
            {LENSES.map((l) => (
              <LensCard key={l.n} lens={l} />
            ))}
          </div>
        </section>

        {/* ── The fault line ── */}
        <section className="mt-14">
          <SectionLabel k="§4">The fracture — silence vs. transparency</SectionLabel>
          <p className="ff-serif text-[17px] leading-relaxed text-slate-300 mb-6 max-w-3xl">
            The lenses split on exactly one axis. The contradiction dissolves once you notice the topic was conflating
            two regimes — and the ideal system lives in both, sequentially.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bezel bg-card border border-border/70 p-5" style={{ borderTop: "2px solid #8a94a6" }}>
              <div className="ff-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-1">Regime A</div>
              <h3 className="ff-serif text-xl text-slate-100">Diagnosis-as-sensing</h3>
              <div className="ff-mono text-sm mt-2" style={{ color: "#a9b6c6" }}>SILENT · passive · non-resident</div>
              <p className="text-sm text-slate-400 mt-3 leading-relaxed">
                Any emission perturbs the measured economy. To observe is to consume — so touch lightly and announce
                nothing.
              </p>
              <div className="ff-mono text-[11px] text-slate-500 mt-3 pt-3 border-t border-border/60">
                locus → snap · watch · no-daemon
              </div>
            </div>
            <div className="bezel bg-card border border-border/70 p-5" style={{ borderTop: "2px solid #d6a35c" }}>
              <div className="ff-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-1">Regime B</div>
              <h3 className="ff-serif text-xl text-slate-100">Diagnosis-as-governance</h3>
              <div className="ff-mono text-sm mt-2" style={{ color: "#d6a35c" }}>TRANSPARENT · announced</div>
              <p className="text-sm text-slate-400 mt-3 leading-relaxed">
                Publishing thresholds lets the patient self-regulate. Here transparency <em>reduces</em> future
                intervention — the observer-effect becomes coordination.
              </p>
              <div className="ff-mono text-[11px] text-slate-500 mt-3 pt-3 border-t border-border/60">
                locus → close (forcing function)
              </div>
            </div>
          </div>
          <div className="mt-4 border border-cyan-800/40 bg-cyan-950/20 px-5 py-4">
            <span className="ff-mono text-[10px] uppercase tracking-[0.2em] text-cyan-500/80">resolution</span>
            <p className="ff-serif text-lg text-slate-100 mt-1">
              Silent as a sensor, loud as a policy. Faithfulness is a positive relation maintained through negative
              operations.
            </p>
          </div>
        </section>

        {/* ── Meta-patterns ── */}
        <section className="mt-14">
          <SectionLabel k="§5">Three meta-patterns</SectionLabel>
          <div className="space-y-3">
            {METAPATTERNS.map((m) => (
              <div key={m.id} className="bezel bg-card border border-border/70 px-5 py-4 flex gap-5">
                <div className="ff-mono text-2xl text-slate-600 shrink-0 w-14">{m.id}</div>
                <div>
                  <h3 className="ff-serif text-lg text-slate-100">{m.title}</h3>
                  <p className="text-sm text-slate-400 mt-1.5 leading-relaxed">{m.body}</p>
                  <div className="ff-mono text-[10px] uppercase tracking-wider text-slate-600 mt-2">
                    attested in {m.lenses}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Next inquiry ── */}
        <section className="mt-14">
          <SectionLabel k="§6">The next inquiry</SectionLabel>
          <div className="bezel border border-border/70 bg-gradient-to-b from-card to-background px-6 py-7">
            <p className="ff-serif text-xl sm:text-2xl leading-relaxed text-slate-100">
              If an ideal diagnostics system must be silent while sensing yet transparent while governing, what is the
              formal protocol for the <em>transition</em> between those regimes — and can a read-only observer publish a
              “reaction function” without that publication becoming the active-sonar ping that compromises the next
              observation?
            </p>
            <p className="ff-mono text-sm text-cyan-500/80 mt-5">
              → what is the central bank of a 16&nbsp;GB laptop, and does its forward guidance perturb the processes it
              guides?
            </p>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="mt-14 pt-5 border-t border-border/60 flex flex-wrap gap-x-8 gap-y-1 ff-mono text-[10px] uppercase tracking-wider text-slate-600">
          <span>methodology: multi-lens-collaborative-inquiry</span>
          <span>grounding artifact: memdiag</span>
          <span>2026-05-25</span>
          <span>corpus: 00-scope → 06-synthesis</span>
        </footer>
      </div>
    </div>
  );
}
