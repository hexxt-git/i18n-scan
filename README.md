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
# Run from source (development)
npm run dev <directory>

# Run built version
npm start <directory>

# If installed globally
i18n-scan <directory>
```

### Examples

```bash
# Scan all .tsx and .jsx files in src directory
npm run dev ./src

# Scan with custom file extensions
npm run dev ./src --ext .tsx,.jsx,.ts,.js

# Scan with custom attributes
npm run dev ./src --attributes title,alt,placeholder,aria-label
```

### Options

- `-e, --ext <extensions>`: Comma-separated list of file extensions (default: `.tsx,.jsx`)
- `-a, --attributes <names>`: Comma-separated list of attribute names to extract (default: `title,alt,placeholder`)

## Example Output

```
[src/components/Button.tsx:5] Click me
[src/components/Button.tsx:6] Submit form
[src/components/Form.tsx:12] Enter your name
[src/components/Form.tsx:13] This field is required
```

## Development

- `npm run dev <directory>`: Run from TypeScript source
- `npm run build`: Compile TypeScript to JavaScript
- `npm start <directory>`: Run compiled version

## What it extracts

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
