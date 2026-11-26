import fs from "node:fs";
import path from "node:path";
import { PGlite } from "@electric-sql/pglite";
import { Pool, type PoolClient } from "pg";

export interface QueryResultRow {
  [key: string]: unknown;
}

export interface DbClient {
  query<T extends object = QueryResultRow>(
    sql: string,
    params?: unknown[]
  ): Promise<{ rows: T[]; rowCount: number }>;
}

const globalForDb = globalThis as unknown as {
  __aurumPgPool?: Pool;
  __aurumPglite?: PGlite;
  __aurumDbInitPromise?: Promise<void>;
};

function getDatabaseUrl(): string {
  return process.env.DATABASE_URL?.trim() || "pglite://./data/aurum-pgdata";
}

export function isPostgresPoolMode(): boolean {
  const url = getDatabaseUrl();
  return url.startsWith("postgres://") || url.startsWith("postgresql://");
}

function getPool(): Pool {
  if (!globalForDb.__aurumPgPool) {
    globalForDb.__aurumPgPool = new Pool({
      connectionString: getDatabaseUrl(),
      max: 15,
    });
  }
  return globalForDb.__aurumPgPool;
}

async function getPglite(): Promise<PGlite> {
  if (!globalForDb.__aurumPglite) {
    const url = getDatabaseUrl();
    if (url === "pglite://memory" || process.env.VITEST === "true") {
      globalForDb.__aurumPglite = new PGlite();
    } else {
      const dir = url.replace(/^pglite:\/\//, "") || "./data/aurum-pgdata";
      const resolved = path.isAbsolute(dir) ? dir : path.resolve(process.cwd(), dir);
      fs.mkdirSync(resolved, { recursive: true });
      globalForDb.__aurumPglite = new PGlite(resolved);
    }
    await globalForDb.__aurumPglite.waitReady;
  }
  return globalForDb.__aurumPglite;
}

export async function runMigrations(client?: DbClient): Promise<void> {
  const migrationsDir = path.resolve(process.cwd(), "db", "migrations");
  if (!fs.existsSync(migrationsDir)) return;
  const files = fs
    .readdirSync(migrationsDir)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  const execSql = async (sql: string) => {
    if (client) {
      await client.query(sql);
    } else if (isPostgresPoolMode()) {
      await getPool().query(sql);
    } else {
      const pg = await getPglite();
      await pg.exec(sql);
    }
  };

  await execSql(`
    CREATE TABLE IF NOT EXISTS _aurum_migrations (
      id SERIAL PRIMARY KEY,
      filename TEXT NOT NULL UNIQUE,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  for (const file of files) {
    const already = client
      ? await client.query<{ filename: string }>(
          "SELECT filename FROM _aurum_migrations WHERE filename = $1",
          [file]
        )
      : await rawQuery<{ filename: string }>(
          "SELECT filename FROM _aurum_migrations WHERE filename = $1",
          [file]
        );
    if (already.rows.length > 0) continue;

    const sql = fs.readFileSync(path.join(migrationsDir, file), "utf-8");
    await execSql(sql);
    if (client) {
      await client.query("INSERT INTO _aurum_migrations (filename) VALUES ($1)", [file]);
    } else {
      await rawQuery("INSERT INTO _aurum_migrations (filename) VALUES ($1)", [file]);
    }
  }
}

export async function rawQuery<T extends object = QueryResultRow>(
  sql: string,
  params: unknown[] = []
): Promise<{ rows: T[]; rowCount: number }> {
  if (isPostgresPoolMode()) {
    const res = await getPool().query<T>(sql, params);
    return { rows: res.rows, rowCount: res.rowCount ?? res.rows.length };
  }
  const pg = await getPglite();
  const res = await pg.query<T>(sql, params);
  return { rows: res.rows, rowCount: res.affectedRows ?? res.rows.length };
}

export async function rawQueryOne<T extends object = QueryResultRow>(
  sql: string,
  params: unknown[] = []
): Promise<T | null> {
  const res = await rawQuery<T>(sql, params);
  return res.rows[0] ?? null;
}

export async function ensureDbReady(): Promise<void> {
  if (!globalForDb.__aurumDbInitPromise) {
    globalForDb.__aurumDbInitPromise = (async () => {
      await runMigrations();
      // Auto-seed default settings & baseline records if site_settings is empty
      const countRes = await rawQuery<{ cnt: string }>("SELECT COUNT(*)::text AS cnt FROM site_settings");
      const count = Number(countRes.rows[0]?.cnt ?? "0");
      if (count === 0) {
        const { seedDatabase } = await import("./seed-data");
        await seedDatabase();
      }
    })();
  }
  await globalForDb.__aurumDbInitPromise;
}

export async function query<T extends object = QueryResultRow>(
  sql: string,
  params: unknown[] = []
): Promise<{ rows: T[]; rowCount: number }> {
  await ensureDbReady();
  return rawQuery<T>(sql, params);
}

export async function queryOne<T extends object = QueryResultRow>(
  sql: string,
  params: unknown[] = []
): Promise<T | null> {
  const res = await query<T>(sql, params);
  return res.rows[0] ?? null;
}

export async function withTransaction<R>(fn: (tx: DbClient) => Promise<R>): Promise<R> {
  await ensureDbReady();
  if (isPostgresPoolMode()) {
    const client: PoolClient = await getPool().connect();
    try {
      await client.query("BEGIN");
      const wrapped: DbClient = {
        async query<T extends object = QueryResultRow>(sql: string, params: unknown[] = []) {
          const res = await client.query<T>(sql, params);
          return { rows: res.rows, rowCount: res.rowCount ?? res.rows.length };
        },
      };
      const out = await fn(wrapped);
      await client.query("COMMIT");
      return out;
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }

  const pg = await getPglite();
  return pg.transaction(async (tx) => {
    const wrapped: DbClient = {
      async query<T extends object = QueryResultRow>(sql: string, params: unknown[] = []) {
        const res = await tx.query<T>(sql, params);
        return { rows: res.rows, rowCount: res.affectedRows ?? res.rows.length };
      },
    };
    return fn(wrapped);
  });
}

export async function resetDbForTests(): Promise<void> {
  globalForDb.__aurumDbInitPromise = undefined;
  if (globalForDb.__aurumPglite) {
    await globalForDb.__aurumPglite.close();
    globalForDb.__aurumPglite = undefined;
  }
}
