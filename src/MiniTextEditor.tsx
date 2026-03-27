import React, { useEffect, useRef, useState } from 'react';
import {
  Bold, Italic, Underline, List, ListOrdered,
  AlignLeft, AlignCenter, AlignRight, Strikethrough,
  Plus, Eraser, Baseline, Highlighter, ChevronDown
} from 'lucide-react';

import './index.css';

export type EditorTool =
  | 'format'
  | 'bold' | 'italic' | 'underline' | 'strike'
  | 'color' | 'highlight' | 'clear'
  | 'align-left' | 'align-center' | 'align-right'
  | 'list' | 'ordered-list';

export interface MiniTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: number;
  tools?: EditorTool[];
}

const DEFAULT_TOOLS: EditorTool[] = [
  'format',
  'color', 'highlight', 'clear',
  'bold', 'italic', 'underline', 'strike',
  'align-left', 'align-center', 'align-right',
  'list', 'ordered-list'
];

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
  tools = DEFAULT_TOOLS,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [activePicker, setActivePicker] = useState<'text' | 'bg' | null>(null);
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
    strike: false,
    list: false,
    orderedList: false,
    alignLeft: false,
    alignCenter: false,
    alignRight: false,
  });

  const textColors = ['#000000', '#ef4444', '#3b82f6', '#22c55e', '#64748b'];
  const bgColors = ['#fef08a', '#bbf7d0', '#bfdbfe', '#fecaca', '#ffffff'];

  const show = (tool: EditorTool) => tools.includes(tool);

  useEffect(() => {
    if (!editorRef.current) return;
    if (editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
    // Initial check
    checkActiveStates();
  }, [value]);

  const checkActiveStates = () => {
    if (!editorRef.current) return;
    setActiveFormats({
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline'),
      strike: document.queryCommandState('strikeThrough'),
      list: document.queryCommandState('insertUnorderedList'),
      orderedList: document.queryCommandState('insertOrderedList'),
      alignLeft: document.queryCommandState('justifyLeft'),
      alignCenter: document.queryCommandState('justifyCenter'),
      alignRight: document.queryCommandState('justifyRight'),
    });
  };

  const syncValue = () => {
    if (!editorRef.current) return;
    onChange(editorRef.current.innerHTML);
  };

  const applyCommand = (command: string, arg: string = '') => {
    editorRef.current?.focus();
    document.execCommand(command, false, arg);
    syncValue();
    checkActiveStates();
    setActivePicker(null);
  };

  const handleFormatBlock = (e: React.ChangeEvent<HTMLSelectElement>) => {
    applyCommand('formatBlock', e.target.value);
  };

  return (
    <div className="rte-container" onMouseLeave={() => setActivePicker(null)}>
      {/* Main Toolbar */}
      <div className="rte-toolbar-main">
        {show('format') && (
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
        )}

        {show('format') && (show('color') || show('highlight') || show('clear')) && <div className="rte-separator" />}

        {(show('color') || show('highlight') || show('clear')) && (
          <div className="rte-toolbar-group">
            {show('color') && (
              <div style={{ position: 'relative' }}>
                <button
                  type="button"
                  className={`rte-tool-btn dropdown ${activePicker === 'text' ? 'active' : ''}`}
                  title="Text Color"
                  onClick={() => setActivePicker(activePicker === 'text' ? null : 'text')}
                >
                  <Baseline size={16} />
                  <ChevronDown size={10} className="rte-dropdown-icon" />
                </button>
                {activePicker === 'text' && (
                  <div className="rte-color-picker">
                    {textColors.map(color => (
                      <div
                        key={color}
                        className="rte-color-swatch"
                        style={{ background: color }}
                        onClick={() => applyCommand('foreColor', color)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {show('highlight') && (
              <div style={{ position: 'relative' }}>
                <button
                  type="button"
                  className={`rte-tool-btn dropdown ${activePicker === 'bg' ? 'active' : ''}`}
                  title="Background Color"
                  onClick={() => setActivePicker(activePicker === 'bg' ? null : 'bg')}
                >
                  <Highlighter size={16} />
                  <ChevronDown size={10} className="rte-dropdown-icon" />
                </button>
                {activePicker === 'bg' && (
                  <div className="rte-color-picker">
                    {bgColors.map(color => (
                      <div
                        key={color}
                        className="rte-color-swatch"
                        style={{ background: color, border: color === '#ffffff' ? '1px solid #e2e8f0' : 'none' }}
                        onClick={() => applyCommand('hiliteColor', color)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {show('clear') && (
              <button type="button" className="rte-tool-btn" title="Clear Formatting" onClick={() => applyCommand('removeFormat')}>
                <Eraser size={16} />
              </button>
            )}
          </div>
        )}

        {(show('color') || show('highlight') || show('clear')) && (show('bold') || show('italic') || show('underline') || show('strike')) && <div className="rte-separator" />}

        {(show('bold') || show('italic') || show('underline') || show('strike')) && (
          <div className="rte-toolbar-group">
            {show('bold') && (
              <button 
                type="button" 
                className={`rte-tool-btn ${activeFormats.bold ? 'active' : ''}`} 
                title="Bold" 
                onClick={() => applyCommand('bold')}
              >
                <Bold size={16} />
              </button>
            )}
            {show('italic') && (
              <button 
                type="button" 
                className={`rte-tool-btn ${activeFormats.italic ? 'active' : ''}`} 
                title="Italic" 
                onClick={() => applyCommand('italic')}
              >
                <Italic size={16} />
              </button>
            )}
            {show('underline') && (
              <button 
                type="button" 
                className={`rte-tool-btn ${activeFormats.underline ? 'active' : ''}`} 
                title="Underline" 
                onClick={() => applyCommand('underline')}
              >
                <Underline size={16} />
              </button>
            )}
            {show('strike') && (
              <button 
                type="button" 
                className={`rte-tool-btn ${activeFormats.strike ? 'active' : ''}`} 
                title="Strikethrough" 
                onClick={() => applyCommand('strikeThrough')}
              >
                <Strikethrough size={16} />
              </button>
            )}
          </div>
        )}

        {(show('bold') || show('italic') || show('underline') || show('strike')) && (show('align-left') || show('align-center') || show('align-right')) && <div className="rte-separator" />}

        {(show('align-left') || show('align-center') || show('align-right')) && (
          <div className="rte-toolbar-group">
            {show('align-left') && (
              <button 
                type="button" 
                className={`rte-tool-btn ${activeFormats.alignLeft ? 'active' : ''}`} 
                title="Align Left" 
                onClick={() => applyCommand('justifyLeft')}
              >
                <AlignLeft size={16} />
              </button>
            )}
            {show('align-center') && (
              <button 
                type="button" 
                className={`rte-tool-btn ${activeFormats.alignCenter ? 'active' : ''}`} 
                title="Align Center" 
                onClick={() => applyCommand('justifyCenter')}
              >
                <AlignCenter size={16} />
              </button>
            )}
            {show('align-right') && (
              <button 
                type="button" 
                className={`rte-tool-btn ${activeFormats.alignRight ? 'active' : ''}`} 
                title="Align Right" 
                onClick={() => applyCommand('justifyRight')}
              >
                <AlignRight size={16} />
              </button>
            )}
          </div>
        )}

        {(show('align-left') || show('align-center') || show('align-right')) && (show('list') || show('ordered-list')) && <div className="rte-separator" />}

        {(show('list') || show('ordered-list')) && (
          <div className="rte-toolbar-group">
            {show('list') && (
              <button 
                type="button" 
                className={`rte-tool-btn ${activeFormats.list ? 'active' : ''}`} 
                title="Bullet List" 
                onClick={() => applyCommand('insertUnorderedList')}
              >
                <List size={16} />
              </button>
            )}
            {show('ordered-list') && (
              <button 
                type="button" 
                className={`rte-tool-btn ${activeFormats.orderedList ? 'active' : ''}`} 
                title="Numbered List" 
                onClick={() => applyCommand('insertOrderedList')}
              >
                <ListOrdered size={16} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Editor Area */}
      <div className="rte-editor-area" style={{ minHeight }}>
        <div
          ref={editorRef}
          className="rte-editor-content"
          contentEditable
          suppressContentEditableWarning
          data-placeholder={placeholder}
          onInput={() => {
            syncValue();
            checkActiveStates();
          }}
          onSelect={checkActiveStates}
          onKeyUp={checkActiveStates}
          onMouseUp={checkActiveStates}
          onPaste={(e) => {
            const text = e.clipboardData.getData('text/plain');
            if (!text) return;

            try {
              // Basic check if it looks like a URL
              const url = new URL(text.trim());
              // Check if it's http or https
              if (url.protocol !== 'http:' && url.protocol !== 'https:') {
                return; // Let default paste handle it
              }

              e.preventDefault();
              const domain = url.hostname.replace(/^www\./, '');
              const linkHtml = `<a href="${url.href}" title="${url.href}" target="_blank" rel="noopener noreferrer" style="color: #2563eb; text-decoration: underline;">${domain}</a>&nbsp;`;

              document.execCommand('insertHTML', false, linkHtml);
              syncValue();
            } catch (err) {
              // Not a valid URL, let default paste happen
              return;
            }
          }}
        />
      </div>
    </div>
  );
};
