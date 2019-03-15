import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Plus, Filter, Search } from 'lucide-react';
import TodoList from './todos/TodoList';
import TodoForm from './todos/TodoForm';
import TodoStats from './todos/TodoStats';

const Dashboard = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filters, setFilters] = useState({
    completed: '',
    priority: '',
    category: '',
    search: ''
  });
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    overdue: 0
  });

  useEffect(() => {
    fetchTodos();
    fetchStats();
  }, [filters]);

  const fetchTodos = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.completed !== '') params.append('completed', filters.completed);
      if (filters.priority) params.append('priority', filters.priority);
      if (filters.category) params.append('category', filters.category);
      if (filters.search) params.append('search', filters.search);

      const response = await axios.get(`/api/todos?${params}`);
      setTodos(response.data.data.todos);
    } catch (error) {
      toast.error('Failed to fetch todos');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/todos/stats/overview');
      setStats(response.data.data.overview);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const addTodo = async (todoData) => {
    try {
      const response = await axios.post('/api/todos', todoData);
      setTodos([response.data.data.todo, ...todos]);
      setShowForm(false);
      fetchStats();
      toast.success('Todo created successfully!');
    } catch (error) {
      toast.error('Failed to create todo');
    }
  };

  const updateTodo = async (id, updates) => {
    try {
      const response = await axios.put(`/api/todos/${id}`, updates);
      setTodos(todos.map(todo => 
        todo._id === id ? response.data.data.todo : todo
      ));
      fetchStats();
      toast.success('Todo updated successfully!');
    } catch (error) {
      toast.error('Failed to update todo');
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`/api/todos/${id}`);
      setTodos(todos.filter(todo => todo._id !== id));
      fetchStats();
      toast.success('Todo deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete todo');
    }
  };

  const toggleTodo = async (id) => {
    try {
      const response = await axios.patch(`/api/todos/${id}/toggle`);
      setTodos(todos.map(todo => 
        todo._id === id ? response.data.data.todo : todo
      ));
      fetchStats();
    } catch (error) {
      toast.error('Failed to toggle todo');
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Todos</h1>
        <p className="text-gray-600">Manage your tasks and stay organized</p>
      </div>

      <TodoStats stats={stats} />

      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search todos..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full"
              />
            </div>

            <div className="flex gap-2">
              <select
                value={filters.completed}
                onChange={(e) => handleFilterChange('completed', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">All</option>
                <option value="false">Pending</option>
                <option value="true">Completed</option>
              </select>

              <select
                value={filters.priority}
                onChange={(e) => handleFilterChange('priority', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Todo
          </button>
        </div>

        <TodoList
          todos={todos}
          onUpdate={updateTodo}
          onDelete={deleteTodo}
          onToggle={toggleTodo}
        />
      </div>

      {showForm && (
        <TodoForm
          onSubmit={addTodo}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default Dashboard; 