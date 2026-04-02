import { readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import type { AuthoredContentBlock, AuthoredListEntry, AuthoredSimpleContentBlock } from "../core/defs.js";

export type FragmentSpec = Record<string, string>;

export type LoadedFragments<TSpec extends FragmentSpec> = {
  [K in keyof TSpec]: AuthoredContentBlock[];
};

interface ListMarker {
  depth: number;
  ordered: boolean;
  text: string;
}

interface ParsedBlock {
  block: AuthoredSimpleContentBlock;
  nextIndex: number;
}

interface ParsedListBlock {
  block: Extract<AuthoredSimpleContentBlock, { kind: "ordered_list" | "unordered_list" }>;
  nextIndex: number;
}

const listMarkerPattern = /^(\s*)([-*+]|\d+\.)\s+(.*)$/;
const pipeTableLinePattern = /^\s*\|.*\|\s*$/;

function fragmentError(filePath: string, lineNumber: number, message: string): never {
  throw new Error(`${filePath}:${lineNumber}: ${message}`);
}

function normalizeBaseDirectory(base: string | URL): string {
  if (typeof base === "string") {
    if (!path.isAbsolute(base)) {
      throw new Error(`Fragment base "${base}" must be an absolute path or file URL.`);
    }
    const stats = statSync(base, { throwIfNoEntry: false });
    if (!stats?.isDirectory()) {
      throw new Error(`Fragment base "${base}" must point to an existing directory.`);
    }
    return base;
  }

  if (base.protocol !== "file:") {
    throw new Error(`Fragment base URL must use the file: protocol. Received "${base.protocol}".`);
  }

  const basePath = fileURLToPath(base);
  const stats = statSync(basePath, { throwIfNoEntry: false });
  if (!stats?.isDirectory()) {
    throw new Error(`Fragment base "${base.href}" must point to an existing directory.`);
  }

  return basePath;
}

function resolveFragmentPath(baseDirectory: string, relativePath: string): string {
  if (path.isAbsolute(relativePath)) {
    throw new Error(`Fragment path "${relativePath}" must be relative to the explicit fragment base.`);
  }

  const resolvedPath = path.resolve(baseDirectory, relativePath);
  const relativeFromBase = path.relative(baseDirectory, resolvedPath);

  if (relativeFromBase.startsWith("..") || path.isAbsolute(relativeFromBase)) {
    throw new Error(`Fragment path "${relativePath}" escapes the explicit fragment base "${baseDirectory}".`);
  }

  return resolvedPath;
}

function isBlank(line: string): boolean {
  return line.trim().length === 0;
}

function parseIndentDepth(line: string, filePath: string, lineNumber: number): number {
  if (line.includes("\t")) {
    fragmentError(filePath, lineNumber, "Tabs are not supported in fragment markdown. Use spaces for list indentation.");
  }

  const indentMatch = line.match(/^ */);
  const indentWidth = indentMatch?.[0].length ?? 0;
  if (indentWidth % 2 !== 0) {
    fragmentError(filePath, lineNumber, "List indentation must use multiples of two spaces.");
  }

  return indentWidth / 2;
}

function parseListMarker(line: string, filePath: string, lineNumber: number): ListMarker | undefined {
  const match = line.match(listMarkerPattern);
  if (!match) {
    return undefined;
  }

  const indent = match[1] ?? "";
  const marker = match[2];
  const text = match[3];
  if (marker === undefined || text === undefined) {
    fragmentError(filePath, lineNumber, "Malformed list item.");
  }

  const depth = parseIndentDepth(indent, filePath, lineNumber);
  return {
    depth,
    ordered: marker.endsWith("."),
    text
  };
}

function isPipeTableLine(line: string): boolean {
  return pipeTableLinePattern.test(line);
}

function parseTableCells(line: string, filePath: string, lineNumber: number): string[] {
  if (!isPipeTableLine(line)) {
    fragmentError(filePath, lineNumber, "Malformed pipe table row. Use leading and trailing | characters for each row.");
  }

  const trimmed = line.trim();
  const inner = trimmed.slice(1, -1);
  const cells = inner.split("|").map((cell) => cell.trim());
  if (cells.length < 2) {
    fragmentError(filePath, lineNumber, "Pipe tables must include at least two columns.");
  }

  return cells;
}

function parseTableSeparator(line: string, expectedColumns: number, filePath: string, lineNumber: number): void {
  const cells = parseTableCells(line, filePath, lineNumber);
  if (cells.length !== expectedColumns) {
    fragmentError(filePath, lineNumber, "Pipe table separator columns must match the header column count.");
  }

  for (const cell of cells) {
    if (!/^:?-{3,}:?$/.test(cell)) {
      fragmentError(filePath, lineNumber, "Malformed pipe table separator. Use at least three dashes per column.");
    }
  }
}

function getUnsupportedReason(line: string, options: { firstBlock: boolean }): string | undefined {
  const trimmed = line.trim();

  if (trimmed.startsWith("~~~")) {
    return "Use triple backticks for fenced code blocks.";
  }
  if (options.firstBlock && trimmed === "---") {
    return "Frontmatter is not supported in fragments.";
  }
  if (/^\s*(?:---|\*\*\*|___)\s*$/.test(line)) {
    return "Horizontal rules are not supported in fragments.";
  }
  if (/^\s*#{1,6}\s+/.test(line)) {
    return "Headings are not supported in fragments. Use TypeScript-owned document or section titles instead.";
  }
  if (/^\s*>/.test(line)) {
    return "Blockquotes are not supported in fragments.";
  }
  if (/^\s*<[/!A-Za-z][^>]*>/.test(line)) {
    return "HTML blocks are not supported in fragments.";
  }
  if (/!\[[^\]]*]\([^)]+\)/.test(line)) {
    return "Images are not supported in fragments.";
  }
  if (/^\s*(?:[-*+]|\d+\.)\s+\[[ xX]\]\s+/.test(line)) {
    return "Task lists are not supported in fragments.";
  }

  return undefined;
}

