import React, { useState } from 'react';
import BaseNode from './BaseNode';

export function TransformNode({ id, data, selected }) {
  const [operation, setOperation] = useState(data?.operation || 'JSON Parse');

  return (
    <BaseNode
      accentColor="var(--node-transform)"
      icon="⚙️"
      title="Transform"
      subtitle="Data Transform"
      inputs={[{ id: 'input' }]}
      outputs={[{ id: 'output' }]}
      selected={selected}
    >
      <div className="field-row">
        <label className="field-label">Operation</label>
        <select className="field-select" value={operation} onChange={e => setOperation(e.target.value)}>
          {['JSON Parse', 'JSON Stringify', 'To Uppercase', 'To Lowercase', 'Trim', 'Split Lines', 'Base64 Encode', 'Base64 Decode', 'URL Encode'].map(op => (
            <option key={op}>{op}</option>
          ))}
        </select>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
        <div style={{
          width: 6, height: 6, borderRadius: '50%',
          background: 'var(--accent-amber)',
          boxShadow: '0 0 6px var(--accent-amber)',
        }} />
        <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Stateless transform</span>
      </div>
    </BaseNode>
  );
}

export function ImageNode({ id, data, selected }) {
  const [model, setModel] = useState(data?.model || 'dall-e-3');
  const [size, setSize] = useState(data?.size || '1024×1024');
  const [quality, setQuality] = useState(data?.quality || 'standard');

  return (
    <BaseNode
      accentColor="var(--node-image)"
      icon="🎨"
      title="Image Generator"
      subtitle="Vision Model"
      inputs={[{ id: 'prompt' }]}
      outputs={[{ id: 'image_url' }, { id: 'b64_json' }]}
      selected={selected}
    >
      <div className="field-row">
        <label className="field-label">Model</label>
        <select className="field-select" value={model} onChange={e => setModel(e.target.value)}>
          {['dall-e-3', 'dall-e-2', 'stable-diffusion-xl', 'midjourney-v6', 'imagen-3'].map(m => (
            <option key={m}>{m}</option>
          ))}
        </select>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <div className="field-row">
          <label className="field-label">Size</label>
          <select className="field-select" value={size} onChange={e => setSize(e.target.value)}>
            {['256×256', '512×512', '1024×1024', '1024×1792', '1792×1024'].map(s => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className="field-row">
          <label className="field-label">Quality</label>
          <select className="field-select" value={quality} onChange={e => setQuality(e.target.value)}>
            {['standard', 'hd'].map(q => <option key={q}>{q}</option>)}
          </select>
        </div>
      </div>
    </BaseNode>
  );
}

export function APINode({ id, data, selected }) {
  const [url, setUrl] = useState(data?.url || 'https://api.example.com/v1/');
  const [method, setMethod] = useState(data?.method || 'POST');

  return (
    <BaseNode
      accentColor="var(--node-api)"
      icon="🌐"
      title="HTTP Request"
      subtitle="API Connector"
      inputs={[{ id: 'body' }, { id: 'headers' }]}
      outputs={[{ id: 'response' }, { id: 'status' }]}
      selected={selected}
    >
      <div className="field-row">
        <label className="field-label">Method</label>
        <select className="field-select" value={method} onChange={e => setMethod(e.target.value)}>
          {['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].map(m => (
            <option key={m}>{m}</option>
          ))}
        </select>
      </div>
      <div className="field-row">
        <label className="field-label">Endpoint URL</label>
        <input
          className="field-input"
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="https://api.example.com/..."
          style={{ fontFamily: 'var(--font-mono)', fontSize: 10 }}
        />
      </div>
    </BaseNode>
  );
}

export function CodeNode({ id, data, selected }) {
  const [lang, setLang] = useState(data?.lang || 'Python');
  const [code, setCode] = useState(data?.code || '# Access inputs as variables\nresult = input_text.upper()\nreturn result');

  return (
    <BaseNode
      accentColor="var(--node-code)"
      icon="</>"
      title="Code Runner"
      subtitle="Custom Script"
      inputs={[{ id: 'input_text' }]}
      outputs={[{ id: 'result' }]}
      selected={selected}
    >
      <div className="field-row">
        <label className="field-label">Language</label>
        <select className="field-select" value={lang} onChange={e => setLang(e.target.value)}>
          {['Python', 'JavaScript', 'TypeScript', 'Bash'].map(l => (
            <option key={l}>{l}</option>
          ))}
        </select>
      </div>
      <div className="field-row">
        <label className="field-label">Code</label>
        <textarea
          className="field-textarea"
          value={code}
          onChange={e => setCode(e.target.value)}
          rows={5}
          spellCheck={false}
        />
      </div>
    </BaseNode>
  );
}

export function VectorStoreNode({ id, data, selected }) {
  const [store, setStore] = useState(data?.store || 'Pinecone');
  const [operation, setOperation] = useState(data?.operation || 'Similarity Search');
  const [topK, setTopK] = useState(data?.topK || 5);

  return (
    <BaseNode
      accentColor="var(--accent-cyan)"
      icon="🗄️"
      title="Vector Store"
      subtitle="Embeddings DB"
      inputs={[{ id: 'query' }, { id: 'documents' }]}
      outputs={[{ id: 'results' }, { id: 'scores' }]}
      selected={selected}
    >
      <div className="field-row">
        <label className="field-label">Provider</label>
        <select className="field-select" value={store} onChange={e => setStore(e.target.value)}>
          {['Pinecone', 'Weaviate', 'Qdrant', 'Chroma', 'pgvector', 'Milvus'].map(s => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>
      <div className="field-row">
        <label className="field-label">Operation</label>
        <select className="field-select" value={operation} onChange={e => setOperation(e.target.value)}>
          {['Similarity Search', 'Upsert', 'Delete', 'Fetch'].map(op => (
            <option key={op}>{op}</option>
          ))}
        </select>
      </div>
      <div className="field-row">
        <label className="field-label">Top-K Results</label>
        <input
          className="field-input"
          type="number" min="1" max="100"
          value={topK}
          onChange={e => setTopK(parseInt(e.target.value) || 5)}
        />
      </div>
    </BaseNode>
  );
}
