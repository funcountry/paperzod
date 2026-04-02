import type { BlockquoteNode, CodeBlockNode, DocBlockNode, DocumentNode, ListItemNode, ListNode, ParagraphNode, SectionNode, TableNode } from "./ast.js";

function renderParagraph(node: ParagraphNode): string {
  return node.text;
}

function renderListItems(items: ListItemNode[], ordered: boolean, depth: number): string {
  return items
    .map((item, index) => {
      const indent = "  ".repeat(depth);
      const marker = ordered ? `${index + 1}.` : "-";
      const line = `${indent}${marker} ${item.text}`;
      const children =
        item.children && item.children.length > 0 ? `\n${renderListItems(item.children, ordered, depth + 1)}` : "";
      return `${line}${children}`;
    })
    .join("\n");
}

function renderList(node: ListNode): string {
  return renderListItems(node.items, node.ordered, 0);
}

function escapeTableCell(value: string): string {
  return value.replaceAll("|", "\\|");
}

function renderTable(node: TableNode): string {
  const header = `| ${node.headers.map(escapeTableCell).join(" | ")} |`;
  const separator = `| ${node.headers.map(() => "---").join(" | ")} |`;
  const rows = node.rows.map((row) => `| ${row.map(escapeTableCell).join(" | ")} |`);
  return [header, separator, ...rows].join("\n");
}

function renderCodeBlock(node: CodeBlockNode): string {
  const language = node.language ?? "";
  return `\`\`\`${language}\n${node.code}\n\`\`\``;
}

function renderBlockquote(node: BlockquoteNode): string {
  return node.children.map((child) => `> ${child.text}`).join("\n");
}

function renderSection(node: SectionNode): string {
  const heading = `${"#".repeat(node.level)} ${node.title}`;
  const children = node.children.map(renderBlock).join("\n\n");
  return `<a id="${node.stableSlug}"></a>\n${heading}${children ? `\n\n${children}` : ""}`;
}

function renderBlock(node: DocBlockNode): string {
  switch (node.kind) {
    case "paragraph":
      return renderParagraph(node);
    case "list":
      return renderList(node);
    case "table":
      return renderTable(node);
    case "code_block":
      return renderCodeBlock(node);
    case "blockquote":
      return renderBlockquote(node);
    case "section":
      return renderSection(node);
  }
}

export function renderMarkdown(document: DocumentNode): string {
  const blocks = [`# ${document.title}`, ...document.children.map(renderBlock)];
  return `${blocks.join("\n\n")}\n`;
}