function parseCodeBlock(lines: readonly string[], startIndex: number, filePath: string): ParsedBlock {
  const openingLine = lines[startIndex] ?? "";
  const openingMatch = openingLine.match(/^\s*```([^\s`]*)\s*$/);
  if (!openingMatch) {
    fragmentError(filePath, startIndex + 1, "Malformed fenced code block. Use triple backticks with an optional language label.");
  }

  let endIndex = startIndex + 1;
  while (endIndex < lines.length) {
    if (/^\s*```\s*$/.test(lines[endIndex] ?? "")) {
      const code = lines.slice(startIndex + 1, endIndex).join("\n");
      if (code.length === 0) {
        fragmentError(filePath, startIndex + 1, "Empty fenced code blocks are not supported in fragments.");
      }

      return {
        block: {
          kind: "code_block",
          code,
          ...(openingMatch[1] ? { language: openingMatch[1] } : {})
        },
        nextIndex: endIndex + 1
      };
    }
    endIndex += 1;
  }

  fragmentError(filePath, startIndex + 1, "Unclosed fenced code block.");
}

function parseListBlock(
  lines: readonly string[],
  startIndex: number,
  depth: number,
  expectedOrdered: boolean | undefined,
  filePath: string
): ParsedListBlock {
  let index = startIndex;
  let ordered = expectedOrdered;
  const items: AuthoredListEntry[] = [];

  while (index < lines.length) {
    const line = lines[index];
    if (line === undefined || isBlank(line)) {
      break;
    }

    const marker = parseListMarker(line, filePath, index + 1);
    if (!marker) {
      break;
    }
    if (marker.depth < depth) {
      break;
    }
    if (marker.depth > depth) {
      fragmentError(filePath, index + 1, "List nesting may only increase one level at a time.");
    }

    if (ordered === undefined) {
      ordered = marker.ordered;
    } else if (marker.ordered !== ordered) {
      fragmentError(filePath, index + 1, "Mixed ordered and unordered list markers are not supported in one fragment list.");
    }

    if (marker.text.trim().length === 0) {
      fragmentError(filePath, index + 1, "List items must include text.");
    }
    if (/^\[[ xX]\]\s+/.test(marker.text.trim())) {
      fragmentError(filePath, index + 1, "Task lists are not supported in fragments.");
    }

    let itemChildren: AuthoredListEntry[] | undefined;
    let nextIndex = index + 1;

    while (nextIndex < lines.length) {
      const nextLine = lines[nextIndex];
      if (nextLine === undefined || isBlank(nextLine)) {
        break;
      }

      const nextMarker = parseListMarker(nextLine, filePath, nextIndex + 1);
      if (nextMarker) {
        if (nextMarker.depth === depth) {
          break;
        }
        if (nextMarker.depth === depth + 1) {
          if (nextMarker.ordered !== ordered) {
            fragmentError(filePath, nextIndex + 1, "Mixed ordered and unordered nested list markers are not supported in fragments.");
          }

          const nested = parseListBlock(lines, nextIndex, depth + 1, ordered, filePath);
          itemChildren = nested.block.items;
          nextIndex = nested.nextIndex;
          continue;
        }

        fragmentError(filePath, nextIndex + 1, "List nesting may only increase one level at a time.");
      }

      const nextDepth = parseIndentDepth(nextLine, filePath, nextIndex + 1);
      if (nextDepth > depth) {
        fragmentError(filePath, nextIndex + 1, "Multi-line list items are not supported in fragments. Split the prose into explicit paragraphs instead.");
      }

      break;
    }

    items.push(itemChildren ? { text: marker.text.trim(), children: itemChildren } : marker.text.trim());
    index = nextIndex;
  }

  if (ordered === undefined || items.length === 0) {
    fragmentError(filePath, startIndex + 1, "Expected a supported list block.");
  }

  return {
    block: {
      kind: ordered ? "ordered_list" : "unordered_list",
      items
    },
    nextIndex: index
  };
}

function parseTableBlock(lines: readonly string[], startIndex: number, filePath: string): ParsedBlock {
  const headerLine = lines[startIndex] ?? "";
  const separatorLine = lines[startIndex + 1];
  if (separatorLine === undefined) {
    fragmentError(filePath, startIndex + 1, "Pipe tables must include a separator row immediately after the header.");
  }

  // Tables are the widest fragment syntax we accept because they already lower one-to-one into authored table blocks.
  const headers = parseTableCells(headerLine, filePath, startIndex + 1);
  parseTableSeparator(separatorLine, headers.length, filePath, startIndex + 2);

  const rows: string[][] = [];
  let index = startIndex + 2;

  while (index < lines.length) {
    const line = lines[index];
    if (line === undefined || isBlank(line)) {
      break;
    }
    if (!isPipeTableLine(line)) {
      break;
    }

    const row = parseTableCells(line, filePath, index + 1);
    if (row.length !== headers.length) {
      fragmentError(filePath, index + 1, "Pipe table rows must match the header column count.");
    }

    rows.push(row);
    index += 1;
  }

  if (rows.length === 0) {
    fragmentError(filePath, startIndex + 1, "Pipe tables must include at least one body row.");
  }

  return {
    block: {
      kind: "table",
      headers,
      rows
    },
    nextIndex: index
  };
}

function parseParagraph(lines: readonly string[], startIndex: number, filePath: string, firstBlock: boolean): ParsedBlock {
  let index = startIndex;
  const paragraphLines: string[] = [];

  while (index < lines.length) {
    const line = lines[index];
    if (line === undefined || isBlank(line)) {
      break;
    }
    if (/^\s*```/.test(line) || parseListMarker(line, filePath, index + 1) || isPipeTableLine(line)) {
      break;
    }

    const unsupported = getUnsupportedReason(line, { firstBlock: firstBlock && paragraphLines.length === 0 });
    if (unsupported) {
      break;
    }

    paragraphLines.push(line.trim());
    index += 1;
  }

  if (paragraphLines.length === 0) {
    fragmentError(filePath, startIndex + 1, "Expected a supported paragraph, list, or fenced code block.");
  }

  return {
    block: {
      kind: "paragraph",
      text: paragraphLines.join(" ")
    },
    nextIndex: index
  };
}

