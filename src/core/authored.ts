import type {
  AuthoredContentBlock,
  AuthoredDefinitionListItem,
  AuthoredInlineRefDef,
  AuthoredInlineTextDef,
  AuthoredInlineTextSegmentDef,
  AuthoredListEntry
} from "./defs.js";

export function toInlineTextSegments(value: AuthoredInlineTextDef): AuthoredInlineTextSegmentDef[] {
  return typeof value === "string" ? [value] : value;
}

function visitInlineRefsInListEntry(entry: AuthoredListEntry, visitor: (ref: AuthoredInlineRefDef) => void): void {
  if (typeof entry === "string" || Array.isArray(entry)) {
    visitInlineRefsInText(entry, visitor);
    return;
  }

  visitInlineRefsInText(entry.text, visitor);
  for (const child of entry.children ?? []) {
    visitInlineRefsInListEntry(child, visitor);
  }
}

function visitInlineRefsInDefinitionListItem(
  item: AuthoredDefinitionListItem,
  visitor: (ref: AuthoredInlineRefDef) => void
): void {
  visitInlineRefsInText(item.term, visitor);
  for (const definition of item.definitions) {
    visitInlineRefsInListEntry(definition, visitor);
  }
}

export function visitInlineRefsInText(value: AuthoredInlineTextDef, visitor: (ref: AuthoredInlineRefDef) => void): void {
  for (const segment of toInlineTextSegments(value)) {
    if (typeof segment !== "string") {
      visitor(segment);
    }
  }
}

export function visitInlineRefsInBlocks(
  blocks: readonly AuthoredContentBlock[],
  visitor: (ref: AuthoredInlineRefDef) => void
): void {
  for (const block of blocks) {
    switch (block.kind) {
      case "paragraph":
        visitInlineRefsInText(block.text, visitor);
        break;
      case "unordered_list":
      case "ordered_list":
      case "ordered_steps":
      case "rule_list":
        for (const item of block.items) {
          visitInlineRefsInListEntry(item, visitor);
        }
        break;
      case "definition_list":
        for (const item of block.items) {
          visitInlineRefsInDefinitionListItem(item, visitor);
        }
        break;
      case "table":
      case "code_block":
        break;
      case "example":
        visitInlineRefsInBlocks(block.blocks, visitor);
        break;
      case "good_bad_examples":
        for (const example of [...block.good, ...block.bad]) {
          visitInlineRefsInBlocks(example.blocks, visitor);
        }
        break;
    }
  }
}
