import { runMigrations } from "../src/lib/db";

async function main() {
  console.log("Running Aurum EV PostgreSQL migrations...");
  await runMigrations();
  console.log("Migrations applied successfully.");
  process.exit(0);
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
