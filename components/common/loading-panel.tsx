import { LoaderCircle } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type LoadingPanelProps = {
  title: string;
  description: string;
};

export function LoadingPanel({ title, description }: LoadingPanelProps) {
  return (
    <Card className="orange-ring">
      <CardHeader className="items-center text-center">
        <div className="flex size-14 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-primary">
          <LoaderCircle className="size-6 animate-spin" />
        </div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mx-auto max-w-xl text-center text-sm leading-6 text-slate-300">{description}</p>
      </CardContent>
    </Card>
  );
}
