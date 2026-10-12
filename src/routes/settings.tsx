import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Settings as SettingsIcon, XCircle } from "lucide-react";
import { useState } from "react";
import { getApiBaseUrl } from "@/services/predictionApi";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";

export const Route = createFileRoute("/settings")({ component: SettingsPage });

function SettingsPage() {
  const [connection, setConnection] = useState<"idle" | "checking" | "connected" | "offline">("idle");
  const apiBaseUrl = getApiBaseUrl();

  const checkConnection = async () => {
    setConnection("checking");
    try {
      const response = await fetch(`${apiBaseUrl}/health`);
      setConnection(response.ok ? "connected" : "offline");
    } catch {
      setConnection("offline");
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="flex-1 space-y-6 p-4 sm:p-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-primary">Configuration</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">Settings</h1>
            <p className="mt-1 text-sm text-muted-foreground">Check the configured prediction service before operating the twin.</p>
          </div>
          <section className="glass max-w-2xl rounded-2xl p-6">
            <SettingsIcon className="h-5 w-5 text-primary" />
            <h2 className="mt-3 text-lg font-semibold">Prediction backend</h2>
            <label className="mt-5 block text-xs font-medium uppercase tracking-wider text-muted-foreground" htmlFor="api-base-url">API base URL</label>
            <input id="api-base-url" readOnly value={apiBaseUrl || "Same origin"} className="mt-2 w-full rounded-lg border border-border bg-secondary/40 px-3 py-2 text-sm text-foreground" />
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button type="button" onClick={checkConnection} disabled={connection === "checking"} className="rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground disabled:opacity-50">
                {connection === "checking" ? "Checking..." : "Test connection"}
              </button>
              {connection === "connected" && <span className="inline-flex items-center gap-1 text-sm text-success"><CheckCircle2 className="h-4 w-4" /> Backend healthy</span>}
              {connection === "offline" && <span className="inline-flex items-center gap-1 text-sm text-destructive"><XCircle className="h-4 w-4" /> Backend unavailable</span>}
            </div>
          </section>
          <Link to="/" className="inline-flex text-sm font-medium text-primary hover:underline">Back to dashboard</Link>
        </main>
      </div>
    </div>
  );
}