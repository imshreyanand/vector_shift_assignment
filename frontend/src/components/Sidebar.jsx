import React, { useState } from 'react';
import '../App.css';

const PALETTE = [
  {
    section: 'I/O',
    items: [
      { type: 'inputNode',  icon: '📥', name: 'Input',          desc: 'Pipeline entry point',    color: 'var(--node-input)' },
      { type: 'outputNode', icon: '📤', name: 'Output',         desc: 'Pipeline exit point',     color: 'var(--node-output)' },
    ],
  },
  {
    section: 'AI Models',
    items: [
      { type: 'llmNode',   icon: '🤖', name: 'LLM',            desc: 'GPT-4, Claude, Gemini…',  color: 'var(--node-llm)' },
      { type: 'imageNode', icon: '🎨', name: 'Image Gen',       desc: 'DALL·E, SD, Imagen',      color: 'var(--node-image)' },
    ],
  },
  {
    section: 'Data',
    items: [
      { type: 'textNode',        icon: '📝', name: 'Text Template',  desc: 'Prompt with {{vars}}',    color: 'var(--node-text)' },
      { type: 'vectorStoreNode', icon: '🗄️', name: 'Vector Store',   desc: 'Pinecone, Weaviate…',     color: 'var(--accent-cyan)' },
      { type: 'transformNode',   icon: '⚙️', name: 'Transform',      desc: 'Parse, format, convert',  color: 'var(--node-transform)' },
    ],
  },
  {
    section: 'Integration',
    items: [
      { type: 'apiNode',  icon: '🌐', name: 'HTTP Request',    desc: 'REST & GraphQL APIs',     color: 'var(--node-api)' },
      { type: 'codeNode', icon: '</>',name: 'Code Runner',     desc: 'Python, JS, Bash',        color: 'var(--node-code)' },
    ],
  },
];

export default function Sidebar({ onAddNode }) {
  const [search, setSearch] = useState('');

  const filtered = PALETTE.map(section => ({
    ...section,
    items: section.items.filter(
      item =>
        search === '' ||
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.desc.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter(section => section.items.length > 0);

  // Drag start: store node type in dataTransfer
  const onDragStart = (e, nodeType) => {
    e.dataTransfer.setData('application/reactflow', nodeType);
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="sidebar">
      {/* Search */}
      <div className="sidebar-search">
        <div className="search-input-wrap">
          <span className="search-icon">🔍</span>
          <input
            className="search-input"
            placeholder="Search nodes…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              style={{ background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--text-muted)', fontSize: 12, padding: 0 }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Node palette */}
      <div className="sidebar-body">
        {filtered.map(section => (
          <div key={section.section}>
            <div className="sidebar-section-label">{section.section}</div>
            <div className="node-palette">
              {section.items.map(item => (
                <div
                  key={item.type}
                  className="palette-item"
                  draggable
                  onDragStart={e => onDragStart(e, item.type)}
                  onClick={() => onAddNode && onAddNode(item.type)}
                  title={`Drag or click to add ${item.name}`}
                >
                  <div
                    className="palette-item-icon"
                    style={{
                      background: `${item.color}22`,
                      border: `1px solid ${item.color}44`,
                    }}
                  >
                    {item.icon}
                  </div>
                  <div className="palette-item-info">
                    <div className="palette-item-name">{item.name}</div>
                    <div className="palette-item-desc">{item.desc}</div>
                  </div>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                    style={{ color: 'var(--text-muted)', flexShrink: 0 }}>
                    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2"
                      strokeLinecap="round"/>
                  </svg>
                </div>
              ))}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div style={{ padding: '24px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 12 }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>🔍</div>
            No nodes match "<strong style={{ color: 'var(--text-secondary)' }}>{search}</strong>"
          </div>
        )}

        {/* Tip */}
        <div style={{
          margin: '16px 12px 8px',
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '10px 12px',
        }}>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>
            💡 Tip
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Drag nodes onto the canvas or click to place them at center. Connect nodes by dragging from handle to handle.
          </div>
        </div>
      </div>
    </aside>
  );
}
