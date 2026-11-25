# API Documentation — Task Management REST API

**Base URL:** `http://localhost:3000/api` (or your deployed Render / Railway URL)  
**Interactive JSON Spec:** `GET /api-docs`  
**Content-Type:** `application/json`

---

## 1. Data Model (`tasks` Table — SQLite)

| Field | Type | Constraints | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `INTEGER` | Primary Key, Auto-Increment | Auto | Unique identifier for each task |
| `title` | `TEXT` | Required, minimum 3 characters | — | Short title of the task |
| `description` | `TEXT` | Optional string | `""` | Detailed description of the task |
| `status` | `TEXT` | Enum: `pending`, `in-progress`, `completed` | `pending` | Current workflow status |
| `priority` | `TEXT` | Enum: `low`, `medium`, `high` | `medium` | Task urgency level |
| `created_at` | `DATETIME` | Auto-generated timestamp | `CURRENT_TIMESTAMP` | Creation timestamp (UTC) |
| `updated_at` | `DATETIME` | Updated on `PUT` | `CURRENT_TIMESTAMP` | Last modified timestamp (UTC) |

---

## 2. Endpoints Reference

### 2.1 List All Tasks
- **Method & Path:** `GET /api/tasks`
- **Optional Query Parameters:**
  - `status` (`pending` | `in-progress` | `completed`)
  - `priority` (`low` | `medium` | `high`)
- **Example Request:**
  ```bash
  curl -X GET "http://localhost:3000/api/tasks?status=pending"
  ```
- **Success Response (`200 OK`):**
  ```json
  {
    "success": true,
    "count": 1,
    "data": [
      {
        "id": 1,
        "title": "Develop REST API & Backend",
        "description": "Express + SQLite CRUD API",
        "status": "pending",
        "priority": "high",
        "created_at": "2026-11-24 12:00:00",
        "updated_at": "2026-11-24 12:00:00"
      }
    ]
  }
  ```

---

### 2.2 Get Single Task by ID
- **Method & Path:** `GET /api/tasks/:id`
- **Example Request:**
  ```bash
  curl -X GET "http://localhost:3000/api/tasks/1"
  ```
- **Success Response (`200 OK`):**
  ```json
  {
    "success": true,
    "data": {
      "id": 1,
      "title": "Develop REST API & Backend",
      "description": "Express + SQLite CRUD API",
      "status": "in-progress",
      "priority": "high",
      "created_at": "2026-11-24 12:00:00",
      "updated_at": "2026-11-24 12:00:00"
    }
  }
  ```
- **Error Responses:**
  - `400 Bad Request` — Non-numeric or invalid `:id`
  - `404 Not Found` — Task ID does not exist

---

### 2.3 Create a New Task
- **Method & Path:** `POST /api/tasks`
- **Request Body:**
  ```json
  {
    "title": "Submit Internship Task 3",
    "description": "Push Express REST API and API docs to GitHub",
    "status": "pending",
    "priority": "high"
  }
  ```
- **Example Request:**
  ```bash
  curl -X POST "http://localhost:3000/api/tasks" \
    -H "Content-Type: application/json" \
    -d '{"title":"Submit Internship Task 3","priority":"high"}'
  ```
- **Success Response (`201 Created`):**
  ```json
  {
    "success": true,
    "message": "Task created successfully.",
    "data": {
      "id": 3,
      "title": "Submit Internship Task 3",
      "description": "",
      "status": "pending",
      "priority": "high",
      "created_at": "2026-11-24 12:05:00",
      "updated_at": "2026-11-24 12:05:00"
    }
  }
  ```
- **Error Response (`400 Bad Request`):**
  ```json
  {
    "success": false,
    "error": "Validation Failed",
    "details": [
      "Field \"title\" is required and must be at least 3 characters long."
    ]
  }
  ```

---

### 2.4 Update an Existing Task
- **Method & Path:** `PUT /api/tasks/:id`
- **Request Body (partial or full update):**
  ```json
  {
    "status": "completed",
    "priority": "medium"
  }
  ```
- **Example Request:**
  ```bash
  curl -X PUT "http://localhost:3000/api/tasks/1" \
    -H "Content-Type: application/json" \
    -d '{"status":"completed"}'
  ```
- **Success Response (`200 OK`):**
  ```json
  {
    "success": true,
    "message": "Task updated successfully.",
    "data": {
      "id": 1,
      "title": "Develop REST API & Backend",
      "description": "Express + SQLite CRUD API",
      "status": "completed",
      "priority": "high",
      "created_at": "2026-11-24 12:00:00",
      "updated_at": "2026-11-24 12:10:00"
    }
  }
  ```
- **Error Responses:** `400 Bad Request` (validation error), `404 Not Found` (ID missing)

---

### 2.5 Delete a Task
- **Method & Path:** `DELETE /api/tasks/:id`
- **Example Request:**
  ```bash
  curl -X DELETE "http://localhost:3000/api/tasks/1"
  ```
- **Success Response (`200 OK`):**
  ```json
  {
    "success": true,
    "message": "Task with ID 1 deleted successfully.",
    "data": {
      "id": 1,
      "title": "Develop REST API & Backend"
    }
  }
  ```
- **Error Responses:** `400 Bad Request` (invalid ID), `404 Not Found` (ID missing)
