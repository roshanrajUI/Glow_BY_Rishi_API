/**
 * Tiny D1 query helpers (replaces TypeORM's repository API).
 */
export async function fetchAll<T>(
  db: D1Database,
  sql: string,
  bindings: unknown[] = [],
): Promise<T[]> {
  const result = await db
    .prepare(sql)
    .bind(...bindings)
    .all<T>();
  return result.results ?? [];
}

export async function fetchOne<T>(
  db: D1Database,
  sql: string,
  bindings: unknown[] = [],
): Promise<T | null> {
  const result = await db
    .prepare(sql)
    .bind(...bindings)
    .first<T>();
  return result ?? null;
}

export async function execute(
  db: D1Database,
  sql: string,
  bindings: unknown[] = [],
): Promise<D1Result> {
  return db
    .prepare(sql)
    .bind(...bindings)
    .run();
}

export function newId(): string {
  return crypto.randomUUID();
}

export function nowIso(): string {
  return new Date().toISOString();
}

/** Converts SQLite's 0/1 integer columns back into booleans. */
export function toBool(value: unknown): boolean {
  return value === 1 || value === true;
}

export function fromBool(value: boolean | undefined): number {
  return value ? 1 : 0;
}
