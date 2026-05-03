import React, { useState, useEffect, useRef } from 'react';
import BaseNode from './BaseNode';

// Extracts {{ variable }} references from text
function extractVariables(text) {
  const matches = [...text.matchAll(/\{\{\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*\}\}/g)];
  return [...new Set(matches.map(m => m[1]))];
}

export function LLMNode({ id, data, selected }) {
  const [model, setModel] = useState(data?.model || 'gpt-4o');
  const [temperature, setTemperature] = useState(data?.temperature ?? 0.7);
  const [maxTokens, setMaxTokens] = useState(data?.maxTokens || 2048);

  return (
    <BaseNode
      accentColor="var(--node-llm)"
      icon="🤖"
      title="LLM"
      subtitle="Language Model"
      inputs={[
        { id: 'system_prompt' },
        { id: 'user_prompt' },
      ]}
      outputs={[{ id: 'response' }]}
      selected={selected}
      tokenCount={maxTokens}
    >
      <div className="field-row">
        <label className="field-label">Model</label>
        <select className="field-select" value={model} onChange={e => setModel(e.target.value)}>
          {['gpt-4o', 'gpt-4-turbo', 'gpt-3.5-turbo', 'claude-3-opus', 'claude-3-sonnet', 'gemini-1.5-pro', 'llama-3-70b', 'mistral-large'].map(m => (
            <option key={m}>{m}</option>
          ))}
        </select>
      </div>
      <div className="field-row">
        <label className="field-label">Temperature — {temperature}</label>
        <input
          type="range" min="0" max="2" step="0.1"
          value={temperature}
          onChange={e => setTemperature(parseFloat(e.target.value))}
          style={{ width: '100%', accentColor: 'var(--node-llm)' }}
        />
      </div>
      <div className="field-row">
        <label className="field-label">Max Output Tokens</label>
        <input
          className="field-input"
          type="number" min="64" max="128000" step="64"
          value={maxTokens}
          onChange={e => setMaxTokens(parseInt(e.target.value) || 2048)}
        />
      </div>
    </BaseNode>
  );
}

export function TextNode({ id, data, selected }) {
  const [text, setText] = useState(data?.text || 'Hello, {{name}}! Today is {{date}}.');
  const variables = extractVariables(text);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      // Reset dimensions to calculate true scroll size
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      
      // Calculate width based on line lengths (rudimentary approach)
      const lines = text.split('\n');
      const maxLineLength = Math.max(...lines.map(l => l.length));
      const newWidth = Math.max(200, Math.min(maxLineLength * 8, 500));
      textareaRef.current.style.width = `${newWidth}px`;
    }
  }, [text]);

  return (
    <BaseNode
      accentColor="var(--node-text)"
      icon="📝"
      title="Text Template"
      subtitle="Prompt Builder"
      inputs={variables.map(v => ({ id: v }))}
      outputs={[{ id: 'output' }]}
      selected={selected}
    >
      <div className="field-row">
        <label className="field-label">Template  <span style={{color:'var(--accent-violet-light)',fontWeight:400}}>  use {'{{var}}'} syntax</span></label>
        <textarea
          ref={textareaRef}
          className="field-textarea"
          value={text}
          onChange={e => setText(e.target.value)}
          rows={1}
          placeholder="Enter your prompt template..."
          style={{ overflow: 'hidden', resize: 'none' }}
        />
      </div>
      {variables.length > 0 && (
        <div className="field-row">
          <label className="field-label">Detected Variables</label>
          <div className="variable-chips">
            {variables.map(v => (
              <span key={v} className="variable-chip">{'{'}{'{'+v+'}}'}</span>
            ))}
          </div>
        </div>
      )}
    </BaseNode>
  );
}
