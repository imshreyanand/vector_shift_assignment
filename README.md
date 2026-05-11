# VectorShift — Frontend Technical Assessment Submission

> Submitted by [Shreya Nand](https://github.com/imshreyanand)

A full-stack visual pipeline builder built with **React** and **FastAPI**, completed as part of the VectorShift Frontend Technical Assessment. The app allows users to design, connect, and validate AI workflows through an interactive drag-and-drop canvas.

---

## Table of Contents

- [Assessment Overview](#assessment-overview)
- [Completed Parts](#completed-parts)
  - [Part 1: Node Abstraction](#part-1-node-abstraction)
  - [Part 2: Styling](#part-2-styling)
  - [Part 3: Text Node Logic](#part-3-text-node-logic)
  - [Part 4: Backend Integration](#part-4-backend-integration)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Frontend](#frontend)
  - [Backend](#backend)
- [API Reference](#api-reference)

---

## Assessment Overview

The assessment was divided into four parts:

| Part | Task | Status |
|------|------|--------|
| 1 | Node Abstraction | ✅ Completed |
| 2 | Styling | ✅ Completed |
| 3 | Text Node Logic (dynamic sizing + variable handles) | ✅ Completed |
| 4 | Backend Integration (pipeline validation + alert) | ✅ Completed |

---

## Completed Parts

### Part 1: Node Abstraction

**Goal:** Eliminate code duplication across node files and create a reusable abstraction that makes adding new nodes fast and consistent.

**Approach:**
- Created a `BaseNode` component that encapsulates shared logic: node container layout, handle rendering, label styling, and connection points.
- Each node type now simply declares its own configuration (title, fields, input/output handles) and delegates rendering to `BaseNode`.
- This makes adding new nodes a matter of defining a config object — no boilerplate rewriting required.

**Five new nodes added to demonstrate the abstraction:**

| Node | Description |
|------|-------------|
| **Transform Node** | Applies a user-defined transformation to input data |
| **Merge Node** | Combines multiple inputs into a single output stream |
| **Filter Node** | Filters data based on a condition expression |
| **Validation Node** | Validates data against a set of user-defined rules |
| **Template Node** | Renders output using a configurable text template |

---

### Part 2: Styling

**Goal:** Apply a cohesive, polished visual design across all components.

**What was styled:**
- Pipeline canvas with a clean, minimal background
- Node cards with consistent typography, spacing, border radius, and colour-coded headers per node type
- Toolbar with clearly labelled, draggable node chips
- Submit button with hover and active states
- Alert/notification styling for pipeline validation results

---

### Part 3: Text Node Logic

**Goal:** Two enhancements to the Text node's text input field.

**1. Dynamic Sizing**

The Text node's width and height grow automatically as the user types, keeping all content visible without manual resizing.

**2. Variable Handle Generation**

When a user types a variable wrapped in double curly braces — e.g., `{{ input }}` or `{{ user_prompt }}` — the Text node automatically creates a new **input Handle** on its left side corresponding to that variable name. Handles update in real time as variables are added or removed from the text.

Example:

```
Text: "Translate {{ text }} from {{ source_lang }} to English."
→ Generates two left-side handles: [text] and [source_lang]
```

---

### Part 4: Backend Integration

**Goal:** Wire the frontend Submit button to the FastAPI backend and display validation results.

**Frontend (`submit.js`):**
- On click, serialises all current nodes and edges from the pipeline store.
- Sends a `POST` request to `/pipelines/parse`.
- On response, triggers a user-friendly alert displaying the results.

**Backend (`main.py`):**
- Receives the nodes and edges payload.
- Computes `num_nodes` and `num_edges`.
- Runs a **DAG check** using depth-first search to detect cycles.
- Returns a structured JSON response.

**Alert shown to the user:**
```
Pipeline Summary
─────────────────
Nodes   : 4
Edges   : 3
Is DAG  : ✅ Yes
```

---

## Tech Stack

### Frontend
| Library | Purpose |
|---------|---------|
| React | UI framework |
| React Flow | Interactive node-based canvas |
| Zustand | Global state management |
| CSS | Component styling |

### Backend
| Library | Purpose |
|---------|---------|
| FastAPI | REST API framework |
| Python 3.x | Runtime |
| Uvicorn | ASGI server |

---

## Project Structure

```
vector_shift_assignment/
│
├── frontend/
│   └── src/
│       ├── nodes/
│       │   ├── baseNode.js          # Shared node abstraction (Part 1)
│       │   ├── inputNode.js
│       │   ├── outputNode.js
│       │   ├── llmNode.js
│       │   ├── textNode.js          # Enhanced in Part 3
│       │   ├── transformNode.js     # New (Part 1)
│       │   ├── mergeNode.js         # New (Part 1)
│       │   ├── filterNode.js        # New (Part 1)
│       │   ├── validationNode.js    # New (Part 1)
│       │   └── templateNode.js      # New (Part 1)
│       ├── store.js                 # Zustand pipeline state
│       ├── toolbar.js               # Draggable node palette
│       ├── ui.js                    # Main canvas
│       ├── submit.js                # Backend integration (Part 4)
│       └── draggableNode.js
│
└── backend/
    ├── main.py                      # FastAPI routes + DAG validation (Part 4)
    └── requirements.txt
```

---

## Getting Started

### Prerequisites

- Node.js v16+ and npm
- Python 3.8+ and pip

### Frontend

```bash
cd frontend
npm install
npm start
```

App runs at `http://localhost:3000`

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

API runs at `http://localhost:8000`

> Both servers must be running at the same time for full functionality.

---

## API Reference

### `POST /pipelines/parse`

Validates a submitted pipeline and checks for DAG compliance.

**Request Body:**
```json
{
  "nodes": [
    { "id": "input-1", "type": "customInput" },
    { "id": "llm-1",   "type": "llm" }
  ],
  "edges": [
    { "source": "input-1", "target": "llm-1" }
  ]
}
```

**Response:**
```json
{
  "num_nodes": 4,
  "num_edges": 3,
  "is_dag": true
}
```

---

*VectorShift Frontend Technical Assessment — All four parts completed.*
