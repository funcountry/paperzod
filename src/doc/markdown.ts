import type { BlockquoteNode, CodeBlockNode, DocBlockNode, DocumentNode, ListNode, ParagraphNode, SectionNode } from "./ast.js";

function renderParagraph(node: ParagraphNode): string {
  return node.text;
}

function renderList(node: ListNode): string {
  return node.items
    .map((item, index) => {
      const marker = node.ordered ? `${index + 1}.` : "-";
      return `${marker} ${item.text}`;
    })
    .join("\n");
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
