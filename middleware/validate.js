const ALLOWED_STATUSES = ['pending', 'in-progress', 'completed'];
const ALLOWED_PRIORITIES = ['low', 'medium', 'high'];

function validateTaskCreate(req, res, next) {
  const { title, description, status, priority } = req.body;
  const errors = [];

  if (!title || typeof title !== 'string' || title.trim().length < 3) {
    errors.push('Field "title" is required and must be at least 3 characters long.');
  }

  if (description !== undefined && typeof description !== 'string') {
    errors.push('Field "description" must be a string.');
  }

  if (status !== undefined && !ALLOWED_STATUSES.includes(status)) {
    errors.push(`Field "status" must be one of: ${ALLOWED_STATUSES.join(', ')}.`);
  }

  if (priority !== undefined && !ALLOWED_PRIORITIES.includes(priority)) {
    errors.push(`Field "priority" must be one of: ${ALLOWED_PRIORITIES.join(', ')}.`);
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Validation Failed',
      details: errors
    });
  }

  req.body.title = title.trim();
  if (description !== undefined) req.body.description = description.trim();
  next();
}

function validateTaskUpdate(req, res, next) {
  const { title, description, status, priority } = req.body;
  const errors = [];

  if (
    title === undefined &&
    description === undefined &&
    status === undefined &&
    priority === undefined
  ) {
    return res.status(400).json({
      success: false,
      error: 'Validation Failed',
      details: ['Provide at least one field to update (title, description, status, or priority).']
    });
  }

  if (title !== undefined && (typeof title !== 'string' || title.trim().length < 3)) {
    errors.push('Field "title" must be at least 3 characters long.');
  }

  if (description !== undefined && typeof description !== 'string') {
    errors.push('Field "description" must be a string.');
  }

  if (status !== undefined && !ALLOWED_STATUSES.includes(status)) {
    errors.push(`Field "status" must be one of: ${ALLOWED_STATUSES.join(', ')}.`);
  }

  if (priority !== undefined && !ALLOWED_PRIORITIES.includes(priority)) {
    errors.push(`Field "priority" must be one of: ${ALLOWED_PRIORITIES.join(', ')}.`);
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Validation Failed',
      details: errors
    });
  }

  if (title !== undefined) req.body.title = title.trim();
  if (description !== undefined) req.body.description = description.trim();
  next();
}

function validateIdParam(req, res, next) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      success: false,
      error: 'Invalid ID Parameter',
      details: ['Task ID must be a positive integer.']
    });
  }
  req.taskId = id;
  next();
}

module.exports = {
  validateTaskCreate,
  validateTaskUpdate,
  validateIdParam
};
