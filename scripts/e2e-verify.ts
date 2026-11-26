import { spawn } from "node:child_process";

const PORT = 3199;
const BASE = `http://127.0.0.1:${PORT}`;

async function waitForServer(timeoutMs = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(`${BASE}/api/health`);
      if (res.ok) return;
    } catch {
      // retry
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error("Server failed to start within timeout");
}

async function run() {
  console.log(`Starting Next.js production server on ${BASE}...`);
  const nextBin = process.platform === "win32" ? "npx.cmd" : "npx";
  const proc = spawn(nextBin, ["next", "start", "-p", String(PORT)], {
    stdio: "pipe",
    shell: true,
    env: { ...process.env, PORT: String(PORT) },
  });

  try {
    await waitForServer();
    console.log("Server is healthy. Running live route & form checks...");

    for (const route of [
      "/",
      "/rentals",
      "/riders",
      "/business",
      "/invest",
      "/fleet",
      "/locations",
      "/how-it-works",
      "/about",
      "/contact",
      "/faq",
      "/blog",
      "/blog/why-indian-delivery-fleets-are-going-electric",
      "/privacy-policy",
      "/terms-and-conditions",
      "/refund-policy",
      "/rental-policy",
      "/cancellation-policy",
      "/investor-disclosures",
      "/sitemap.xml",
      "/robots.txt",
    ]) {
      const r = await fetch(`${BASE}${route}`);
      if (!r.ok) throw new Error(`Public route ${route} returned ${r.status}`);
    }
    console.log("✓ All 20 public routes + SEO endpoints returned 200 OK.");

    // Ensure removed admin/login routes return 404
    for (const removed of ["/admin", "/login", "/register", "/dashboard"]) {
      const r = await fetch(`${BASE}${removed}`);
      if (r.status !== 404) throw new Error(`Expected 404 for removed route ${removed}, got ${r.status}`);
    }
    console.log("✓ Removed admin/login/portal routes return 404.");

    const leadRes = await fetch(`${BASE}/api/leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: "E2E Verification Lead",
        phone: "+919876543210",
        email: "e2e-lead@example.com",
        city: "Bengaluru",
        leadCategory: "rental",
        source: "website",
        requirement: "E2E automated check rental inquiry",
      }),
    });
    if (leadRes.status !== 201) throw new Error(`Lead submission failed: ${leadRes.status}`);
    console.log("✓ Public Lead submission succeeded (201).");

    console.log("ALL E2E VERIFICATION CHECKS PASSED!");
  } finally {
    if (process.platform === "win32" && proc.pid) {
      spawn("taskkill", ["/pid", String(proc.pid), "/f", "/t"], { stdio: "ignore" });
    } else {
      proc.kill("SIGTERM");
    }
  }
}

run().catch((err) => {
  console.error("E2E verification failed:", err);
  process.exit(1);
});
