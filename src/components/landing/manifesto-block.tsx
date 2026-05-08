import {
  BarChart3,
  Heart,
  School,
  Sparkles,
  Trophy,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";

interface CardBento {
  icone: LucideIcon;
  rotulo: string;
  numero: string;
  unidade: string;
  bg: string;
  texto: string;
  acento: string;
  span?: string;
  extra?: string;
}

const STATS: CardBento[] = [
  {
    icone: School,
    rotulo: "Escolas estaduais",
    numero: "47",
    unidade: "ativas em 78 municípios",
    bg: "bg-chartreuse",
    texto: "text-shade",
    acento: "text-forest",
    span: "md:col-span-2",
    extra: "+12 entram até dezembro",
  },
  {
    icone: Users,
    rotulo: "Alunos cadastrados",
    numero: "12.420",
    unidade: "ativos",
    bg: "bg-orchid",
    texto: "text-marble",
    acento: "text-chartreuse",
  },
  {
    icone: Sparkles,
    rotulo: "Confiança média da IA",
    numero: "92",
    unidade: "%",
    bg: "bg-iris",
    texto: "text-marble",
    acento: "text-sky",
  },
  {
    icone: BarChart3,
    rotulo: "Simulados aplicados",
    numero: "318",
    unidade: "no ano",
    bg: "bg-rose",
    texto: "text-marble",
    acento: "text-poppy",
  },
  {
    icone: Heart,
    rotulo: "Adaptações ativas",
    numero: "1.840",
    unidade: "alunos com TDAH/dislexia/discalculia",
    bg: "bg-lavender",
    texto: "text-shade",
    acento: "text-orchid",
    span: "md:col-span-2",
  },
  {
    icone: Zap,
    rotulo: "Tempo médio do diagnóstico",
    numero: "4h",
    unidade: "do último envio à entrega",
    bg: "bg-poppy",
    texto: "text-shade",
    acento: "text-currant",
  },
  {
    icone: Trophy,
    rotulo: "Coordenadores ativos",
    numero: "82",
    unidade: "trabalhando agora",
    bg: "bg-canopy",
    texto: "text-shade",
    acento: "text-forest",
  },
];

export function ManifestoBlock() {
  return (
    <section
      className="bg-marble py-20 md:py-28"
      data-slot="bento-stats"
      aria-labelledby="bento-titulo"
    >
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8">
        <header className="mb-10 max-w-3xl md:mb-14">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-rose">
            A rede em números
          </p>
          <h2
            id="bento-titulo"
            className="mt-4 font-sans text-shade"
            style={{
              fontVariationSettings: '"wght" 800',
              fontSize: "clamp(2rem, 4.5vw, 3.5rem)",
              lineHeight: "1.07",
              letterSpacing: "-0.018em",
            }}
          >
            Atualiza{" "}
            <span className="text-orchid italic">todo dia</span>, ao vivo.
          </h2>
        </header>

        {/* bento — cards de tamanhos variados (estilo Linktree dashboard) */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-4 md:gap-4">
          {STATS.map((s, i) => (
            <article
              key={s.rotulo}
              className={`group relative overflow-hidden rounded-[28px] p-7 transition-transform duration-300 hover:-translate-y-1 md:p-8 ${s.bg} ${s.texto} ${s.span ?? ""}`}
              style={{ minHeight: i === 0 || i === 4 ? "200px" : "220px" }}
            >
              <div className="flex items-start justify-between">
                <p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] opacity-70">
                  {s.rotulo}
                </p>
                <span
                  className={`shrink-0 transition-transform duration-300 group-hover:rotate-12 ${s.acento}`}
                  aria-hidden
                >
                  <s.icone className="size-6" />
                </span>
              </div>

              <div className="mt-6 flex items-baseline gap-2">
                <p
                  className="font-sans tabular-nums"
                  style={{
                    fontSize:
                      s.span === "md:col-span-2" ? "5rem" : "3.75rem",
                    lineHeight: "1",
                    fontVariationSettings: '"wght" 800',
                    letterSpacing: "-0.04em",
                  }}
                >
                  {s.numero}
                </p>
                {s.unidade.length <= 3 && (
                  <p
                    className="font-sans"
                    style={{
                      fontSize: "1.5rem",
                      fontVariationSettings: '"wght" 700',
                      opacity: 0.7,
                    }}
                  >
                    {s.unidade}
                  </p>
                )}
              </div>

              {s.unidade.length > 3 && (
                <p className="mt-2 text-sm font-medium opacity-80">
                  {s.unidade}
                </p>
              )}

              {s.extra && (
                <p className="mt-4 inline-flex items-center rounded-full bg-shade/15 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest">
                  {s.extra}
                </p>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
