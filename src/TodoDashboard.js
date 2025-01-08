import React from 'react';

const TodoDashboard = ({ todos, setTodos, title, setTitle, description, setDescription, editingId, setEditingId, handleSubmit, deleteTodo, editTodo }) => {
  return (
    <div>
      <h1>TODO APP</h1>
      <div className="form-container">
        <input
          type="text"
          placeholder="Enter Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button onClick={handleSubmit}>
          {editingId ? "Update TODO" : "Add TODO"}
        </button>
      </div>
      <div className="todo-list">
        {todos.map((todo) => (
          <div key={todo.id} className="todo-item">
            <h4>{todo.title}</h4>
            <p>{todo.description}</p>
            <div className="todo-actions">
              <button onClick={() => editTodo(todo)}>Edit</button>
              <button onClick={() => deleteTodo(todo.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodoDashboard;
