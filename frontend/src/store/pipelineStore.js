/**
 * pipelineStore.js
 * Zustand-style state management via React useState/useCallback
 * Exported as a simple hook so we don't need an extra library.
 */

import { useState, useCallback } from 'react';
import { addEdge, applyNodeChanges, applyEdgeChanges } from 'reactflow';

// ── DAG validation ──────────────────────────────────────────────────────────

/**
 * Returns true if the graph (nodes + edges) is a valid DAG (no cycles).
 * Uses DFS-based cycle detection.
 */
export function isDAG(nodes, edges) {
  const adj = {};
  nodes.forEach(n => { adj[n.id] = []; });
  edges.forEach(e => {
    if (adj[e.source]) adj[e.source].push(e.target);
  });

  const visited = new Set();
  const inStack = new Set();

  function dfs(nodeId) {
    if (inStack.has(nodeId)) return false; // cycle detected
    if (visited.has(nodeId)) return true;
    visited.add(nodeId);
    inStack.add(nodeId);
    for (const neighbor of (adj[nodeId] || [])) {
      if (!dfs(neighbor)) return false;
    }
    inStack.delete(nodeId);
    return true;
  }

  for (const node of nodes) {
    if (!visited.has(node.id)) {
      if (!dfs(node.id)) return false;
    }
  }
  return true;
}

// ── Pipeline hook ────────────────────────────────────────────────────────────

let nodeCounter = 1;

export function usePipelineStore() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  const onNodesChange = useCallback(
    changes => setNodes(nds => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    changes => setEdges(eds => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    connection =>
      setEdges(eds =>
        addEdge({ ...connection, animated: true, style: { stroke: 'var(--accent-violet-light)' } }, eds)
      ),
    []
  );

  /** Add a new node of the given type at position {x, y} */
  const addNode = useCallback((type, position = { x: 300, y: 200 }) => {
    const id = `${type}-${nodeCounter++}`;
    setNodes(nds => [
      ...nds,
      {
        id,
        type,
        position,
        data: { label: id },
      },
    ]);
    return id;
  }, []);

  /** Delete selected nodes/edges */
  const deleteSelected = useCallback(() => {
    setNodes(nds => nds.filter(n => !n.selected));
    setEdges(eds => eds.filter(e => !e.selected));
  }, []);

  /** Clear the entire canvas */
  const clearAll = useCallback(() => {
    setNodes([]);
    setEdges([]);
  }, []);

  return {
    nodes, edges,
    onNodesChange, onEdgesChange, onConnect,
    addNode, deleteSelected, clearAll,
  };
}
