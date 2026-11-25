const express = require('express');
const router = express.Router();
const db = require('../db/database');
const {
  validateTaskCreate,
  validateTaskUpdate,
  validateIdParam
} = require('../middleware/validate');

// GET /api/tasks - Retrieve all tasks (supports optional ?status= and ?priority= filters)
router.get('/', (req, res, next) => {
  const { status, priority } = req.query;
  let query = 'SELECT * FROM tasks';
  const params = [];
  const conditions = [];

  if (status) {
    conditions.push('status = ?');
    params.push(status);
  }
  if (priority) {
    conditions.push('priority = ?');
    params.push(priority);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }
  query += ' ORDER BY id DESC';

  db.all(query, params, (err, rows) => {
    if (err) return next(err);
    res.status(200).json({
      success: true,
      count: rows.length,
      data: rows
    });
  });
});

// GET /api/tasks/:id - Retrieve a single task by ID
router.get('/:id', validateIdParam, (req, res, next) => {
  db.get('SELECT * FROM tasks WHERE id = ?', [req.taskId], (err, row) => {
    if (err) return next(err);
    if (!row) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: `Task with ID ${req.taskId} does not exist.`
      });
    }
    res.status(200).json({
      success: true,
      data: row
    });
  });
});

// POST /api/tasks - Create a new task
router.post('/', validateTaskCreate, (req, res, next) => {
  const {
    title,
    description = '',
    status = 'pending',
    priority = 'medium'
  } = req.body;

  const sql = `
    INSERT INTO tasks (title, description, status, priority)
    VALUES (?, ?, ?, ?)
  `;

  db.run(sql, [title, description, status, priority], function (err) {
    if (err) return next(err);

    db.get('SELECT * FROM tasks WHERE id = ?', [this.lastID], (fetchErr, newTask) => {
      if (fetchErr) return next(fetchErr);
      res.status(201).json({
        success: true,
        message: 'Task created successfully.',
        data: newTask
      });
    });
  });
});

// PUT /api/tasks/:id - Update an existing task
router.put('/:id', validateIdParam, validateTaskUpdate, (req, res, next) => {
  db.get('SELECT * FROM tasks WHERE id = ?', [req.taskId], (findErr, existing) => {
    if (findErr) return next(findErr);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: `Task with ID ${req.taskId} does not exist.`
      });
    }

    const updatedTitle = req.body.title !== undefined ? req.body.title : existing.title;
    const updatedDesc = req.body.description !== undefined ? req.body.description : existing.description;
    const updatedStatus = req.body.status !== undefined ? req.body.status : existing.status;
    const updatedPriority = req.body.priority !== undefined ? req.body.priority : existing.priority;

    const sql = `
      UPDATE tasks
      SET title = ?, description = ?, status = ?, priority = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    db.run(sql, [updatedTitle, updatedDesc, updatedStatus, updatedPriority, req.taskId], (updateErr) => {
      if (updateErr) return next(updateErr);

      db.get('SELECT * FROM tasks WHERE id = ?', [req.taskId], (fetchErr, updatedTask) => {
        if (fetchErr) return next(fetchErr);
        res.status(200).json({
          success: true,
          message: 'Task updated successfully.',
          data: updatedTask
        });
      });
    });
  });
});

// DELETE /api/tasks/:id - Delete a task
router.delete('/:id', validateIdParam, (req, res, next) => {
  db.get('SELECT * FROM tasks WHERE id = ?', [req.taskId], (findErr, existing) => {
    if (findErr) return next(findErr);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: `Task with ID ${req.taskId} does not exist.`
      });
    }

    db.run('DELETE FROM tasks WHERE id = ?', [req.taskId], (delErr) => {
      if (delErr) return next(delErr);
      res.status(200).json({
        success: true,
        message: `Task with ID ${req.taskId} deleted successfully.`,
        data: existing
      });
    });
  });
});

module.exports = router;
