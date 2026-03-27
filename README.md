# mini-text-editor

A simple, lightweight React text editor with custom color palette and toolbar customization.

## Features
-   **URL Auto-Conversion**: Automatically converts pasted URLs into domain-only clickable links.
-   **Custom Color Palette**: 5-color palette for text and background.
-   **Dynamic Toolbar**: Fully customizable toolbar via the `tools` prop.

## Installation

```bash
npm install mini-text-editor
```

## Usage

```tsx
import { MiniTextEditor } from 'mini-text-editor';

function MyComponent() {
  return (
    <MiniTextEditor 
      value="<p>Hello World</p>"
      onChange={(val) => console.log(val)}
      tools={['format', 'bold', 'italic', 'color', 'highlight']} // Optional: Choose your tools
    />
  );
}
```

### Props
- `value`: (string) The initial HTML content.
- `onChange`: (function) Callback when content changes.
- `placeholder`: (string, optional) Placeholder text.
- `minHeight`: (number, optional) Minimum height of the editor area.
- `tools`: (EditorTool[], optional) Array of tools to display.

### Available Tools

| Tool | Description |
| :--- | :--- |
| `'format'` | Paragraph and Heading (H1-H3) dropdown |
| `'bold'` | Bold text |
| `'italic'` | Italicize text |
| `'underline'` | Underline text |
| `'strike'` | Strikethrough text |
| `'color'` | Text color picker |
| `'highlight'` | Background color picker |
| `'clear'` | Clear all formatting |
| `'align-left'` | Align text to left |
| `'align-center'` | Center text |
| `'align-right'` | Align text to right |
| `'list'` | Unordered (bullet) list |
| `'ordered-list'` | Ordered (numbered) list |
