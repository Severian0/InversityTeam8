import { createSignal } from "solid-js";
import remarkMath from "remark-math"; // this needs rehype-katex
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import Highlight from "../Tools/Highlight";
import { SolidMarkdown } from "solid-markdown";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const MarkdownRenderer = (props: MarkdownRendererProps) => {
  const { content, className } = props;
  return (
    <SolidMarkdown
      class={className}
      remarkPlugins={[remarkMath]}
      rehypePlugins={[rehypeKatex as any]}
      components={{
        code(props: any) {
          const { children, className, node, ...rest } = props;
          const match = /language-(\w+)/.exec(className || "");
          let code = children()[0]().replace(/\n$/, "");
          return match ? (
            <Highlight language={match[0]} class={className}>
              {code}
            </Highlight>
          ) : (
            <code {...rest} className={className}>
              {children}
            </code>
          );
        },
      }}
    >
      {content}
    </SolidMarkdown>
  );
};

export default MarkdownRenderer;
