"use client";

import { useMemo } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Building2,
  FileQuestion,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useAdminDashboard } from "@/hooks/api/use-admin";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BadgeIA } from "@/components/ia/badge-ia";
import {
  cn,
  formatarDataBR,
  formatarPorcentagem,
  gerarIniciais,
} from "@/lib/utils";

// ============================================================
// Tipos auxiliares
// ============================================================

interface InsightCurto {
  id?: string;
  titulo?: string;
  texto?: string;
}

interface PontoTendencia {
  semana: string;
  questoes: number;
  simulados: number;
  importacoes: number;
}

const TOM_KPI = {
  primario: {
    borda: "border-primary/20",
    iconeBg: "bg-primary-muted text-primary-text",
    fundo: "bg-card",
  },
  neutro: {
    borda: "border-border",
    iconeBg: "bg-muted text-muted-foreground",
    fundo: "bg-card",
  },
  vivo: {
    borda: "border-success/30",
    iconeBg: "bg-success-muted text-success",
    fundo: "bg-card",
  },
  alerta: {
    borda: "border-destructive/30",
    iconeBg: "bg-destructive-muted text-destructive",
    fundo: "bg-destructive-muted/30",
  },
} as const;

type TomKpi = keyof typeof TOM_KPI;

// ============================================================
// Página
// ============================================================

export default function PaginaDashboardAdmin() {
  const { data, isLoading, isError, refetch } = useAdminDashboard();

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6 md:py-10">
      {/* Header */}
      <header>
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          {formatarDataBR(new Date(), "EEEE',' d 'de' MMMM yyyy")}
        </p>
        <h1
          className="mt-2 font-serif text-3xl tracking-tight md:text-4xl"
          style={{ fontVariationSettings: '"wght" 510' }}
        >
          Painel administrativo
        </h1>
        <p className="mt-3 max-w-2xl text-base text-muted-foreground">
          Saúde da rede SEDU em um relance: acervo, escolas conectadas,
          atividade semanal e sinais pedagógicos detectados pela IA.
        </p>
      </header>

      {/* Erro */}
      {isError && (
        <div
          className="mt-8 flex items-start justify-between gap-4 rounded-xl border border-destructive/30 bg-destructive-muted p-5 text-destructive"
          role="alert"
        >
          <div>
            <p className="font-mono text-[10px] uppercase tracking-wider">
              Erro ao carregar dashboard
            </p>
            <p className="mt-1 text-sm">
              Não consegui buscar os dados agora. Tenta de novo?
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Tentar de novo
          </Button>
        </div>
      )}

      {/* KPIs */}
      <section className="mt-8" aria-labelledby="kpis-titulo">
        <h2 id="kpis-titulo" className="sr-only">
          Indicadores principais
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {isLoading || !data
            ? Array.from({ length: 4 }, (_, indice) => (
                <Skeleton key={indice} className="h-32 w-full rounded-xl" />
              ))
            : (
              <>
                <CardKpi
                  icone={FileQuestion}
                  rotulo="Total de questões"
                  valor={data.kpis.totalQuestoes.toLocaleString("pt-BR")}
                  delta={data.kpis.deltaQuestoes}
                  tom="primario"
                />
                <CardKpi
                  icone={Building2}
                  rotulo="Escolas ativas"
                  valor={data.kpis.totalEscolas.toLocaleString("pt-BR")}
                  delta={data.kpis.deltaEscolas}
                  tom="neutro"
                />
                <CardKpi
                  icone={Activity}
                  rotulo="Simulados no mês"
                  valor={data.kpis.simuladosNoMes.toLocaleString("pt-BR")}
                  delta={data.kpis.deltaSimulados}
                  tom="vivo"
                />
                <CardKpi
                  icone={AlertTriangle}
                  rotulo="Alunos em risco"
                  valor={data.kpis.alunosEmRisco.toLocaleString("pt-BR")}
                  delta={data.kpis.deltaRisco}
                  tom={data.kpis.alunosEmRisco > 0 ? "alerta" : "neutro"}
                  deltaInverso
                />
              </>
            )}
        </div>
      </section>

      {/* Gráfico de tendência */}
      <section className="mt-10" aria-labelledby="tendencia-titulo">
        <header className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              Atividade da rede
            </p>
            <h2
              id="tendencia-titulo"
              className="mt-1 font-serif text-xl tracking-tight md:text-2xl"
              style={{ fontVariationSettings: '"wght" 510' }}
            >
              Atividade nas últimas 12 semanas
            </h2>
          </div>
        </header>

        {isLoading || !data ? (
          <Skeleton className="h-80 w-full rounded-xl" />
        ) : (
          <GraficoTendencia dados={data.tendenciaSemanal} />
        )}
      </section>

      {/* Grid: Insights + Top escolas */}
      <div className="mt-10 grid gap-6 lg:grid-cols-5">
        <section
          className="lg:col-span-2"
          aria-labelledby="insights-titulo"
        >
          <header className="mb-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              Sinais detectados
            </p>
            <h2
              id="insights-titulo"
              className="mt-1 font-serif text-xl tracking-tight md:text-2xl"
              style={{ fontVariationSettings: '"wght" 510' }}
            >
              Insights da IA
            </h2>
          </header>
          {isLoading || !data ? (
            <Skeleton className="h-72 w-full rounded-xl" />
          ) : (
            <CardInsights
              insights={(data.insights as InsightCurto[]).slice(0, 3)}
            />
          )}
        </section>

        <section
          className="lg:col-span-3"
          aria-labelledby="top-escolas-titulo"
        >
          <header className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                Engajamento por escola
              </p>
              <h2
                id="top-escolas-titulo"
                className="mt-1 font-serif text-xl tracking-tight md:text-2xl"
                style={{ fontVariationSettings: '"wght" 510' }}
              >
                Top 10 escolas
              </h2>
            </div>
          </header>

          {isLoading || !data ? (
            <div className="space-y-2">
              {Array.from({ length: 6 }, (_, indice) => (
                <Skeleton key={indice} className="h-14 w-full rounded-lg" />
              ))}
            </div>
          ) : (
            <ListaTopEscolas escolas={data.topEscolas} />
          )}
        </section>
      </div>
    </div>
  );
}

