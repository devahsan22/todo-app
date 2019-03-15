import React, { useState } from 'react';
import { CheckCircle, Circle, Trash2, Edit } from 'lucide-react';

const TodoItem = ({ todo, onUpdate, onDelete, onToggle }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);

  const handleSave = () => {
    onUpdate(todo._id, { title });
    setIsEditing(false);
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-4 shadow-sm ${
      todo.completed ? 'opacity-75' : ''
    }`}>
      <div className="flex items-center gap-3">
        <button onClick={() => onToggle(todo._id)}>
          {todo.completed ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : (
            <Circle className="h-5 w-5 text-gray-400" />
          )}
        </button>
        
        <div className="flex-1">
          {isEditing ? (
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded"
              onBlur={handleSave}
              onKeyPress={(e) => e.key === 'Enter' && handleSave()}
              autoFocus
            />
          ) : (
            <h3 className={`text-lg ${todo.completed ? 'line-through' : ''}`}>
              {todo.title}
            </h3>
          )}
        </div>
        
        <div className="flex gap-2">
          <button onClick={() => setIsEditing(true)}>
            <Edit className="h-4 w-4 text-gray-400" />
          </button>
          <button onClick={() => onDelete(todo._id)}>
            <Trash2 className="h-4 w-4 text-red-400" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodoItem; 