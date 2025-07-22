#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { Command } from "commander";
import * as babelParser from "@babel/parser";
import * as t from "@babel/types";
import traverseModule from "@babel/traverse";

// Handle ESM import for @babel/traverse
const traverse = (traverseModule as any).default || traverseModule;

const program = new Command();

program
  .name("extract-i18n")
  .description("Extract raw text from JSX for i18n")
  .argument("<directory>", "Directory to scan")
  .option(
    "-e, --ext <extensions>",
    "Comma-separated list of file extensions",
    ".tsx,.jsx"
  )
  .option(
    "-a, --attributes <names>",
    "Comma-separated list of attribute names",
    "title,alt,placeholder"
  )
  .option(
    "-t, --truncate <limit>",
    "Truncate text to this length, 0 to disable",
    "30"
  )
  .parse();

const dir = path.resolve(program.args[0] as string);
const options = program.opts();
const extensions = options.ext.split(",").map((ext: string) => ext.trim());
const attributes = options.attributes
  .split(",")
  .map((attr: string) => attr.trim());
const truncate = options.truncate ? parseInt(options.truncate) : 0;

function extractTextWithLocation(filePath: string, code: string) {
  const ast = babelParser.parse(code, {
    sourceType: "module",
    plugins: ["jsx", "typescript"],
  });

  const results: { line: number; text: string }[] = [];

  traverse(ast, {
    JSXText(path: any) {
      const text = path.node.value.trim();
      if (text) {
        results.push({
          line: path.node.loc?.start.line || 0,
          text,
        });
      }
    },
    JSXAttribute(path: any) {
      const name = path.node.name.name;
      const value = path.node.value;
      if (
        typeof name === "string" &&
        attributes.includes(name) &&
        value &&
        t.isStringLiteral(value)
      ) {
        results.push({
          line: value.loc?.start.line || 0,
          text: value.value.trim(),
        });
      }
    },
  });

  results.forEach(({ line, text }) => {
    const truncatedText = truncate
      ? text.length > truncate
        ? text.substring(0, truncate) + "..."
        : text
      : text;
    console.log(
      `[${path.relative(process.cwd(), filePath)}:${line}] ${truncatedText}`
    );
  });
}

function scanDir(dirPath: string) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      scanDir(fullPath);
    } else if (
      entry.isFile() &&
      extensions.includes(path.extname(entry.name))
    ) {
      const code = fs.readFileSync(fullPath, "utf8");
      extractTextWithLocation(fullPath, code);
    }
  }
}

scanDir(dir);
