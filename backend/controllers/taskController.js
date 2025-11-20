const asyncHandler = require('express-async-handler');
const Task = require('../models/Task');

// @desc    Get user tasks
// @route   GET /api/tasks
const getTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(tasks);
});

// @desc    Create a task
// @route   POST /api/tasks
const createTask = asyncHandler(async (req, res) => {
  if (!req.body.text) {
    res.status(400);
    throw new Error('Please add a text field');
  }

  const task = await Task.create({
    user: req.user._id,
    text: req.body.text,
    urgency: req.body.urgency || 'medium', // Default to medium
    dueDate: req.body.dueDate
  });

  res.status(201).json(task);
});

// @desc    Update task (mark complete or edit text)
// @route   PUT /api/tasks/:id
const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  // Check for user
  if (!req.user) {
    res.status(401);
    throw new Error('User not found');
  }

  // Make sure the logged in user matches the task user
  if (task.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.json(updatedTask);
});

// @desc    Delete task
// @route   DELETE /api/tasks/:id
const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  if (task.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  await task.deleteOne();

  res.json({ id: req.params.id });
});

module.exports = { getTasks, createTask, updateTask, deleteTask };