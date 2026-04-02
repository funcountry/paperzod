import type {
  BlockquoteNode,
  CodeBlockNode,
  DocumentNode,
  ListItemNode,
  ListNode,
  NonSectionDocBlockNode,
  ParagraphNode,
  SectionNode
} from "./ast.js";

export function doc(title: string, children: NonSectionDocBlockNode[] | Array<NonSectionDocBlockNode | SectionNode>): DocumentNode {
  return {
    kind: "document",
    title,
    children: [...children]
  };
}

export function section(
  stableSlug: string,
  title: string,
  children: NonSectionDocBlockNode[],
  level = 2
): SectionNode {
  if (level < 1) {
    throw new Error("Section level must be at least 1.");
  }

  return {
    kind: "section",
    stableSlug,
    title,
    level,
    children: [...children]
  };
}

export function paragraph(text: string): ParagraphNode {
  return { kind: "paragraph", text };
}

export function listItem(text: string): ListItemNode {
  return { kind: "list_item", text };
}

export function unorderedList(items: string[]): ListNode {
  return {
    kind: "list",
    ordered: false,
    items: items.map(listItem)
  };
}

export function orderedList(items: string[]): ListNode {
  return {
    kind: "list",
    ordered: true,
    items: items.map(listItem)
  };
}

export function codeBlock(language: string | undefined, code: string): CodeBlockNode {
  return {
    kind: "code_block",
    ...(language ? { language } : {}),
    code
  };
}

export function blockquote(children: ParagraphNode[]): BlockquoteNode {
  return {
    kind: "blockquote",
    children: [...children]
  };
}
