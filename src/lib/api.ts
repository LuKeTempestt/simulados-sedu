import axios, { AxiosError, type AxiosRequestConfig } from "axios";
import type { ErroApi } from "@/types";

export const URL_API_BASE = "/api";
export const CHAVE_TOKEN = "simulados_token";

const cliente = axios.create({
  baseURL: URL_API_BASE,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

function obterTokenLocal(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(CHAVE_TOKEN);
  } catch {
    return null;
  }
}

function limparTokenLocal(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(CHAVE_TOKEN);
  } catch {
    // Ignorar — pode estar bloqueado em modo privado.
  }
}

function disparar401(): void {
  if (typeof window === "undefined") return;
  // Permite que stores reagendem o logout sem acoplar diretamente.
  window.dispatchEvent(new CustomEvent("simulados:nao-autenticado"));
}

cliente.interceptors.request.use((config) => {
  const token = obterTokenLocal();
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

function normalizarErro(erro: unknown): ErroApi {
  if (axios.isAxiosError(erro)) {
    const axiosErr = erro as AxiosError<unknown>;
    const data = axiosErr.response?.data;

    if (
      data !== null &&
      typeof data === "object" &&
      "codigo" in data &&
      "mensagem" in data
    ) {
      const candidato = data as Partial<ErroApi>;
      if (
        typeof candidato.codigo === "string" &&
        typeof candidato.mensagem === "string"
      ) {
        return {
          codigo: candidato.codigo,
          mensagem: candidato.mensagem,
          detalhes: candidato.detalhes,
        };
      }
    }

    if (axiosErr.code === "ERR_NETWORK") {
      return {
        codigo: "ERRO_REDE",
        mensagem: "Sem conexão com o servidor. Verifique sua internet.",
      };
    }

    if (axiosErr.code === "ECONNABORTED") {
      return {
        codigo: "ERRO_TIMEOUT",
        mensagem: "A requisição demorou demais. Tente novamente.",
      };
    }

    const status = axiosErr.response?.status;
    if (status === 401) {
      return {
        codigo: "NAO_AUTENTICADO",
        mensagem: "Sessão expirada. Faça login novamente.",
      };
    }
    if (status === 403) {
      return {
        codigo: "SEM_PERMISSAO",
        mensagem: "Você não tem permissão para acessar este recurso.",
      };
    }
    if (typeof status === "number" && status >= 500) {
      return {
        codigo: "ERRO_SERVIDOR",
        mensagem: "Erro no servidor. Tente novamente em alguns instantes.",
      };
    }

    return {
      codigo: "ERRO_DESCONHECIDO",
      mensagem: axiosErr.message || "Erro inesperado na requisição.",
    };
  }

  if (erro instanceof Error) {
    return { codigo: "ERRO_DESCONHECIDO", mensagem: erro.message };
  }

  return { codigo: "ERRO_DESCONHECIDO", mensagem: "Erro inesperado." };
}

cliente.interceptors.response.use(
  (resposta) => resposta,
  (erro: unknown) => {
    const normalizado = normalizarErro(erro);
    if (normalizado.codigo === "NAO_AUTENTICADO") {
      limparTokenLocal();
      disparar401();
    }
    return Promise.reject(normalizado);
  },
);

export const api = cliente;

export async function obter<T>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<T> {
  const resposta = await cliente.get<T>(url, config);
  return resposta.data;
}

export async function criar<T>(
  url: string,
  body?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> {
  const resposta = await cliente.post<T>(url, body, config);
  return resposta.data;
}

export async function atualizar<T>(
  url: string,
  body?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> {
  const resposta = await cliente.patch<T>(url, body, config);
  return resposta.data;
}

export async function remover<T>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<T> {
  const resposta = await cliente.delete<T>(url, config);
  return resposta.data;
}
