export interface DocumentNode {
  kind: "document";
  title: string;
  children: DocBlockNode[];
}

export interface SectionNode {
  kind: "section";
  stableSlug: string;
  title: string;
  level: number;
  children: NonSectionDocBlockNode[];
}

export interface ParagraphNode {
  kind: "paragraph";
  text: string;
}

export interface ListItemNode {
  kind: "list_item";
  text: string;
}

export interface ListNode {
  kind: "list";
  ordered: boolean;
  items: ListItemNode[];
}

export interface CodeBlockNode {
  kind: "code_block";
  language?: string;
  code: string;
}

export interface BlockquoteNode {
  kind: "blockquote";
  children: ParagraphNode[];
}

export type NonSectionDocBlockNode = ParagraphNode | ListNode | CodeBlockNode | BlockquoteNode;
export type DocBlockNode = NonSectionDocBlockNode | SectionNode;
export type DocNode = DocumentNode | DocBlockNode;
