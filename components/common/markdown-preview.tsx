import * as React from "react";
import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { cn } from "@/lib/utils";

type MarkdownPreviewProps = {
  content: string;
};

function normalizeMarkdownContent(content: string) {
  return content.replace(/\r\n/g, "\n").replace(/<br\s*\/?>/gi, "\n").trim();
}

const markdownComponents: Components = {
  table: ({ className, ...props }) => (
    <div className="my-8 overflow-x-auto rounded-[26px] border border-white/10 bg-slate-950/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
      <table className={cn("min-w-full border-collapse text-left text-sm", className)} {...props} />
    </div>
  ),
  thead: ({ className, ...props }) => (
    <thead className={cn("bg-white/[0.04] text-slate-100", className)} {...props} />
  ),
  tbody: ({ className, ...props }) => <tbody className={cn("divide-y divide-white/6", className)} {...props} />,
  tr: ({ className, ...props }) => <tr className={cn("border-white/6", className)} {...props} />,
  th: ({ className, ...props }) => (
    <th className={cn("px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-300", className)} {...props} />
  ),
  td: ({ className, ...props }) => <td className={cn("px-4 py-3 align-top text-slate-200", className)} {...props} />,
  hr: ({ className, ...props }) => <hr className={cn("my-10 border-white/10", className)} {...props} />,
  blockquote: ({ className, ...props }) => (
    <blockquote
      className={cn(
        "my-8 rounded-[24px] border border-orange-500/20 bg-orange-500/[0.06] px-5 py-4 text-slate-200",
        className,
      )}
      {...props}
    />
  ),
  pre: ({ className, ...props }) => (
    <pre
      className={cn(
        "my-8 overflow-x-auto rounded-[24px] border border-white/10 bg-slate-950/90 px-4 py-4 text-[13px] leading-6 text-orange-100",
        className,
      )}
      {...props}
    />
  ),
  code: ({ className, children, ...props }) => (
    <code className={cn("font-mono text-[13px] text-orange-100", className)} {...props}>
      {children}
    </code>
  ),
};

export function MarkdownPreview({ content }: MarkdownPreviewProps) {
  const normalizedContent = React.useMemo(() => normalizeMarkdownContent(content), [content]);

  return (
    <div className="markdown-doc">
      <ReactMarkdown components={markdownComponents} remarkPlugins={[remarkGfm]}>
        {normalizedContent}
      </ReactMarkdown>
    </div>
  );
}
