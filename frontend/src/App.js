import React, { useCallback, useRef, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';
import './App.css';

import Sidebar from './components/Sidebar';
import { InputNode, OutputNode }  from './nodes/IONodes';
import { LLMNode, TextNode }      from './nodes/LLMNodes';
import {
  TransformNode, ImageNode, APINode,
  CodeNode, VectorStoreNode,
} from './nodes/UtilNodes';
import { usePipelineStore, isDAG } from './store/pipelineStore';

// ── Register custom node types ───────────────────────────────────────────────
const nodeTypes = {
  inputNode:       InputNode,
  outputNode:      OutputNode,
  llmNode:         LLMNode,
  textNode:        TextNode,
  transformNode:   TransformNode,
  imageNode:       ImageNode,
  apiNode:         APINode,
  codeNode:        CodeNode,
  vectorStoreNode: VectorStoreNode,
};

// ── Default viewport ──────────────────────────────────────────────────────────
const defaultViewport = { x: 80, y: 80, zoom: 0.9 };

// ── Result modal ─────────────────────────────────────────────────────────────
function ResultModal({ result, onClose }) {
  const dag = result.isDAG;
  return (
    <div className="result-overlay" onClick={onClose}>
      <div className="result-modal" onClick={e => e.stopPropagation()}>
        <h2>Pipeline Analysis</h2>
        <p>
          Submitted your pipeline for validation. Here's a summary of the
          graph structure and component counts.
        </p>

        <div className="result-grid">
          <div className="result-stat">
            <div className="result-stat-value">{result.nodes}</div>
            <div className="result-stat-label">Nodes</div>
          </div>
          <div className="result-stat">
            <div className="result-stat-value">{result.edges}</div>
            <div className="result-stat-label">Edges</div>
          </div>
        </div>

        <div className="result-dag-label">Graph Type</div>
        <div className={`result-dag-badge ${dag ? 'dag-yes' : 'dag-no'}`}>
          {dag ? '✅' : '❌'} {dag ? 'Valid DAG — No Cycles Detected' : 'Invalid — Cycle Detected!'}
        </div>

        <button className="btn btn-primary" style={{ width: '100%' }} onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [pipelineName, setPipelineName] = useState('My AI Pipeline');
  const [result, setResult] = useState(null);

  const {
    nodes, edges,
    onNodesChange, onEdgesChange, onConnect,
    addNode, deleteSelected, clearAll,
  } = usePipelineStore();

  // ── Drop handler ────────────────────────────────────────────────────────────
  const onDrop = useCallback(
    e => {
      e.preventDefault();
      const type = e.dataTransfer.getData('application/reactflow');
      if (!type || !reactFlowInstance) return;

      const bounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = reactFlowInstance.project({
        x: e.clientX - bounds.left,
        y: e.clientY - bounds.top,
      });
      addNode(type, position);
    },
    [reactFlowInstance, addNode]
  );

  const onDragOver = useCallback(e => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  // ── Sidebar click → place at center ─────────────────────────────────────────
  const handleAddNode = useCallback(
    type => {
      if (!reactFlowInstance) {
        addNode(type, { x: 200 + Math.random() * 300, y: 150 + Math.random() * 200 });
        return;
      }
      const { x, y, zoom } = reactFlowInstance.getViewport();
      const wrapEl = reactFlowWrapper.current;
      const cx = (wrapEl.clientWidth  / 2 - x) / zoom;
      const cy = (wrapEl.clientHeight / 2 - y) / zoom;
      addNode(type, {
        x: cx - 110 + (Math.random() - 0.5) * 120,
        y: cy - 80  + (Math.random() - 0.5) * 100,
      });
    },
    [reactFlowInstance, addNode]
  );

  // ── Submit pipeline ──────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:8000/pipelines/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodes, edges })
      });
      const data = await response.json();
      
      setResult({
        nodes: data.num_nodes,
        edges: data.num_edges,
        isDAG: data.is_dag,
      });
      
      // The instructions also mention: "create an alert that triggers when the frontend receives a response"
      alert(`Pipeline Parsed Successfully!\n\nNodes: ${data.num_nodes}\nEdges: ${data.num_edges}\nIs DAG: ${data.is_dag ? 'Yes' : 'No'}`);
    } catch (err) {
      console.error('Submit error:', err);
      alert('Failed to submit pipeline to backend. Please ensure the backend is running on port 8000.');
    }
  };

  // ── Keyboard shortcuts ───────────────────────────────────────────────────────
  const onKeyDown = useCallback(
    e => {
      if ((e.key === 'Delete' || e.key === 'Backspace') &&
          document.activeElement.tagName !== 'INPUT' &&
          document.activeElement.tagName !== 'TEXTAREA' &&
          document.activeElement.tagName !== 'SELECT') {
        deleteSelected();
      }
    },
    [deleteSelected]
  );

  return (
    <div className="app-shell" onKeyDown={onKeyDown} tabIndex={-1}>

      {/* ── Top Bar ─────────────────────────────────────────────────────────── */}
      <header className="topbar">
        {/* Logo */}
        <a className="topbar-logo" href="/" style={{ textDecoration: 'none' }}>
          <div className="topbar-logo-icon">⚡</div>
          <span className="topbar-logo-name">VectorShift</span>
          <span className="topbar-logo-badge">Beta</span>
        </a>

        {/* Pipeline name */}
        <div className="topbar-pipeline-name">
          <span className="topbar-pipeline-icon">✏️</span>
          <input
            value={pipelineName}
            onChange={e => setPipelineName(e.target.value)}
            placeholder="Untitled Pipeline"
          />
        </div>

        {/* Actions */}
        <div className="topbar-actions">
          <button
            className="btn btn-ghost"
            onClick={clearAll}
            title="Clear canvas"
          >
            🗑 Clear
          </button>
          <button
            className="btn btn-ghost"
            onClick={deleteSelected}
            title="Delete selected (Del)"
          >
            ✂ Delete
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            title="Validate & submit pipeline"
          >
            ▶ Submit Pipeline
          </button>
        </div>
      </header>

      {/* ── Workspace ─────────────────────────────────────────────────────────── */}
      <div className="workspace">

        {/* Sidebar */}
        <Sidebar onAddNode={handleAddNode} />

        {/* Canvas */}
        <div
          className="canvas-wrap"
          ref={reactFlowWrapper}
          onDrop={onDrop}
          onDragOver={onDragOver}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            onInit={setReactFlowInstance}
            defaultViewport={defaultViewport}
            fitView={false}
            deleteKeyCode={null}         /* we handle Delete ourselves */
            multiSelectionKeyCode="Shift"
            selectionOnDrag
            panOnScroll
            zoomOnScroll={false}
            zoomOnPinch
            snapToGrid
            snapGrid={[12, 12]}
            attributionPosition="bottom-right"
          >
            <Background
              variant={BackgroundVariant.Dots}
              gap={24}
              size={1.5}
              color="rgba(255,255,255,0.07)"
            />
            <Controls showInteractive={false} />
            <MiniMap
              nodeColor={n => {
                const map = {
                  inputNode:       'var(--node-input)',
                  outputNode:      'var(--node-output)',
                  llmNode:         'var(--node-llm)',
                  textNode:        'var(--node-text)',
                  transformNode:   'var(--node-transform)',
                  imageNode:       'var(--node-image)',
                  apiNode:         'var(--node-api)',
                  codeNode:        'var(--node-code)',
                  vectorStoreNode: 'var(--accent-cyan)',
                };
                return map[n.type] || '#555';
              }}
              maskColor="rgba(8,8,16,0.7)"
              position="bottom-right"
            />

            {/* Empty state */}
            {nodes.length === 0 && (
              <Panel position="top-center" style={{ marginTop: 120 }}>
                <div style={{
                  textAlign: 'center',
                  pointerEvents: 'none',
                  animation: 'fadeIn 0.5s ease',
                }}>
                  <div style={{ fontSize: 56, marginBottom: 16, filter: 'drop-shadow(0 0 20px rgba(124,58,237,0.4))' }}>
                    ⚡
                  </div>
                  <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
                    Build your AI Pipeline
                  </h2>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', maxWidth: 360, lineHeight: 1.6 }}>
                    Drag nodes from the left sidebar onto this canvas, then connect them to build powerful AI workflows.
                  </p>
                </div>
              </Panel>
            )}
          </ReactFlow>

          {/* Canvas hint */}
          {nodes.length === 0 && (
            <div className="canvas-hint">
              <span>Drag</span> a node from the sidebar · <span>Scroll</span> to pan · <span>Pinch</span> to zoom
            </div>
          )}
        </div>
      </div>

      {/* ── Bottom Bar ─────────────────────────────────────────────────────────── */}
      <footer className="bottombar">
        <div className="bottombar-stats">
          <div className="stat-item">
            <span>Nodes:</span>
            <span className="stat-value">{nodes.length}</span>
          </div>
          <div className="stat-item">
            <span>Edges:</span>
            <span className="stat-value">{edges.length}</span>
          </div>
          <div className="stat-item">
            <span>DAG:</span>
            <span className="stat-value" style={{
              color: nodes.length === 0
                ? 'var(--text-muted)'
                : isDAG(nodes, edges)
                  ? 'var(--accent-green)'
                  : 'var(--accent-red)',
            }}>
              {nodes.length === 0 ? '—' : isDAG(nodes, edges) ? 'Valid ✓' : 'Cycle ✗'}
            </span>
          </div>
        </div>

        <div className="bottombar-status">
          <div className="status-dot" />
          <span>Ready · {pipelineName}</span>
        </div>
      </footer>

      {/* ── Submit Result Modal ────────────────────────────────────────────────── */}
      {result && (
        <ResultModal result={result} onClose={() => setResult(null)} />
      )}
    </div>
  );
}
