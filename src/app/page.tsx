import { MoliEmprendeWizard } from "@/components/form/MoliEmprendeWizard";

export default function Home() {
  return (
    <main className="relative h-screen overflow-hidden">
      {/* Fondo decorativo */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-radial" />
      <div
        className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-molina/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-molina-light/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative z-10 flex h-full items-center justify-center px-4 py-4 sm:px-6 lg:px-8">
        <MoliEmprendeWizard />
      </div>
    </main>
  );
}
