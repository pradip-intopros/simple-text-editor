# mini-text-editor

A simple, lightweight React text editor customized for support ticketing tasks.

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
    />
  );
}
```
