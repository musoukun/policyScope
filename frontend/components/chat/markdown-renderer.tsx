"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { FC, memo } from "react";
import { cn } from "@/lib/utils";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const MarkdownRendererImpl: FC<MarkdownRendererProps> = ({ content, className }) => {
  return (
    <div className={cn("prose prose-gray max-w-none dark:prose-invert", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
        h1: ({ className, ...props }) => (
          <h1 className={cn("mb-4 text-2xl font-bold", className)} {...props} />
        ),
        h2: ({ className, ...props }) => (
          <h2 className={cn("mb-3 mt-6 text-xl font-semibold", className)} {...props} />
        ),
        h3: ({ className, ...props }) => (
          <h3 className={cn("mb-2 mt-4 text-lg font-semibold", className)} {...props} />
        ),
        p: ({ className, ...props }) => (
          <p className={cn("mb-4 leading-7", className)} {...props} />
        ),
        a: ({ className, ...props }) => (
          <a className={cn("text-blue-600 hover:underline", className)} {...props} />
        ),
        ul: ({ className, ...props }) => (
          <ul className={cn("mb-4 ml-6 list-disc", className)} {...props} />
        ),
        ol: ({ className, ...props }) => (
          <ol className={cn("mb-4 ml-6 list-decimal", className)} {...props} />
        ),
        li: ({ className, ...props }) => (
          <li className={cn("mb-1", className)} {...props} />
        ),
        blockquote: ({ className, ...props }) => (
          <blockquote className={cn("border-l-4 border-gray-300 pl-4 italic", className)} {...props} />
        ),
        code: ({ className, inline, ...props }) => (
          <code
            className={cn(
              inline
                ? "rounded bg-gray-100 px-1 py-0.5 font-mono text-sm dark:bg-gray-800"
                : "block rounded-lg bg-gray-100 p-4 font-mono text-sm dark:bg-gray-800",
              className
            )}
            {...props}
          />
        ),
        pre: ({ className, ...props }) => (
          <pre className={cn("mb-4 overflow-x-auto rounded-lg bg-gray-100 p-4 dark:bg-gray-800", className)} {...props} />
        ),
        table: ({ className, ...props }) => (
          <table className={cn("mb-4 w-full border-collapse", className)} {...props} />
        ),
        th: ({ className, ...props }) => (
          <th className={cn("border border-gray-300 bg-gray-50 px-4 py-2 text-left font-semibold dark:bg-gray-800", className)} {...props} />
        ),
        td: ({ className, ...props }) => (
          <td className={cn("border border-gray-300 px-4 py-2", className)} {...props} />
        ),
        hr: ({ className, ...props }) => (
          <hr className={cn("my-4 border-t border-gray-300", className)} {...props} />
        ),
      }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export const MarkdownRenderer = memo(MarkdownRendererImpl);