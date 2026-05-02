import { getCloudflareContext } from "@opennextjs/cloudflare";

type D1Result<T> = {
  results?: T[];
};

type D1PreparedStatementLike = {
  bind: (...values: unknown[]) => D1PreparedStatementLike;
  all: <T = unknown>() => Promise<D1Result<T>>;
  first: <T = unknown>() => Promise<T | null>;
  run: () => Promise<unknown>;
};

export type StudyDatabase = {
  prepare: (query: string) => D1PreparedStatementLike;
};

export function getStudyDatabase() {
  try {
    const { env } = getCloudflareContext();
    return (env as { STUDY_DB?: StudyDatabase }).STUDY_DB ?? null;
  } catch {
    return null;
  }
}