// ============================================================
// CardKpi
// ============================================================

interface CardKpiProps {
  icone: LucideIcon;
  rotulo: string;
  valor: string;
  delta: number;
  tom: TomKpi;
  deltaInverso?: boolean;
}

function CardKpi({
  icone: Icone,
  rotulo,
  valor,
  delta,
  tom,
  deltaInverso = false,
}: CardKpiProps) {
  const tomClasses = TOM_KPI[tom];
  const positivoVisual = deltaInverso ? delta < 0 : delta > 0;
  const negativoVisual = deltaInverso ? delta > 0 : delta < 0;
  const deltaCor = positivoVisual
    ? "bg-success-muted text-success"
    : negativoVisual
      ? "bg-destructive-muted text-destructive"
      : "bg-muted text-muted-foreground";
  const DeltaIcone = delta > 0 ? ArrowUp : delta < 0 ? ArrowDown : ArrowUp;
  const deltaTexto = `${delta > 0 ? "+" : ""}${delta}`;

  return (
    <article
      className={cn(
        "rounded-xl border p-5",
        "transition-all duration-200 [transition-timing-function:var(--ease-quart)]",
        "hover:-translate-y-0.5",
        tomClasses.borda,
        tomClasses.fundo,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-md",
            tomClasses.iconeBg,
          )}
          aria-hidden
        >
          <Icone className="size-4" />
        </div>
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider tabular-nums",
            deltaCor,
          )}
          aria-label={`Variação ${deltaTexto} em relação ao mês anterior`}
        >
          {delta !== 0 && (
            <DeltaIcone className="size-3" aria-hidden />
          )}
          {deltaTexto}
        </span>
      </div>
      <p
        className="mt-5 font-serif text-[3rem] leading-none tabular-nums"
        style={{ fontVariationSettings: '"wght" 510' }}
      >
        {valor}
      </p>
      <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
        {rotulo}
      </p>
      <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground/70">
        vs. mês anterior
      </p>
    </article>
  );
}

// ============================================================
// Gráfico de tendência (Recharts LineChart)
// ============================================================

