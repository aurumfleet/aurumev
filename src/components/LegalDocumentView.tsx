import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export function LegalDocumentView({
  eyebrow,
  title,
  sections,
}: {
  eyebrow: string;
  title: string;
  sections: Array<{ heading: string; body: string }>;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-[#F7F8FA]">
      <Navbar />
      <main className="flex-1 py-16">
        <div className="aurum-container max-w-4xl">
          <div className="rounded-2xl border border-[#101D35]/10 bg-white p-8 shadow-card sm:p-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#C69A43]">
              {eyebrow}
            </p>
            <h1 className="mt-2 font-display text-3xl font-bold text-[#101D35]">{title}</h1>
            <p className="mt-2 text-xs text-[#747D8B]">
              Issued by Aurum Fleet Solutions Pvt Ltd (AURUM EV)
            </p>
            <div className="mt-8 space-y-6">
              {sections.map((s) => (
                <section key={s.heading}>
                  <h2 className="font-display text-lg font-bold text-[#101D35]">{s.heading}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-[#20252E]">{s.body}</p>
                </section>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
