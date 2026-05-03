// submit.js

import { useStore } from './store';
import { shallow } from 'zustand/shallow';

const selector = (state) => ({
    nodes: state.nodes,
    edges: state.edges,
});

export const SubmitButton = () => {
    const { nodes, edges } = useStore(selector, shallow);

    const handleSubmit = async () => {
        try {
            const response = await fetch('http://localhost:8000/pipelines/parse', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nodes, edges })
            });

            const data = await response.json();
            
            alert(`Pipeline Parsed Successfully!\n\nNodes: ${data.num_nodes}\nEdges: ${data.num_edges}\nIs DAG: ${data.is_dag ? 'Yes' : 'No'}`);
        } catch (error) {
            console.error('Failed to submit pipeline', error);
            alert('Failed to submit pipeline. Is the backend running?');
        }
    };

    return (
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px'}}>
            <button 
                type="button" 
                onClick={handleSubmit}
                style={{
                    background: 'var(--grad-brand)',
                    color: 'var(--text-primary)',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    padding: '10px 24px',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'all 0.2s ease',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                }}
                onMouseOver={e => e.currentTarget.style.boxShadow = 'var(--shadow-glow-violet)'}
                onMouseOut={e => e.currentTarget.style.boxShadow = 'var(--shadow-sm)'}
            >
                Submit Pipeline
            </button>
        </div>
    );
}
