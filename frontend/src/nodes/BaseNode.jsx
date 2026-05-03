// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Handle, Position } from 'reactflow';
import './BaseNode.css';

/**
 * BaseNode – reusable shell for all node types.
 *
 * Props:
 *  - accentColor   : CSS color string for the top stripe & icon bg
 *  - icon          : emoji or string for the node icon
 *  - title         : main node name
 *  - subtitle      : category label
 *  - inputs        : array of { id, label, position? }
 *  - outputs       : array of { id, label, position? }
 *  - selected      : boolean (injected by ReactFlow)
 *  - children      : node body content
 *  - showStatus    : show green status dot
 */
export default function BaseNode({
  accentColor = 'var(--accent-violet)',
  icon = '⚡',
  title = 'Node',
  subtitle = 'Component',
  inputs = [],
  outputs = [],
  selected,
  children,
  showStatus = true,
  tokenCount = null,
}) {
  return (
    <div
      className={`base-node${selected ? ' selected' : ''}`}
      style={{ position: 'relative', '--node-accent': accentColor }}
    >
      {/* Top accent stripe */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 12,
        right: 12,
        height: 2,
        borderRadius: '0 0 2px 2px',
        background: accentColor,
        opacity: 0.9,
      }} />

      {/* Input handles */}
      {inputs.map((inp, i) => {
        return (
          <div key={inp.id} style={{ position: 'relative' }}>
          </div>
        );
      })}

      {/* Header */}
      <div className="node-header">
        <div
          className="node-icon"
          style={{ background: `${accentColor}22`, border: `1px solid ${accentColor}44` }}
        >
          {icon}
        </div>
        <div className="node-title-wrap">
          <div className="node-title">{title}</div>
          <div className="node-subtitle">{subtitle}</div>
        </div>
        {showStatus && <div className="node-status-dot" />}
      </div>

      {/* Body */}
      <div className="node-body">{children}</div>

      {/* Token count footer */}
      {tokenCount !== null && (
        <>
          <div className="node-divider" />
          <div className="token-bar">
            <span className="token-label">Tokens</span>
            <span className="token-value">~{tokenCount}</span>
          </div>
        </>
      )}

      {/* Input handles (properly positioned) */}
      {inputs.map((inp, i) => {
        const totalInputs = inputs.length;
        const topPct = totalInputs === 1
          ? 50
          : 25 + (i / Math.max(totalInputs - 1, 1)) * 50;
        return (
          <Handle
            key={`in-${inp.id}`}
            type="target"
            position={Position.Left}
            id={inp.id}
            style={{ top: `${topPct}%` }}
          />
        );
      })}

      {/* Output handles */}
      {outputs.map((out, i) => {
        const totalOutputs = outputs.length;
        const topPct = totalOutputs === 1
          ? 50
          : 25 + (i / Math.max(totalOutputs - 1, 1)) * 50;
        return (
          <Handle
            key={`out-${out.id}`}
            type="source"
            position={Position.Right}
            id={out.id}
            style={{ top: `${topPct}%` }}
          />
        );
      })}
    </div>
  );
}
