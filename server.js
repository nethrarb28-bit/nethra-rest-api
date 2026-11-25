const express = require('express');
const cors = require('cors');
const tasksRouter = require('./routes/tasks');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    service: 'Nethra R — Task Management REST API',
    internship: 'YR NOVATECH — Task 3: REST API & Backend Development',
    documentation: '/api-docs',
    endpoints: {
      listTasks: 'GET /api/tasks',
      getTask: 'GET /api/tasks/:id',
      createTask: 'POST /api/tasks',
      updateTask: 'PUT /api/tasks/:id',
      deleteTask: 'DELETE /api/tasks/:id'
    }
  });
});

app.get('/api-docs', (req, res) => {
  res.status(200).json({
    openapi: '3.0.0',
    info: {
      title: 'Task Management REST API',
      version: '1.0.0',
      description: 'RESTful CRUD API with SQLite database, validation middleware, and structured error handling.'
    },
    baseUrl: `http://localhost:${PORT}/api`,
    dataModel: {
      Task: {
        id: 'INTEGER (Primary Key, Auto-Increment)',
        title: 'TEXT (Required, min 3 chars)',
        description: 'TEXT (Optional, default empty string)',
        status: "TEXT (Enum: 'pending' | 'in-progress' | 'completed', default 'pending')",
        priority: "TEXT (Enum: 'low' | 'medium' | 'high', default 'medium')",
        created_at: 'DATETIME (ISO timestamp)',
        updated_at: 'DATETIME (ISO timestamp)'
      }
    },
    endpoints: [
      {
        method: 'GET',
        path: '/api/tasks',
        description: 'Retrieve all tasks (optional query params: ?status=pending&priority=high)',
        responses: { 200: 'JSON array of task objects' }
      },
      {
        method: 'GET',
        path: '/api/tasks/:id',
        description: 'Retrieve a single task by numeric ID',
        responses: { 200: 'Task object', 400: 'Invalid ID', 404: 'Task not found' }
      },
      {
        method: 'POST',
        path: '/api/tasks',
        description: 'Create a new task',
        requestBody: {
          title: 'Complete Backend API (required)',
          description: 'Implement Express routes and SQLite integration',
          status: 'in-progress',
          priority: 'high'
        },
        responses: { 201: 'Created task object', 400: 'Validation error' }
      },
      {
        method: 'PUT',
        path: '/api/tasks/:id',
        description: 'Update an existing task by ID',
        requestBody: {
          status: 'completed',
          priority: 'medium'
        },
        responses: { 200: 'Updated task object', 400: 'Validation error', 404: 'Task not found' }
      },
      {
        method: 'DELETE',
        path: '/api/tasks/:id',
        description: 'Delete a task by ID',
        responses: { 200: 'Deleted confirmation', 400: 'Invalid ID', 404: 'Task not found' }
      }
    ]
  });
});

app.use('/api/tasks', tasksRouter);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route Not Found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      error: 'Invalid JSON Payload',
      message: 'Please send valid JSON in the request body.'
    });
  }
  console.error('Server Error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: 'An unexpected error occurred on the server.'
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
