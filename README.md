# i18n-scan

A CLI tool to extract raw text from JSX/TSX files for internationalization (i18n).

Best paired with agentic ai tools like Cursor.

## Features

- Extracts text content from JSX elements
- Extracts text from specified JSX attributes (title, alt, placeholder, etc.)
- Supports TypeScript and JavaScript JSX files
- Configurable file extensions and attribute names
- Shows file path and line numbers for each extracted text

## Installation

1. Install dependencies:

```bash
npm install
```

2. Build the project:

```bash
npm run build
```

3. (Optional) Install globally:

```bash
npm install -g .
```

## Usage

### Basic Usage

```bash
# Use with npx (recommended)
npx i18n-scan <directory>

# If installed globally
i18n-scan <directory>

# Run locally during development (note the -- before flags)
npm run dev <directory> -- [options]

# Run built version locally
npm start <directory>
```

### Examples

```bash
# Scan all .tsx and .jsx files in src directory
npm run dev ./src

# Scan with custom file extensions
npm run dev ./src -- --ext .tsx,.jsx,.ts,.js

# Scan with custom attributes
npm run dev ./src -- --attributes title,alt,placeholder,aria-label

# Filter out non-alphabetic text (symbols, emojis, numbers only)
npm run dev ./src -- --filter-non-alpha

# Extract from objects, function calls, and schemas
npm run dev ./src -- --include-literals

# Combine options
npm run dev ./src -- --filter-non-alpha --truncate 50

# When using npx or installed globally, no -- needed:
npx i18n-scan ./src --filter-non-alpha --truncate 50
```

### Options

- `-e, --ext <extensions>`: Comma-separated list of file extensions (default: `.tsx,.jsx`)
- `-a, --attributes <names>`: Comma-separated list of attribute names to extract (default: `title,alt,placeholder`)
- `-t, --truncate <limit>`: Truncate text to this length, 0 to disable (default: `30`)
- `-f, --filter-non-alpha`: Filter out text containing only non-alphabetic characters (e.g., `$`, `123`, `🎉`)
- `-l, --include-literals`: Include string literals from objects, function calls, and validation schemas

## Example Output

```
[src/components/Button.tsx:5] Click me
[src/components/Button.tsx:6] Submit form
[src/components/Form.tsx:12] Enter your name
[src/components/Form.tsx:13] This field is required
```

**With `--filter-non-alpha` enabled:**

```
# Without filter:
[src/components/ProductCard.tsx:30] $
[src/components/ProductCard.tsx:33] In Stock

# With filter ($ is filtered out):
[src/components/ProductCard.tsx:33] In Stock
```

## Development

- `npm run dev <directory>`: Run from TypeScript source
- `npm run build`: Compile TypeScript to JavaScript
- `npm start <directory>`: Run compiled version

## What it extracts

### By default (JSX only):

1. **JSX Text Content**: Any text between JSX tags

   ```jsx
   <button>Click me</button>  // Extracts: "Click me"
   <p>Hello world</p>        // Extracts: "Hello world"
   ```

2. **JSX Attributes**: Text from specified attributes
   ```jsx
   <input placeholder="Enter name" />     // Extracts: "Enter name"
   <img alt="Profile picture" />          // Extracts: "Profile picture"
   <button title="Close dialog" />        // Extracts: "Close dialog"
   ```

### With `--include-literals` flag:

Extracts additional string literals that are commonly user-facing:

3. **Object Properties**: Strings from objects with keys like `message`, `error`, `label`, `title`, `description`, etc.

   ```typescript
   const errors = {
     required: "This field is required", // Extracts
     invalid: "Invalid email address", // Extracts
   };

   const config = {
     className: "btn-primary", // Skips (technical)
     title: "Welcome back", // Extracts
     apiUrl: "/api/users", // Skips (technical)
   };
   ```

4. **Zod Schema Messages**: Validation messages and descriptions

   ```typescript
   z.string().email("Invalid email")
   z.string().min(5, "Too short")
   z.string().max(100, { message: "Too long"
   z.string().describe("Your username")
   ```

5. **Function Calls**: Common user-facing function calls

   ```typescript
   toast.success("Saved successfully!");
   toast.error("Failed to save");
   console.error("Something went wrong");
   throw new Error("Invalid input");
   ```

**Smart Filtering**: The tool automatically skips technical strings like:

- Import paths, URLs, API endpoints
- CSS class names, IDs
- camelCase identifiers, CONSTANTS
- Single characters and code patterns

## Github Repo

https://github.com/hexxt-git/i18n-scan
