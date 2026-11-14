import 'server-only';

import { cache } from 'react';

/**
 * Prova social verificável da landing.
 *
 * O único número que o site publica é o de estrelas do repositório, lido da
 * API do GitHub na mesma janela de ISR da release (30 min). Quando a API
 * falha, `null`: a `ProofBar` some com o número em vez de inventar um.
 *
 * São 2 requisições por hora no pior caso (release + repo), muito abaixo do
 * limite anônimo de 60/h; `GITHUB_TOKEN` sobe o limite para 5k/h.
 */

const REPO_API = 'https://api.github.com/repos/Hyska-Software/ZylaraAi';
const STATS_TTL = 60 * 30;

export type RepoStats = { stars: number };

type GithubRepo = { stargazers_count?: unknown };

async function fetchRepoStats(): Promise<RepoStats | null> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };

  const token = process.env.GITHUB_TOKEN?.trim();
  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    const response = await fetch(REPO_API, {
      headers,
      next: { revalidate: STATS_TTL, tags: ['github-release'] },
    });

    if (!response.ok) {
      console.warn(`[stats] GitHub respondeu ${response.status}; a prova social numérica é omitida.`);
      return null;
    }

    const payload = (await response.json()) as GithubRepo;
    const stars = payload.stargazers_count;

    if (typeof stars !== 'number' || !Number.isFinite(stars) || stars <= 0) return null;

    return { stars };
  } catch (error) {
    console.warn(`[stats] falha ao consultar o GitHub (${String(error)}); número omitido.`);
    return null;
  }
}

/** Deduplica a chamada dentro do mesmo render. */
export const getRepoStats = cache(fetchRepoStats);
