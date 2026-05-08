import Link from "next/link";
import {
  ArrowRight,
  GraduationCap,
  ListChecks,
  School,
  Sparkles,
  TrendingUp,
} from "lucide-react";

export function HeroLanding() {
  return (
    <section
      className="relative overflow-hidden bg-marble"
      data-slot="hero-landing"
      aria-labelledby="hero-titulo"
    >
      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-4 pt-16 pb-20 md:grid-cols-12 md:gap-8 md:px-8 md:pt-24 md:pb-28">
        {/* coluna texto */}
        <div className="md:col-span-7">
          {/* badge eyebrow colorido */}
          <span className="inline-flex items-center gap-2 rounded-full bg-shade px-4 py-2">
            <span className="size-1.5 rounded-full bg-chartreuse" aria-hidden />
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-marble">
              Secretaria do Espírito Santo
            </span>
          </span>

          <h1
            id="hero-titulo"
            className="mt-6 font-sans text-shade"
            style={{
              fontVariationSettings: '"wght" 800',
              fontSize: "clamp(2.75rem, 7vw, 5rem)",
              lineHeight: "1.04",
              letterSpacing: "-0.025em",
            }}
          >
            Avaliação que vira{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-shade">decisão</span>
              <span
                aria-hidden
                className="absolute -inset-x-1 inset-y-1.5 z-0 rounded-md bg-chartreuse"
              />
            </span>{" "}
            <span className="text-orchid italic">no mesmo dia.</span>
          </h1>

          <p
            className="mt-7 max-w-xl text-shade/75"
            style={{
              fontSize: "clamp(1.0625rem, 1.5vw, 1.25rem)",
              lineHeight: "1.5",
            }}
          >
            Plataforma estadual de simulados com IA auditável. Da Secretaria à
            sala de aula em um único fluxo — do último aluno entregando até o
            diagnóstico chegar pro coordenador, no mesmo dia.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-shade px-7 py-4 text-base font-bold text-marble transition-all hover:bg-shade/90 active:translate-y-px"
            >
              Acessar plataforma
              <ArrowRight className="size-4" aria-hidden />
            </Link>
            <a
              href="#como-funciona"
              className="inline-flex items-center justify-center rounded-full border-2 border-shade px-7 py-[14px] text-base font-bold text-shade transition-all hover:bg-shade hover:text-marble active:translate-y-px"
            >
              Ver como funciona
            </a>
          </div>

          {/* badges flutuantes embaixo */}
          <div className="mt-12 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-chartreuse px-4 py-2">
              <School className="size-3.5 text-shade" aria-hidden />
              <span className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-shade">
                47 escolas
              </span>
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-orchid px-4 py-2">
              <GraduationCap className="size-3.5 text-marble" aria-hidden />
              <span className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-marble">
                12.420 alunos
              </span>
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-poppy px-4 py-2">
              <Sparkles className="size-3.5 text-shade" aria-hidden />
              <span className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-shade">
                IA auditável
              </span>
            </span>
          </div>
        </div>

        {/* mockup multi-device */}
        <div className="relative md:col-span-5">
          <MockupHero />
        </div>
      </div>
    </section>
  );
}

function MockupHero() {
  return (
    <div className="relative mx-auto h-[560px] w-full max-w-md md:h-[600px]">
      {/* phone — fundo iris (azul escuro Linktree) */}
      <div
        className="absolute top-4 left-0 h-[480px] w-[270px] overflow-hidden rounded-[40px] bg-iris p-4 md:left-2"
        style={{ boxShadow: "0 24px 0 0 rgba(0,0,0,0.10)" }}
      >
        <div
          className="mx-auto mb-3 h-1.5 w-20 rounded-full bg-marble/30"
          aria-hidden
        />
        <div className="mt-6 flex flex-col items-center text-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-chartreuse text-2xl font-black text-shade">
            AL
          </div>
          <p className="mt-3 font-sans text-base font-bold text-marble">
            @ana.lucia
          </p>
          <p className="mt-0.5 font-mono text-[10px] tracking-widest text-marble/70 uppercase">
            EEEFM Vila Velha · 9º ano
          </p>
        </div>
        <ul className="mt-6 space-y-2">
          {[
            {
              rotulo: "Matemática · Simulado 04",
              cor: "bg-chartreuse text-shade",
              status: "✓",
            },
            {
              rotulo: "Português · em curso",
              cor: "bg-poppy text-shade",
              status: "•",
            },
            {
              rotulo: "Ciências · 02 dez",
              cor: "bg-marble/15 text-marble border border-marble/20",
              status: "→",
            },
            {
              rotulo: "Histórico completo",
              cor: "bg-marble/15 text-marble border border-marble/20",
              status: "→",
            },
          ].map((s) => (
            <li
              key={s.rotulo}
              className={`flex items-center justify-between rounded-2xl px-4 py-3 text-xs font-bold ${s.cor}`}
            >
              <span className="truncate">{s.rotulo}</span>
              <span aria-hidden className="ml-2 shrink-0">
                {s.status}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* card stat chartreuse — confiança IA */}
      <div
        className="absolute -right-2 top-0 w-[210px] rounded-3xl bg-chartreuse p-5 md:right-0"
        style={{
          boxShadow: "0 16px 0 0 rgba(0,0,0,0.10)",
          transform: "rotate(2deg)",
        }}
      >
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-shade" aria-hidden />
          <span className="font-mono text-[10px] font-bold tracking-widest text-shade uppercase">
            Confiança IA
          </span>
        </div>
        <p
          className="mt-3 font-sans text-shade tabular-nums"
          style={{
            fontSize: "3.25rem",
            lineHeight: "1",
            fontVariationSettings: '"wght" 800',
            letterSpacing: "-0.04em",
          }}
        >
          92%
        </p>
        <p className="mt-1 inline-flex rounded-full bg-shade px-2 py-1 text-[10px] font-bold text-chartreuse">
          alta · liberar
        </p>
      </div>

      {/* card form orchid */}
      <div
        className="absolute right-4 -bottom-2 w-[230px] rounded-3xl bg-orchid p-5 md:right-12"
        style={{
          boxShadow: "0 16px 0 0 rgba(0,0,0,0.12)",
          transform: "rotate(-2deg)",
        }}
      >
        <div className="flex items-center gap-2">
          <ListChecks className="size-4 text-marble" aria-hidden />
          <span className="font-mono text-[10px] font-bold tracking-widest text-marble uppercase">
            Novo simulado
          </span>
        </div>
        <p
          className="mt-2 font-sans text-marble"
          style={{
            fontSize: "1.5rem",
            lineHeight: "1.1",
            fontVariationSettings: '"wght" 700',
            letterSpacing: "-0.02em",
          }}
        >
          Geometria analítica
        </p>
        <div className="mt-3 flex items-center gap-2">
          <span className="rounded-full bg-marble/20 px-3 py-1 text-[10px] font-bold text-marble">
            9º ano
          </span>
          <span className="rounded-full bg-marble/20 px-3 py-1 text-[10px] font-bold text-marble">
            20 q.
          </span>
        </div>
      </div>

      {/* card stat trending sky */}
      <div
        className="absolute right-0 bottom-32 w-[170px] rounded-3xl bg-sky p-4 md:right-2"
        style={{
          boxShadow: "0 12px 0 0 rgba(0,0,0,0.10)",
          transform: "rotate(3deg)",
        }}
      >
        <TrendingUp className="size-5 text-shade" aria-hidden />
        <p
          className="mt-2 font-sans text-shade tabular-nums"
          style={{
            fontSize: "1.75rem",
            lineHeight: "1",
            fontVariationSettings: '"wght" 800',
            letterSpacing: "-0.03em",
          }}
        >
          +18%
        </p>
        <p className="mt-1 font-mono text-[10px] font-bold uppercase tracking-widest text-shade/70">
          vs simulado anterior
        </p>
      </div>

      {/* badge canopy flutuante */}
      <span
        className="absolute -top-4 right-32 inline-flex items-center gap-2 rounded-full bg-canopy px-3 py-1.5"
        style={{ boxShadow: "0 8px 0 0 rgba(0,0,0,0.10)" }}
      >
        <span className="size-1.5 rounded-full bg-shade" aria-hidden />
        <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-shade">
          ao vivo
        </span>
      </span>
    </div>
  );
}
