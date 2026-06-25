import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function Markdown({ content }: { content: string }) {
  return (
    <div className="space-y-2.5 text-[14px] leading-6 text-[#3D3530]">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node, ...props }) => <p className="font-semibold text-[#2F2925] text-[16px] mt-2 mb-1" {...props} />,
          h2: ({ node, ...props }) => <p className="font-semibold text-[#2F2925] text-[15px] mt-2 mb-1" {...props} />,
          h3: ({ node, ...props }) => <p className="font-semibold text-[#2F2925] text-[14px] mt-2 mb-1" {...props} />,
          h4: ({ node, ...props }) => <p className="font-semibold text-[#2F2925] text-[14px] mt-2 mb-1" {...props} />,
          p: ({ node, ...props }) => <p className="whitespace-pre-wrap break-words [text-align:justify]" {...props} />,
          ul: ({ node, ...props }) => <ul className="space-y-1.5 list-disc marker:text-[#B69B86] pl-5" {...props} />,
          ol: ({ node, ...props }) => <ol className="space-y-1.5 list-decimal marker:text-[#6B5B52] marker:font-semibold pl-5" {...props} />,
          li: ({ node, children, ...props }) => (
            <li className="pl-1 [text-align:justify]" {...props}>
              {children}
            </li>
          ),
          strong: ({ node, ...props }) => <strong className="font-semibold text-[#2F2925]" {...props} />,
          em: ({ node, ...props }) => <em className="italic" {...props} />,
          code: ({ node, className, children, ...props }: any) => {
            const isInline = !className;
            return isInline ? (
              <code className="rounded bg-[#F0EAE2] px-1.5 py-0.5 font-mono text-[12px] text-[#5A4A42]" {...props}>
                {children}
              </code>
            ) : (
              <pre className="rounded-lg bg-[#F0EAE2] p-3 my-2 overflow-x-auto text-[12px] font-mono text-[#5A4A42]">
                <code className={className} {...props}>
                  {children}
                </code>
              </pre>
            );
          },
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="space-y-1 border-l-[3px] border-[#D9C8BA] bg-[#FBF8F4] py-1.5 pl-3 pr-2 my-2 text-[13px] italic text-[#6B5B52] [text-align:justify]"
              {...props}
            />
          ),
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto rounded-xl border border-[#E8E2D9] my-3">
              <table className="w-full border-collapse text-[12.5px]" {...props} />
            </div>
          ),
          thead: ({ node, ...props }) => <thead className="bg-[#F5F0EA]" {...props} />,
          th: ({ node, ...props }) => (
            <th className="border-b border-[#E8E2D9] px-3 py-2 text-left font-semibold text-[#3D3530]" {...props} />
          ),
          td: ({ node, ...props }) => (
            <td className="border-b border-[#EFEAE3] px-3 py-2 align-top text-[#4A423C]" {...props} />
          ),
          tr: ({ node, ...props }) => <tr className="even:bg-[#FCFBF9] odd:bg-white" {...props} />,
          a: ({ node, ...props }) => (
            <a className="text-[#B69B86] hover:underline" target="_blank" rel="noopener noreferrer" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
