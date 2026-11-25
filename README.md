# Nethra R — Task Management REST API

RESTful Backend API built with **Node.js**, **Express**, and **SQLite** for **Task 3: REST API & Backend Development** of the **YR NOVATECH** internship.

## Features
- **5 Full CRUD Endpoints** (`GET`, `POST`, `PUT`, `DELETE`) for managing tasks
- **SQLite Database Integration** with automatic schema creation and seed data on startup
- **Input Validation Middleware** validating required fields, string lengths, enum values, and numeric IDs
- **Centralized Error Handling** returning structured JSON errors with appropriate HTTP status codes (`200`, `201`, `400`, `404`, `500`)
- **Built-in API Documentation** available at `GET /api-docs` and detailed in [`API_DOCS.md`](./API_DOCS.md)

## Project Structure
```text
nethra-rest-api/
├── db/
│   └── database.js        # SQLite connection, table schema & initial seed data
├── middleware/
│   └── validate.js        # Request body & ID parameter validation middleware
├── routes/
│   └── tasks.js           # CRUD route handlers for /api/tasks
├── API_DOCS.md            # Complete endpoint documentation & cURL examples
├── package.json           # Project dependencies and scripts
├── README.md              # Project overview, data models, and setup guide
└── server.js              # Express app configuration, /api-docs, and error handlers
```

## Data Model (`tasks` Table)
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `INTEGER` | `PRIMARY KEY AUTOINCREMENT` | Unique task identifier |
| `title` | `TEXT` | `NOT NULL` (min 3 chars) | Task title |
| `description` | `TEXT` | `DEFAULT ''` | Detailed task notes |
| `status` | `TEXT` | `DEFAULT 'pending'` (`pending`, `in-progress`, `completed`) | Current task state |
| `priority` | `TEXT` | `DEFAULT 'medium'` (`low`, `medium`, `high`) | Priority level |
| `created_at` | `DATETIME` | `DEFAULT CURRENT_TIMESTAMP` | Creation timestamp |
| `updated_at` | `DATETIME` | `DEFAULT CURRENT_TIMESTAMP` | Last update timestamp |

## Endpoints Overview
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/tasks` | List all tasks (supports `?status=` and `?priority=` filters) |
| `GET` | `/api/tasks/:id` | Get a single task by ID |
| `POST` | `/api/tasks` | Create a new task |
| `PUT` | `/api/tasks/:id` | Update an existing task by ID |
| `DELETE` | `/api/tasks/:id` | Delete a task by ID |
| `GET` | `/api-docs` | View JSON API specification |

See [`API_DOCS.md`](./API_DOCS.md) for full request/response JSON payloads and `cURL` examples.

## Local Setup & Running
1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Start the server:**
   ```bash
   npm start
   ```
3. **Verify in browser or Postman:**
   - Base Info: `http://localhost:3000/`
   - API Docs: `http://localhost:3000/api-docs`
   - Tasks Endpoint: `http://localhost:3000/api/tasks`
