import fs from "node:fs";
import path from "node:path";
import { resetDbForTests, runMigrations } from "../src/lib/db";
import { seedDatabase } from "../src/lib/seed-data";

async function main() {
  await resetDbForTests();
  const dataDir = path.resolve(process.cwd(), "data", "aurum-pgdata");
  if (fs.existsSync(dataDir)) {
    fs.rmSync(dataDir, { recursive: true, force: true });
  }
  await runMigrations();
  await seedDatabase();
  console.log("Database reset and re-seeded successfully.");
  process.exit(0);
}

main().catch((err) => {
  console.error("Database reset failed:", err);
  process.exit(1);
});
