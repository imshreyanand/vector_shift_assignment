// draggableNode.js

export const DraggableNode = ({ type, label }) => {
    const onDragStart = (event, nodeType) => {
      const appData = { nodeType }
      event.target.style.cursor = 'grabbing';
      event.dataTransfer.setData('application/reactflow', JSON.stringify(appData));
      event.dataTransfer.effectAllowed = 'move';
    };
  
    return (
      <div
        className={`draggable-node ${type}`}
        onDragStart={(event) => onDragStart(event, type)}
        onDragEnd={(event) => (event.target.style.cursor = 'grab')}
        style={{ 
          cursor: 'grab', 
          minWidth: '100px', 
          height: '60px',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          flexDirection: 'column',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--bg-elevated)',
          border: '1px solid var(--border-mid)',
          boxShadow: 'var(--shadow-sm)',
          transition: 'all 0.2s ease',
          userSelect: 'none',
        }} 
        onMouseOver={e => {
            e.currentTarget.style.borderColor = 'var(--accent-violet)';
            e.currentTarget.style.boxShadow = 'var(--shadow-glow-violet)';
            e.currentTarget.style.transform = 'translateY(-2px)';
        }}
        onMouseOut={e => {
            e.currentTarget.style.borderColor = 'var(--border-mid)';
            e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
            e.currentTarget.style.transform = 'none';
        }}
        draggable
      >
          <span style={{ color: 'var(--text-primary)', fontSize: '12px', fontWeight: 600, letterSpacing: '0.3px' }}>{label}</span>
      </div>
    );
  };
  