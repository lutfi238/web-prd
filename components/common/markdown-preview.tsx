import ReactMarkdown from "react-markdown";

type MarkdownPreviewProps = {
  content: string;
};

export function MarkdownPreview({ content }: MarkdownPreviewProps) {
  return (
    <div className="prose prose-invert max-w-none prose-headings:scroll-m-20 prose-headings:font-semibold prose-headings:text-white prose-h2:mt-10 prose-h2:text-2xl prose-h3:mt-8 prose-h3:text-xl prose-p:leading-7 prose-p:text-slate-300 prose-strong:text-white prose-li:text-slate-300 prose-code:rounded prose-code:bg-white/5 prose-code:px-1 prose-code:py-0.5 prose-code:text-orange-200 prose-pre:border prose-pre:border-white/10 prose-pre:bg-slate-950/80">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
