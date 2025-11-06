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
  .argument("[directory]", "Directory to scan", ".")
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
  .option(
    "-f, --filter-non-alpha",
    "Filter out text containing only non-alphabetic characters",
    false
  )
  .option(
    "-l, --include-literals",
    "Include string literals from objects, function calls, and schemas",
    false
  )
  .parse();

const dir = path.resolve(program.args[0] as string);
const options = program.opts();
const extensions = options.ext.split(",").map((ext: string) => ext.trim());
const attributes = options.attributes
  .split(",")
  .map((attr: string) => attr.trim());
const truncate = options.truncate ? parseInt(options.truncate) : 0;
const filterNonAlpha = options.filterNonAlpha || false;
const includeLiterals = options.includeLiterals || false;

// Keys that typically contain user-facing text
const USER_FACING_KEYS = new Set([
  "message",
  "error",
  "label",
  "title",
  "description",
  "text",
  "placeholder",
  "tooltip",
  "hint",
  "content",
  "name",
  "displayName",
]);

// Function/method names that typically contain user-facing text
const USER_FACING_FUNCTIONS = new Set([
  "toast",
  "error",
  "warn",
  "message",
  "alert",
  "notify",
  "success",
  "info",
]);

// Keys to always skip (technical/code values)
const SKIP_KEYS = new Set([
  "className",
  "class",
  "id",
  "key",
  "ref",
  "style",
  "type",
  "href",
  "src",
  "path",
  "url",
  "api",
  "endpoint",
  "method",
  "mode",
  "variant",
]);

function hasAlphabeticChar(text: string): boolean {
  return /[a-zA-Z]/.test(text);
}

function isUserFacingText(text: string): boolean {
  // Skip empty or very short strings
  if (!text || text.length < 2) return false;

  // Skip strings that look like code patterns
  if (/^[a-z][a-zA-Z]*$/.test(text)) return false; // camelCase
  if (/^[A-Z_]+$/.test(text)) return false; // CONSTANTS
  if (text.startsWith("/") || text.startsWith("./")) return false; // paths
  if (text.includes("://")) return false; // URLs

  if (!hasAlphabeticChar(text)) {
    return filterNonAlpha ? false : true;
  }

  return true;
}

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
        // Skip text with only non-alphabetic characters if filter is enabled
        if (filterNonAlpha && !hasAlphabeticChar(text)) {
          return;
        }
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
        const text = value.value.trim();
        // Skip text with only non-alphabetic characters if filter is enabled
        if (filterNonAlpha && !hasAlphabeticChar(text)) {
          return;
        }
        results.push({
          line: value.loc?.start.line || 0,
          text,
        });
      }
    },
  });

  // Extended extraction for literals (objects, function calls, schemas)
  if (includeLiterals) {
    traverse(ast, {
      // Extract from object properties with user-facing keys
      ObjectProperty(path: any) {
        const key = path.node.key;
        const value = path.node.value;

        // Get the key name
        let keyName = "";
        if (t.isIdentifier(key)) {
          keyName = key.name;
        } else if (t.isStringLiteral(key)) {
          keyName = key.value;
        }

        if (SKIP_KEYS.has(keyName)) return;

        // Check if it's a user-facing key or extract all strings
        if (USER_FACING_KEYS.has(keyName) || true) {
          if (t.isStringLiteral(value)) {
            const text = value.value.trim();
            if (isUserFacingText(text)) {
              results.push({
                line: value.loc?.start.line || 0,
                text,
              });
            }
          }
        }
      },

      NewExpression(path: any) {
        const callee = path.node.callee;
        if (t.isIdentifier(callee, { name: "Error" })) {
          const arg = path.node.arguments[0];
          if (t.isStringLiteral(arg)) {
            const text = arg.value.trim();
            if (isUserFacingText(text)) {
              results.push({
                line: arg.loc?.start.line || 0,
                text,
              });
            }
          }
        }
      },

      // Extract from function calls (toast, error, etc.)
      CallExpression(path: any) {
        const callee = path.node.callee;

        let functionName = "";
        if (t.isIdentifier(callee)) {
          functionName = callee.name;
        } else if (t.isMemberExpression(callee)) {
          // Handle toast.error(), console.warn(), etc.
          if (
            t.isIdentifier(callee.object) &&
            t.isIdentifier(callee.property)
          ) {
            const obj = callee.object.name;
            const prop = callee.property.name;
            functionName = prop;

            // Common patterns
            if (
              (obj === "toast" || obj === "console") &&
              USER_FACING_FUNCTIONS.has(prop)
            ) {
              const arg = path.node.arguments[0];
              if (t.isStringLiteral(arg)) {
                const text = arg.value.trim();
                if (isUserFacingText(text)) {
                  results.push({
                    line: arg.loc?.start.line || 0,
                    text,
                  });
                }
              }
            }
          }
          // Handle Zod: .message(), .min(), .max(), etc.
          if (t.isIdentifier(callee.property)) {
            const methodName = callee.property.name;
            if (methodName === "message" || methodName === "describe") {
              const arg = path.node.arguments[0];
              if (t.isStringLiteral(arg)) {
                const text = arg.value.trim();
                if (isUserFacingText(text)) {
                  results.push({
                    line: arg.loc?.start.line || 0,
                    text,
                  });
                }
              }
            }
            // Zod validation with error message as second arg
            if (
              ["min", "max", "length", "email", "url", "regex"].includes(
                methodName
              )
            ) {
              const arg = path.node.arguments[1];
              if (t.isStringLiteral(arg)) {
                const text = arg.value.trim();
                if (isUserFacingText(text)) {
                  results.push({
                    line: arg.loc?.start.line || 0,
                    text,
                  });
                }
              } else if (t.isObjectExpression(arg)) {
                // .min(5, { message: "..." })
                const messageProp = arg.properties.find(
                  (prop: any) =>
                    t.isObjectProperty(prop) &&
                    t.isIdentifier(prop.key, { name: "message" })
                );
                if (
                  messageProp &&
                  t.isStringLiteral((messageProp as any).value)
                ) {
                  const text = ((messageProp as any).value as any).value.trim();
                  if (isUserFacingText(text)) {
                    results.push({
                      line:
                        ((messageProp as any).value as any).loc?.start.line ||
                        0,
                      text,
                    });
                  }
                }
              }
            }
          }
        } else if (USER_FACING_FUNCTIONS.has(functionName)) {
          const arg = path.node.arguments[0];
          if (t.isStringLiteral(arg)) {
            const text = arg.value.trim();
            if (isUserFacingText(text)) {
              results.push({
                line: arg.loc?.start.line || 0,
                text,
              });
            }
          }
        }
      },
    });
  }

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
