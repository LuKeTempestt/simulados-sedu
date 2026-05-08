"use client";

import Link from "next/link";
import {
  Accessibility,
  ArrowRight,
  Brain,
  Calculator,
  Eye,
  Heart,
  Search,
  Type,
  Users,
  Volume2,
  type LucideIcon,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  useSuporteDashboard,
  type ItemDashboardSuporte,
} from "@/hooks/api/use-suporte-dashboard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  formatarNota,
  formatarTempoRelativo,
  gerarIniciais,
  cn,
} from "@/lib/utils";
import { obterNomeAdaptacao } from "@/lib/displays";
import { useAuth } from "@/hooks/use-auth";
import type { AdaptacaoCognitiva } from "@/types";

const ICONES_ADAPTACAO: Record<AdaptacaoCognitiva, LucideIcon> = {
  tdah: Brain,
  dislexia: Type,
  discalculia: Calculator,
  autismo: Accessibility,
  deficiencia_visual: Eye,
  deficiencia_auditiva: Volume2,
};

export default function PaginaDashboardSuporte() {
  const { usuario } = useAuth();
  const { data, isLoading, isError, refetch } = useSuporteDashboard();
  const [busca, setBusca] = useState("");
  const [filtroAtividade, setFiltroAtividade] = useState<
    "todos" | "respondendo"
  >("todos");

  const lista = useMemo(() => {
    if (!data?.dados) return [];
    let resultado = data.dados;
    if (filtroAtividade === "respondendo") {
      resultado = resultado.filter((i) => i.emAndamento !== null);
    }
    if (busca.trim().length > 0) {
      const b = busca.toLowerCase();
      resultado = resultado.filter(
        (i) =>
          i.aluno.nome.toLowerCase().includes(b) ||
          i.turmaNome.toLowerCase().includes(b),
      );
    }
    return resultado;
  }, [data, busca, filtroAtividade]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-6 md:py-10">
      <header className="flex flex-col gap-1">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          {usuario?.nome.split(" ")[0]} · Suporte pedagógico
        </p>
        <h1
          className="font-serif text-3xl tracking-tight md:text-4xl"
          style={{ fontVariationSettings: '"wght" 510' }}
        >
          Meus alunos
        </h1>
        <p className="mt-2 max-w-2xl text-base text-muted-foreground">
          Estudantes com adaptações cognitivas sob seu acompanhamento.
          Indicador <span className="text-success">verde</span> = respondendo
          simulado agora.
        </p>
      </header>

      {/* contagem */}
      {data && (
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <CardContagem
            icone={Users}
            rotulo="Total"
            valor={data.contagem.total}
            cor="primary"
          />
          <CardContagem
            icone={Heart}
            rotulo="Respondendo agora"
            valor={data.contagem.respondendoAgora}
            cor="success"
            destacado={data.contagem.respondendoAgora > 0}
          />
        </div>
      )}

      {/* filtros */}
      <div className="mt-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar aluno ou turma…"
            className="pl-9"
            aria-label="Buscar"
          />
        </div>
        <div className="inline-flex rounded-lg border border-border bg-card p-1">
          <button
            type="button"
            onClick={() => setFiltroAtividade("todos")}
            className={cn(
              "rounded-md px-3 py-1.5 font-mono text-[11px] font-medium uppercase tracking-wider transition-colors",
              filtroAtividade === "todos"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            Todos
          </button>
          <button
            type="button"
            onClick={() => setFiltroAtividade("respondendo")}
            className={cn(
              "rounded-md px-3 py-1.5 font-mono text-[11px] font-medium uppercase tracking-wider transition-colors",
              filtroAtividade === "respondendo"
                ? "bg-success text-success-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            Respondendo agora
          </button>
        </div>
      </div>

      {/* lista de cards */}
      <section className="mt-8" aria-label="Lista de alunos">
        {isLoading ? (
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }, (_, i) => (
              <Skeleton key={i} className="h-44 w-full rounded-xl" />
            ))}
          </div>
        ) : isError ? (
          <div className="rounded-xl border border-destructive/30 bg-destructive-muted p-6 text-center text-destructive">
            <p className="font-mono text-[10px] uppercase tracking-wider">
              Erro ao carregar
            </p>
            <Button
              variant="outline"
              className="mt-3"
              onClick={() => refetch()}
            >
              Tentar de novo
            </Button>
          </div>
        ) : lista.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center">
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Nenhum aluno encontrado
            </p>
            <p
              className="mt-3 font-serif text-lg tracking-tight"
              style={{ fontVariationSettings: '"wght" 510' }}
            >
              Ajuste a busca ou os filtros pra ver alunos.
            </p>
          </div>
        ) : (
          <ul className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {lista.map((item) => (
              <li key={item.aluno.id}>
                <CardAluno item={item} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function CardContagem({
  icone: Icone,
  rotulo,
  valor,
  cor,
  destacado = false,
}: {
  icone: LucideIcon;
  rotulo: string;
  valor: number;
  cor: "primary" | "success";
  destacado?: boolean;
}) {
  const classes = {
    primary: "bg-primary-muted border-primary/20 text-primary-text",
    success: "bg-success-muted border-success/30 text-success",
  }[cor];

  return (
    <div
      className={cn(
        "inline-flex items-center gap-3 rounded-lg border px-4 py-3",
        classes,
        destacado && "motion-pulse-ambient",
      )}
    >
      <Icone className="size-4 shrink-0" aria-hidden />
      <div className="flex items-baseline gap-2">
        <span className="font-serif text-2xl font-medium tabular-nums">
          {valor}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-wider opacity-80">
          {rotulo}
        </span>
      </div>
    </div>
  );
}

function CardAluno({ item }: { item: ItemDashboardSuporte }) {
  const { aluno, turmaNome, ultimoResultado, emAndamento } = item;
  const respondendo = emAndamento !== null;

  return (
    <Link
      href={`/suporte/aluno/${aluno.id}`}
      className={cn(
        "group flex h-full flex-col rounded-xl border bg-card p-5 transition-all duration-200",
        "[transition-timing-function:var(--ease-quart)]",
        "hover:-translate-y-0.5 hover:border-primary/30",
        respondendo
          ? "border-success/40 ring-1 ring-success/20"
          : "border-border",
      )}
      data-respondendo={respondendo}
    >
      {/* topo: avatar + nome + status */}
      <div className="flex items-start gap-3">
        <Avatar className="size-12 shrink-0">
          <AvatarImage src={aluno.fotoUrl} alt={aluno.nome} />
          <AvatarFallback className="bg-primary-muted font-mono text-xs uppercase text-primary-text">
            {gerarIniciais(aluno.nome)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-medium text-foreground">
            {aluno.nome}
          </p>
          <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            {turmaNome}
          </p>
        </div>
        {respondendo && (
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-success-muted px-2 py-1 text-[10px] font-medium text-success">
            <span className="size-1.5 rounded-full bg-success motion-pulse-ambient" aria-hidden />
            ao vivo
          </span>
        )}
      </div>

      {/* adaptações */}
      <div className="mt-4 flex flex-wrap gap-1.5">
        {(aluno.adaptacoes ?? []).map((a) => {
          const Icone = ICONES_ADAPTACAO[a];
          return (
            <span
              key={a}
              className="inline-flex items-center gap-1 rounded-full bg-warning-muted px-2.5 py-1 text-[10px] font-medium text-warning"
              title={obterNomeAdaptacao(a)}
            >
              <Icone className="size-3" aria-hidden />
              {obterNomeAdaptacao(a)}
            </span>
          );
        })}
      </div>

      {/* última atividade */}
      <div className="mt-auto pt-4">
        {respondendo ? (
          <div className="flex items-center justify-between border-t border-border pt-3">
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Em andamento
            </span>
            <span className="inline-flex items-center gap-1 text-sm font-medium text-success">
              Acompanhar
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </span>
          </div>
        ) : ultimoResultado ? (
          <div className="flex items-center justify-between border-t border-border pt-3">
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Último simulado · {formatarTempoRelativo(ultimoResultado.finalizadoEm)}
            </span>
            <span
              className={cn(
                "rounded-md px-2 py-0.5 font-mono text-xs font-bold tabular-nums",
                ultimoResultado.notaFinal >= 7
                  ? "bg-success-muted text-success"
                  : ultimoResultado.notaFinal >= 5
                    ? "bg-warning-muted text-warning"
                    : "bg-destructive-muted text-destructive",
              )}
            >
              {formatarNota(ultimoResultado.notaFinal)}
            </span>
          </div>
        ) : (
          <p className="border-t border-border pt-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            Sem simulado finalizado ainda
          </p>
        )}
      </div>
    </Link>
  );
}
