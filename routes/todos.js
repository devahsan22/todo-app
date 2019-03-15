const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Todo = require('../models/Todo');
const auth = require('../middleware/auth');

const router = express.Router();

// Validation middleware
const validateTodo = [
  body('title')
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'urgent'])
    .withMessage('Priority must be low, medium, high, or urgent'),
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid date'),
  body('category')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Category cannot exceed 50 characters'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('tags.*')
    .optional()
    .isLength({ max: 30 })
    .withMessage('Each tag cannot exceed 30 characters')
];

// @route   GET /api/todos
// @desc    Get all todos for current user
// @access  Private
router.get('/', auth, [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('completed').optional().isBoolean().withMessage('Completed must be a boolean'),
  query('priority').optional().isIn(['low', 'medium', 'high', 'urgent']).withMessage('Invalid priority'),
  query('category').optional().isString().withMessage('Category must be a string'),
  query('search').optional().isString().withMessage('Search must be a string'),
  query('sortBy').optional().isIn(['createdAt', 'updatedAt', 'dueDate', 'priority', 'title']).withMessage('Invalid sort field'),
  query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('Sort order must be asc or desc')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const options = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
      completed: req.query.completed === 'true' ? true : req.query.completed === 'false' ? false : undefined,
      priority: req.query.priority,
      category: req.query.category,
      search: req.query.search,
      sortBy: req.query.sortBy || 'createdAt',
      sortOrder: req.query.sortOrder || 'desc'
    };

    const todos = await Todo.findByUser(req.user.userId, options);

    res.json({
      success: true,
      data: {
        todos,
        pagination: {
          page: options.page,
          limit: options.limit,
          hasMore: todos.length === options.limit
        }
      }
    });

  } catch (error) {
    console.error('Get todos error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/todos
// @desc    Create a new todo
// @access  Private
router.post('/', auth, validateTodo, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const todoData = {
      ...req.body,
      user: req.user.userId
    };

    const todo = new Todo(todoData);
    await todo.save();

    await todo.populate('user', 'username email firstName lastName');

    res.status(201).json({
      success: true,
      message: 'Todo created successfully',
      data: { todo }
    });

  } catch (error) {
    console.error('Create todo error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/todos/:id
// @desc    Get a specific todo
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const todo = await Todo.findOne({
      _id: req.params.id,
      user: req.user.userId
    }).populate('user', 'username email firstName lastName')
      .populate('subtodos', 'title completed');

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    res.json({
      success: true,
      data: { todo }
    });

  } catch (error) {
    console.error('Get todo error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/todos/:id
// @desc    Update a todo
// @access  Private
router.put('/:id', auth, validateTodo, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      req.body,
      { new: true, runValidators: true }
    ).populate('user', 'username email firstName lastName')
     .populate('subtodos', 'title completed');

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    res.json({
      success: true,
      message: 'Todo updated successfully',
      data: { todo }
    });

  } catch (error) {
    console.error('Update todo error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/todos/:id
// @desc    Delete a todo
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId
    });

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    res.json({
      success: true,
      message: 'Todo deleted successfully'
    });

  } catch (error) {
    console.error('Delete todo error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PATCH /api/todos/:id/toggle
// @desc    Toggle todo completion status
// @access  Private
router.patch('/:id/toggle', auth, async (req, res) => {
  try {
    const todo = await Todo.findOne({
      _id: req.params.id,
      user: req.user.userId
    });

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    todo.completed = !todo.completed;
    await todo.save();

    res.json({
      success: true,
      message: `Todo ${todo.completed ? 'completed' : 'uncompleted'}`,
      data: { todo }
    });

  } catch (error) {
    console.error('Toggle todo error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/todos/:id/notes
// @desc    Add a note to a todo
// @access  Private
router.post('/:id/notes', auth, [
  body('content')
    .isLength({ min: 1, max: 500 })
    .withMessage('Note content must be between 1 and 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const todo = await Todo.findOne({
      _id: req.params.id,
      user: req.user.userId
    });

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    await todo.addNote(req.body.content);

    res.json({
      success: true,
      message: 'Note added successfully',
      data: { todo }
    });

  } catch (error) {
    console.error('Add note error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/todos/stats/overview
// @desc    Get todo statistics
// @access  Private
router.get('/stats/overview', auth, async (req, res) => {
  try {
    const stats = await Todo.aggregate([
      { $match: { user: req.user.userId, isArchived: false } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          completed: { $sum: { $cond: ['$completed', 1, 0] } },
          pending: { $sum: { $cond: ['$completed', 0, 1] } },
          overdue: {
            $sum: {
              $cond: [
                { $and: [{ $ne: ['$dueDate', null] }, { $lt: ['$dueDate', new Date()] }, { $eq: ['$completed', false] }] },
                1,
                0
              ]
            }
          }
        }
      }
    ]);

    const priorityStats = await Todo.aggregate([
      { $match: { user: req.user.userId, isArchived: false } },
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ]);

    const categoryStats = await Todo.aggregate([
      { $match: { user: req.user.userId, isArchived: false, category: { $exists: true, $ne: '' } } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    res.json({
      success: true,
      data: {
        overview: stats[0] || { total: 0, completed: 0, pending: 0, overdue: 0 },
        priorities: priorityStats,
        categories: categoryStats
      }
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;