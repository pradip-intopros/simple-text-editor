import React, { useEffect, useRef, useState } from 'react';
import { 
  Bold, Italic, Underline, List, ListOrdered, 
  AlignLeft, AlignCenter, AlignRight, Strikethrough,
  Plus, Link, Image, Eraser, Baseline, ChevronDown
} from 'lucide-react';

export interface MiniTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: number;
}

export const getRichTextPlainValue = (value: string) =>
  value
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

export const MiniTextEditor: React.FC<MiniTextEditorProps> = ({
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

  const applyCommand = (command: string, arg: string = '') => {
    editorRef.current?.focus();
    document.execCommand(command, false, arg);
    syncValue();
  };

  const handleFormatBlock = (e: React.ChangeEvent<HTMLSelectElement>) => {
    applyCommand('formatBlock', e.target.value);
  };

  return (
    <div className="rte-container">
      {/* Main Toolbar */}
      <div className="rte-toolbar-main">
        <div className="rte-toolbar-group">
          <div className="rte-select-wrapper">
            <select className="rte-select" onChange={handleFormatBlock} defaultValue="P">
              <option value="P">Paragraph</option>
              <option value="H1">Heading 1</option>
              <option value="H2">Heading 2</option>
              <option value="H3">Heading 3</option>
              <option value="PRE">Preformatted</option>
            </select>
            <ChevronDown size={14} className="rte-select-icon" />
          </div>
        </div>

        <div className="rte-separator" />

        <div className="rte-toolbar-group">
          <button type="button" className="rte-tool-btn dropdown" title="Text Color" onClick={() => applyCommand('foreColor', '#184f78')}>
            <Baseline size={16} />
            <ChevronDown size={10} className="rte-dropdown-icon" />
          </button>
          <button type="button" className="rte-tool-btn" title="Clear Formatting" onClick={() => applyCommand('removeFormat')}>
            <Eraser size={16} />
          </button>
        </div>

        <div className="rte-separator" />

        <div className="rte-toolbar-group">
          <button type="button" className="rte-tool-btn" title="Bold" onClick={() => applyCommand('bold')}>
            <Bold size={16} />
          </button>
          <button type="button" className="rte-tool-btn" title="Italic" onClick={() => applyCommand('italic')}>
            <Italic size={16} />
          </button>
          <button type="button" className="rte-tool-btn" title="Underline" onClick={() => applyCommand('underline')}>
            <Underline size={16} />
          </button>
          <button type="button" className="rte-tool-btn" title="Strikethrough" onClick={() => applyCommand('strikeThrough')}>
            <Strikethrough size={16} />
          </button>
        </div>

        <div className="rte-separator" />

        <div className="rte-toolbar-group">
          <button type="button" className="rte-tool-btn" title="Align Left" onClick={() => applyCommand('justifyLeft')}>
            <AlignLeft size={16} />
          </button>
          <button type="button" className="rte-tool-btn" title="Align Center" onClick={() => applyCommand('justifyCenter')}>
            <AlignCenter size={16} />
          </button>
          <button type="button" className="rte-tool-btn" title="Align Right" onClick={() => applyCommand('justifyRight')}>
            <AlignRight size={16} />
          </button>
        </div>

        <div className="rte-separator" />

        <div className="rte-toolbar-group">
          <button type="button" className="rte-tool-btn" title="Bullet List" onClick={() => applyCommand('insertUnorderedList')}>
            <List size={16} />
          </button>
          <button type="button" className="rte-tool-btn" title="Numbered List" onClick={() => applyCommand('insertOrderedList')}>
            <ListOrdered size={16} />
          </button>
        </div>

        <div className="rte-separator" />

        <div className="rte-toolbar-group">
          <button type="button" className="rte-tool-btn" title="Link" onClick={() => {
            const url = window.prompt('Enter URL:');
            if (url) applyCommand('createLink', url);
          }}>
            <Link size={16} />
          </button>
          <button type="button" className="rte-tool-btn" title="Insert Image" onClick={() => {
            const url = window.prompt('Enter Image URL:');
            if (url) applyCommand('insertImage', url);
          }}>
            <Image size={16} />
          </button>
        </div>
      </div>

      {/* Editor Area */}
      <div className="rte-editor-area" style={{ minHeight }}>
        <div
          ref={editorRef}
          className="rte-editor-content"
          contentEditable
          suppressContentEditableWarning
          data-placeholder={placeholder}
          onInput={syncValue}
        />
      </div>
    </div>
  );
};
