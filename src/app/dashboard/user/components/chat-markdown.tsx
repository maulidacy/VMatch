import { Fragment, type ReactNode } from "react";

/**
 * Renderer Markdown ringan & aman (tanpa dependency / dangerouslySetInnerHTML).
 * Mendukung: heading (#, ##, ###), **bold**, *italic*, `code`, [link](url),
 * list bernomor, bullet list, blockquote (>), tabel, dan paragraf.
 * Karakter markdown yang tidak berpasangan (mis. ** menggantung) dibersihkan
 * agar tidak tampil mentah di UI.
 */

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  // Urutan token: ***bi***, **bold**, `code`, *italic*, _italic_, [text](url)
  const regex =
    /(\*\*\*([^*]+)\*\*\*|\*\*([^*]+)\*\*|`([^`]+)`|\*([^*\s][^*]*?)\*|_([^_]+)_|\[([^\]]+)\]\(([^)\s]+)\))/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let i = 0;

  const pushText = (raw: string) => {
    if (!raw) return;
    // Bersihkan sisa penanda yang tidak berpasangan supaya tidak tampil mentah.
    const cleaned = raw
      .replace(/\*\*/g, "") // ** menggantung
      .replace(/(^|\s)\*(?=\s|$)/g, "$1") // bintang tunggal nyasar
      .replace(/^\s*>\s?/gm, ""); // sisa penanda blockquote
    if (cleaned) {
      nodes.push(<Fragment key={`${keyPrefix}-t-${i}`}>{cleaned}</Fragment>);
    }
  };

  while ((match = regex.exec(text)) !== null) {
    pushText(text.slice(lastIndex, match.index));

    if (match[2] !== undefined) {
      nodes.push(
        <strong key={`${keyPrefix}-bi-${i}`} className="font-semibold text-[#2F2925]">
          <em>{match[2]}</em>
        </strong>,
      );
    } else if (match[3] !== undefined) {
      nodes.push(
        <strong key={`${keyPrefix}-b-${i}`} className="font-semibold text-[#2F2925]">
          {match[3]}
        </strong>,
      );
    } else if (match[4] !== undefined) {
      nodes.push(
        <code
          key={`${keyPrefix}-c-${i}`}
          className="rounded bg-[#F0EAE2] px-1.5 py-0.5 font-mono text-[12px] text-[#5A4A42]"
        >
          {match[4]}
        </code>,
      );
    } else if (match[5] !== undefined || match[6] !== undefined) {
      nodes.push(
        <em key={`${keyPrefix}-i-${i}`} className="italic">
          {match[5] ?? match[6]}
        </em>,
      );
    } else if (match[7] !== undefined && match[8] !== undefined) {
      nodes.push(
        <a
          key={`${keyPrefix}-a-${i}`}
          href={match[8]}
          target="_blank"
          rel="noreferrer"
          className="font-medium text-[#6B5B52] underline underline-offset-2 hover:text-[#5A4A42]"
        >
          {match[7]}
        </a>,
      );
    }

    lastIndex = regex.lastIndex;
    i += 1;
  }

  pushText(text.slice(lastIndex));

  return nodes;
}

type Block =
  | { type: "heading"; level: number; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "quote"; lines: string[] }
  | { type: "table"; header: string[]; rows: string[][] }
  | { type: "p"; text: string };

function splitTableRow(line: string): string[] {
  let s = line.trim();
  if (s.startsWith("|")) s = s.slice(1);
  if (s.endsWith("|")) s = s.slice(0, -1);
  return s.split("|").map((cell) => cell.trim());
}

function isTableSeparator(line: string | undefined): boolean {
  if (!line) return false;
  const s = line.trim();
  return s.includes("|") && s.includes("-") && /^[\s|:-]+$/.test(s);
}

function parseBlocks(markdown: string): Block[] {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];

  let paragraph: string[] = [];
  let ul: string[] = [];
  let ol: string[] = [];

  const flushParagraph = () => {
    if (paragraph.length) {
      blocks.push({ type: "p", text: paragraph.join("\n") });
      paragraph = [];
    }
  };
  const flushUl = () => {
    if (ul.length) {
      blocks.push({ type: "ul", items: ul });
      ul = [];
    }
  };
  const flushOl = () => {
    if (ol.length) {
      blocks.push({ type: "ol", items: ol });
      ol = [];
    }
  };
  const flushAll = () => {
    flushParagraph();
    flushUl();
    flushOl();
  };

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      flushAll();
      i += 1;
      continue;
    }

    // Tabel: baris dengan "|" diikuti baris pemisah "---".
    if (trimmed.includes("|") && isTableSeparator(lines[i + 1])) {
      flushAll();
      const header = splitTableRow(trimmed);
      i += 2;
      const rows: string[][] = [];
      while (i < lines.length && lines[i].trim() && lines[i].includes("|")) {
        rows.push(splitTableRow(lines[i].trim()));
        i += 1;
      }
      blocks.push({ type: "table", header, rows });
      continue;
    }

    // Blockquote.
    if (/^>\s?/.test(trimmed)) {
      flushAll();
      const qlines: string[] = [];
      while (i < lines.length && /^>\s?/.test(lines[i].trim())) {
        qlines.push(lines[i].trim().replace(/^>\s?/, ""));
        i += 1;
      }
      blocks.push({ type: "quote", lines: qlines });
      continue;
    }

    // Heading.
    const heading = /^(#{1,3})\s+(.*)$/.exec(trimmed);
    if (heading) {
      flushAll();
      blocks.push({ type: "heading", level: heading[1].length, text: heading[2] });
      i += 1;
      continue;
    }

    // Bullet list (-, *, +).
    const bullet = /^[-*+]\s+(.*)$/.exec(trimmed);
    if (bullet) {
      flushParagraph();
      flushOl();
      ul.push(bullet[1]);
      i += 1;
      continue;
    }

    // Numbered list (1. atau 1)).
    const numbered = /^\d+[.)]\s+(.*)$/.exec(trimmed);
    if (numbered) {
      flushParagraph();
      flushUl();
      ol.push(numbered[1]);
      i += 1;
      continue;
    }

    flushUl();
    flushOl();
    paragraph.push(trimmed);
    i += 1;
  }

  flushAll();
  return blocks;
}

export function Markdown({ content }: { content: string }) {
  const blocks = parseBlocks(content);

  return (
    <div className="space-y-2.5 text-[14px] leading-6 text-[#3D3530]">
      {blocks.map((block, index) => {
        const key = `block-${index}`;

        if (block.type === "heading") {
          const size =
            block.level === 1
              ? "text-[16px]"
              : block.level === 2
                ? "text-[15px]"
                : "text-[14px]";
          return (
            <p
              key={key}
              className={`font-semibold text-[#2F2925] ${size} ${index > 0 ? "mt-1" : ""}`}
            >
              {renderInline(block.text, key)}
            </p>
          );
        }

        if (block.type === "ul") {
          return (
            <ul key={key} className="space-y-1.5 pl-1">
              {block.items.map((item, idx) => (
                <li key={`${key}-${idx}`} className="flex gap-2.5">
                  <span className="mt-[9px] h-[5px] w-[5px] shrink-0 rounded-full bg-[#B69B86]" />
                  <span className="min-w-0 flex-1 [text-align:justify]">
                    {renderInline(item, `${key}-${idx}`)}
                  </span>
                </li>
              ))}
            </ul>
          );
        }

        if (block.type === "ol") {
          return (
            <ol key={key} className="space-y-1.5">
              {block.items.map((item, idx) => (
                <li key={`${key}-${idx}`} className="flex gap-2.5">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#F0EAE2] text-[11px] font-semibold text-[#6B5B52]">
                    {idx + 1}
                  </span>
                  <span className="min-w-0 flex-1 pt-0.5 [text-align:justify]">
                    {renderInline(item, `${key}-${idx}`)}
                  </span>
                </li>
              ))}
            </ol>
          );
        }

        if (block.type === "quote") {
          return (
            <blockquote
              key={key}
              className="space-y-1 border-l-[3px] border-[#D9C8BA] bg-[#FBF8F4] py-1.5 pl-3 pr-2 text-[13px] italic text-[#6B5B52]"
            >
              {block.lines.map((qline, idx) => (
                <p key={`${key}-${idx}`}>{renderInline(qline, `${key}-${idx}`)}</p>
              ))}
            </blockquote>
          );
        }

        if (block.type === "table") {
          return (
            <div key={key} className="overflow-x-auto rounded-xl border border-[#E8E2D9]">
              <table className="w-full border-collapse text-[12.5px]">
                <thead>
                  <tr className="bg-[#F5F0EA]">
                    {block.header.map((cell, idx) => (
                      <th
                        key={`${key}-h-${idx}`}
                        className="border-b border-[#E8E2D9] px-3 py-2 text-left font-semibold text-[#3D3530]"
                      >
                        {renderInline(cell, `${key}-h-${idx}`)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {block.rows.map((row, rIdx) => (
                    <tr key={`${key}-r-${rIdx}`} className={rIdx % 2 ? "bg-[#FCFBF9]" : "bg-white"}>
                      {row.map((cell, cIdx) => (
                        <td
                          key={`${key}-r-${rIdx}-${cIdx}`}
                          className="border-b border-[#EFEAE3] px-3 py-2 align-top text-[#4A423C]"
                        >
                          {renderInline(cell, `${key}-r-${rIdx}-${cIdx}`)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        return (
          <p key={key} className="whitespace-pre-wrap break-words [text-align:justify]">
            {renderInline(block.text, key)}
          </p>
        );
      })}
    </div>
  );
}
