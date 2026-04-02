export interface DocumentNode {
  kind: "document";
  title: string;
  children: DocBlockNode[];
}

export interface ParagraphNode {
  kind: "paragraph";
  text: string;
}

export interface ListItemNode {
  kind: "list_item";
  text: string;
  children?: ListItemNode[] | undefined;
}

export interface ListNode {
  kind: "list";
  ordered: boolean;
  items: ListItemNode[];
}

export interface TableNode {
  kind: "table";
  headers: string[];
  rows: string[][];
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

export type NonSectionDocBlockNode = ParagraphNode | ListNode | TableNode | CodeBlockNode | BlockquoteNode;
export interface SectionNode {
  kind: "section";
  stableSlug: string;
  title: string;
  level: number;
  children: Array<NonSectionDocBlockNode | SectionNode>;
}
export type DocBlockNode = NonSectionDocBlockNode | SectionNode;
export type DocNode = DocumentNode | DocBlockNode;
