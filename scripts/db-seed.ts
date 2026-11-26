import { runMigrations } from "../src/lib/db";
import { seedDatabase } from "../src/lib/seed-data";

async function main() {
  console.log("Ensuring schema migrations...");
  await runMigrations();
  console.log("Seeding Aurum EV database...");
  await seedDatabase();
  console.log("Seed completed successfully.");
  process.exit(0);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
