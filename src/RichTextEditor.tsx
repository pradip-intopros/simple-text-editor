import React, { useEffect, useRef } from 'react';

export interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: number;
}

import { Bold, Italic, Underline, List, ListOrdered } from 'lucide-react';

const TOOLBAR_ACTIONS = [
  { icon: <Bold size={16} />, command: 'bold', title: 'Bold' },
  { icon: <Italic size={16} />, command: 'italic', title: 'Italic' },
  { icon: <Underline size={16} />, command: 'underline', title: 'Underline' },
  { icon: <List size={16} />, command: 'insertUnorderedList', title: 'Bullet list' },
  { icon: <ListOrdered size={16} />, command: 'insertOrderedList', title: 'Numbered list' },
] as const;

export const getRichTextPlainValue = (value: string) =>
  value
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Write here...',
  minHeight = 180,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!editorRef.current) {
      return;
    }

    if (editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const syncValue = () => {
    if (!editorRef.current) {
      return;
    }

    onChange(editorRef.current.innerHTML);
  };

  const applyCommand = (command: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false);
    syncValue();
  };

  return (
    <div className="rte">
      <div className="rte-toolbar" role="toolbar" aria-label="Text formatting">
        {TOOLBAR_ACTIONS.map((action) => (
          <button
            key={action.command}
            type="button"
            className="rte-tool"
            title={action.title}
            onClick={() => applyCommand(action.command)}
          >
            {action.icon}
          </button>
        ))}
      </div>
      <div className="rte-editor-shell" style={{ minHeight }}>
        <div
          ref={editorRef}
          className="rte-editor"
          contentEditable
          suppressContentEditableWarning
          data-placeholder={placeholder}
          onInput={syncValue}
        />
      </div>
    </div>
  );
};
