import { createFileRoute, Link } from "@tanstack/react-router";
import { Download, FileText, Printer } from "lucide-react";
import { useSimulation } from "@/simulation/hooks";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";

export const Route = createFileRoute("/reports")({ component: ReportsPage });

function ReportsPage() {
  const sim = useSimulation();
  const generatedAt = new Date().toLocaleString("en-IN");

  const downloadReport = () => {
    const report = [
      "Yatra AI Operations Report",
      `Generated: ${generatedAt}`,
      `Scenario: ${sim.scenario}`,
      `Active agents: ${sim.activeAgents}`,
      `Congestion: ${sim.congestionLabel} (${sim.congestionIndex}/100)`,
      `Waiting time: ${sim.waitingSeconds} seconds`,
    ].join("\n");
    const url = URL.createObjectURL(new Blob([report], { type: "text/plain" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `yatra-report-${new Date().toISOString().slice(0, 10)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="flex-1 space-y-6 p-4 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-primary">Operations</p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight">Reports</h1>
              <p className="mt-1 text-sm text-muted-foreground">Export the current digital-twin operating state.</p>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm hover:bg-secondary">
                <Printer className="h-4 w-4" /> Print
              </button>
              <button type="button" onClick={downloadReport} className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground hover:bg-primary/90">
                <Download className="h-4 w-4" /> Download report
              </button>
            </div>
          </div>
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Scenario", sim.scenario],
              ["Active agents", sim.activeAgents.toLocaleString()],
              ["Congestion", `${sim.congestionIndex}/100`],
              ["Wait time", `${sim.waitingSeconds}s`],
            ].map(([label, value]) => (
              <div key={label} className="glass rounded-2xl p-5">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="mt-2 text-xl font-semibold">{value}</p>
              </div>
            ))}
          </section>
          <section className="glass rounded-2xl p-6">
            <FileText className="h-5 w-5 text-primary" />
            <h2 className="mt-3 text-lg font-semibold">Current operations snapshot</h2>
            <p className="mt-1 text-sm text-muted-foreground">Generated {generatedAt}. Return to the dashboard for live controls.</p>
            <Link to="/" className="mt-4 inline-flex text-sm font-medium text-primary hover:underline">Back to dashboard</Link>
          </section>
        </main>
      </div>
    </div>
  );
}