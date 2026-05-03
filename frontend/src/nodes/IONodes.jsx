import React, { useState } from 'react';
import BaseNode from './BaseNode';

export function InputNode({ id, data, selected }) {
  const [name, setName] = useState(data?.name || 'input_data');
  const [type, setType] = useState(data?.inputType || 'Text');

  return (
    <BaseNode
      accentColor="var(--node-input)"
      icon="📥"
      title={name || 'Input Node'}
      subtitle="Pipeline Input"
      outputs={[{ id: 'value' }]}
      selected={selected}
    >
      <div className="field-row">
        <label className="field-label">Variable Name</label>
        <input
          className="field-input"
          value={name}
          onChange={e => setName(e.target.value.replace(/\s/g, '_'))}
          placeholder="my_input"
        />
      </div>
      <div className="field-row">
        <label className="field-label">Data Type</label>
        <select
          className="field-select"
          value={type}
          onChange={e => setType(e.target.value)}
        >
          {['Text', 'Image', 'File', 'JSON', 'Number', 'Boolean'].map(t => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>
    </BaseNode>
  );
}

export function OutputNode({ id, data, selected }) {
  const [name, setName] = useState(data?.name || 'output_data');
  const [type, setType] = useState(data?.outputType || 'Text');

  return (
    <BaseNode
      accentColor="var(--node-output)"
      icon="📤"
      title={name || 'Output Node'}
      subtitle="Pipeline Output"
      inputs={[{ id: 'value' }]}
      outputs={[]}
      selected={selected}
    >
      <div className="field-row">
        <label className="field-label">Variable Name</label>
        <input
          className="field-input"
          value={name}
          onChange={e => setName(e.target.value.replace(/\s/g, '_'))}
          placeholder="my_output"
        />
      </div>
      <div className="field-row">
        <label className="field-label">Output Type</label>
        <select
          className="field-select"
          value={type}
          onChange={e => setType(e.target.value)}
        >
          {['Text', 'Image', 'File', 'JSON', 'Number'].map(t => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>
    </BaseNode>
  );
}
