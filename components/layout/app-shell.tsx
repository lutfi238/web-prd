import { Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";

type AppShellProps = {
  children: React.ReactNode;
  action?: React.ReactNode;
};

export function AppShell({ children, action }: AppShellProps) {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-5 sm:px-6 lg:px-8">
        <header className="mb-6 flex items-center justify-between gap-4 rounded-[28px] border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-md sm:px-5">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/15 text-primary">
              <Sparkles className="size-5" />
            </div>
            <div>
              <div className="text-sm font-semibold tracking-wide text-white">PRD Generator Personal</div>
              <div className="text-xs text-slate-400">Wizard AI untuk bikin PRD profesional dalam bahasa Indonesia</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="hidden sm:inline-flex">
              Next.js 15 + Multi Provider AI
            </Badge>
            {action}
          </div>
        </header>
        <div className="flex-1">{children}</div>
      </div>
    </main>
  );
}