function parseFragmentMarkdown(content: string, filePath: string): AuthoredContentBlock[] {
  const normalized = content.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
  const lines = normalized.split("\n");
  const blocks: AuthoredContentBlock[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];
    if (line === undefined || isBlank(line)) {
      index += 1;
      continue;
    }

    if (/^\s*```/.test(line)) {
      const parsed = parseCodeBlock(lines, index, filePath);
      blocks.push(parsed.block);
      index = parsed.nextIndex;
      continue;
    }

    const listMarker = parseListMarker(line, filePath, index + 1);
    if (listMarker) {
      if (listMarker.depth !== 0) {
        fragmentError(filePath, index + 1, "Top-level lists may not start indented.");
      }

      const parsed = parseListBlock(lines, index, 0, undefined, filePath);
      blocks.push(parsed.block);
      index = parsed.nextIndex;
      continue;
    }

    if (isPipeTableLine(line)) {
      const parsed = parseTableBlock(lines, index, filePath);
      blocks.push(parsed.block);
      index = parsed.nextIndex;
      continue;
    }

    const unsupported = getUnsupportedReason(line, { firstBlock: blocks.length === 0 });
    if (unsupported) {
      fragmentError(filePath, index + 1, unsupported);
    }

    const parsed = parseParagraph(lines, index, filePath, blocks.length === 0);
    blocks.push(parsed.block);
    index = parsed.nextIndex;
  }

  return blocks;
}

export function loadFragments<const TSpec extends FragmentSpec>(base: string | URL, spec: TSpec): LoadedFragments<TSpec> {
  const baseDirectory = normalizeBaseDirectory(base);
  const loaded = {} as LoadedFragments<TSpec>;

  for (const key of Object.keys(spec) as Array<keyof TSpec>) {
    const relativePath = spec[key] as string;
    const filePath = resolveFragmentPath(baseDirectory, relativePath);
    const stats = statSync(filePath, { throwIfNoEntry: false });
    if (!stats?.isFile()) {
      throw new Error(`Fragment file "${relativePath}" does not exist under "${baseDirectory}".`);
    }

    loaded[key] = parseFragmentMarkdown(readFileSync(filePath, "utf8"), filePath);
  }

  return loaded;
}
