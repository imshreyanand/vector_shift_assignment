from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get('/')
def read_root():
    return {'Ping': 'Pong'}

@app.post('/pipelines/parse')
async def parse_pipeline(request: Request):
    try:
        data = await request.json()
        nodes = data.get('nodes', [])
        edges = data.get('edges', [])
    except:
        return {"error": "Invalid JSON"}

    num_nodes = len(nodes)
    num_edges = len(edges)

    # Adjacency list for cycle detection
    adj_list = {node['id']: [] for node in nodes}
    for edge in edges:
        source = edge.get('source')
        target = edge.get('target')
        if source in adj_list:
            adj_list[source].append(target)

    # DFS to check for cycles
    visited = {}
    def is_cyclic(node_id):
        if visited.get(node_id) == 'visiting':
            return True
        if visited.get(node_id) == 'visited':
            return False

        visited[node_id] = 'visiting'
        for neighbor in adj_list.get(node_id, []):
            if is_cyclic(neighbor):
                return True
        visited[node_id] = 'visited'
        return False

    is_dag = True
    for node in nodes:
        if visited.get(node['id']) != 'visited':
            if is_cyclic(node['id']):
                is_dag = False
                break

    return {'num_nodes': num_nodes, 'num_edges': num_edges, 'is_dag': is_dag}
