const express = require('express');
const Todo = require('../models/Todo');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all todos for user
router.get('/', auth, async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user.userId }).sort({ createdAt: -1 });
    res.json(todos);
  } catch (error) {
    console.error('Get todos error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new todo
router.post('/', auth, async (req, res) => {
  try {
    const { title, description } = req.body;
    
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const todo = new Todo({
      title,
      description,
      user: req.user.userId
    });

    await todo.save();
    res.status(201).json(todo);
  } catch (error) {
    console.error('Create todo error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update todo
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, description, completed } = req.body;
    
    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      { title, description, completed },
      { new: true }
    );

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    res.json(todo);
  } catch (error) {
    console.error('Update todo error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete todo
router.delete('/:id', auth, async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({ 
      _id: req.params.id, 
      user: req.user.userId 
    });

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    res.json({ message: 'Todo deleted' });
  } catch (error) {
    console.error('Delete todo error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 