function GraficoTendencia({ dados }: { dados: PontoTendencia[] }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div style={{ width: "100%", height: 320 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={dados}
            margin={{ top: 8, right: 16, bottom: 8, left: -8 }}
          >
            <CartesianGrid
              vertical={false}
              stroke="var(--border)"
              strokeDasharray="3 3"
            />
            <XAxis
              dataKey="semana"
              axisLine={false}
              tickLine={false}
              tick={{
                fontSize: 10,
                fontFamily: "var(--font-mono)",
                fill: "var(--muted-foreground)",
              }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              width={40}
              tick={{
                fontSize: 10,
                fontFamily: "var(--font-mono)",
                fill: "var(--muted-foreground)",
              }}
            />
            <Tooltip
              cursor={{ stroke: "var(--accent)", strokeWidth: 1 }}
              contentStyle={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                fontSize: 12,
                fontFamily: "var(--font-mono)",
                padding: "8px 10px",
              }}
              labelStyle={{
                color: "var(--muted-foreground)",
                fontSize: 10,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
              itemStyle={{
                fontFamily: "var(--font-mono)",
                fontVariantNumeric: "tabular-nums",
              }}
            />
            <Legend
              iconType="circle"
              wrapperStyle={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                paddingTop: 12,
              }}
            />
            <Line
              type="monotone"
              dataKey="questoes"
              name="Questões"
              stroke="var(--chart-1)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="simulados"
              name="Simulados"
              stroke="var(--chart-2)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="importacoes"
              name="Importações"
              stroke="var(--chart-3)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ============================================================
// Card de insights da IA
// ============================================================

function CardInsights({ insights }: { insights: InsightCurto[] }) {
  const itens = insights.length > 0
    ? insights
    : [
        {
          titulo: "Sem insights novos",
          texto: "A IA continua observando padrões de desempenho na rede.",
        },
      ];

  return (
    <div className="rounded-xl border border-ia/20 bg-ia-muted p-5">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div
            className="flex size-9 shrink-0 items-center justify-center rounded-md bg-ia/12 text-ia-text"
            aria-hidden
          >
            <Sparkles className="size-4" />
          </div>
          <p
            className="font-serif text-base tracking-tight text-foreground"
            style={{ fontVariationSettings: '"wght" 510' }}
          >
            Sinais da semana
          </p>
        </div>
        <BadgeIA
          tamanho="sm"
          descricao="Insights gerados pela IA a partir de padrões na rede SEDU."
        />
      </div>

      <ul className="mt-5 space-y-4">
        {itens.map((insight, indice) => (
          <li
            key={insight.id ?? `insight-${indice}`}
            className="flex gap-3"
          >
            <span
              aria-hidden
              className="mt-1.5 size-1.5 shrink-0 rounded-full bg-ia"
            />
            <div className="min-w-0">
              {insight.titulo && (
                <p
                  className="font-serif text-sm tracking-tight text-foreground"
                  style={{ fontVariationSettings: '"wght" 510' }}
                >
                  {insight.titulo}
                </p>
              )}
              {insight.texto && (
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {insight.texto}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ============================================================
// Lista top escolas
// ============================================================

interface ItemEscola {
  escola: { id: string; nome: string; municipio: string };
  simuladosAplicados: number;
  totalAlunos: number;
  taxaParticipacao: number;
}

function ListaTopEscolas({ escolas }: { escolas: ItemEscola[] }) {
  if (escolas.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
        Nenhuma escola com atividade registrada.
      </div>
    );
  }

  return (
    <ol className="overflow-hidden rounded-xl border border-border bg-card">
      {escolas.map((item, indice) => (
        <li
          key={item.escola.id}
          className={cn(
            "group flex items-center gap-4 px-4 py-3",
            "transition-colors duration-200 [transition-timing-function:var(--ease-quart)]",
            "hover:bg-accent/40",
            indice > 0 && "border-t border-border",
          )}
        >
          <span className="w-5 shrink-0 text-right font-mono text-[10px] uppercase tracking-wider tabular-nums text-muted-foreground">
            {String(indice + 1).padStart(2, "0")}
          </span>

          <Avatar className="size-9 shrink-0">
            <AvatarFallback className="bg-primary-muted font-mono text-[10px] uppercase tracking-wider text-primary-text">
              {gerarIniciais(item.escola.nome)}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">
              {item.escola.nome}
            </p>
            <p className="mt-0.5 truncate font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              {item.escola.municipio}
            </p>
          </div>

          <div className="hidden w-40 shrink-0 sm:block">
            <div
              className="h-1 w-full overflow-hidden rounded-full bg-muted/60"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(item.taxaParticipacao * 100)}
              aria-label={`Taxa de participação: ${formatarPorcentagem(item.taxaParticipacao * 100)}`}
            >
              <div
                className="h-full bg-primary transition-all duration-700 [transition-timing-function:var(--ease-quart)]"
                style={{
                  width: `${Math.round(item.taxaParticipacao * 100)}%`,
                }}
              />
            </div>
            <p className="mt-1 text-right font-mono text-[9px] uppercase tracking-wider tabular-nums text-muted-foreground">
              {formatarPorcentagem(item.taxaParticipacao * 100)} participação
            </p>
          </div>

          <span className="inline-flex shrink-0 items-center rounded-md bg-muted px-2 py-1 font-mono text-[10px] uppercase tracking-wider tabular-nums text-muted-foreground">
            {item.simuladosAplicados} sim
          </span>
        </li>
      ))}
    </ol>
  );
}
