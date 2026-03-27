import { CircleHelp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type EmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({ title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <Card>
      <CardHeader className="items-center text-center">
        <div className="flex size-14 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300">
          <CircleHelp className="size-6" />
        </div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4 text-center">
        <p className="max-w-lg text-sm leading-6 text-slate-300">{description}</p>
        {actionLabel && onAction ? (
          <Button variant="outline" onClick={onAction}>
            {actionLabel}
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}
