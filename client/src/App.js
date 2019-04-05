import React from 'react';
import TodoList from './components/TodoList';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Todo App</h1>
        <p>Manage your tasks efficiently</p>
      </header>
      <main>
        <TodoList />
      </main>
    </div>
  );
}

export default App; 