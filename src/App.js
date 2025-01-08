// Firestore ----- fsdc project ----------- Users collection ----------- Todo collection
// password already saved



import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom"; // Removed BrowserRouter import
import "./App.css";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [signupSuccess, setSignupSuccess] = useState(false); // Track signup success

  const navigate = useNavigate(); // useNavigate hook for navigation
  const apiEndpoint = "http://localhost:5000"; // Your backend URL

  // Fetch Todos from the backend
  const fetchTodos = async () => {
    try {
      const response = await fetch(`${apiEndpoint}/ToDo`);
      if (response.ok) {
        const data = await response.json();
        setTodos(data);
      } else {
        const errorData = await response.json();
        console.error("Error fetching todos:", errorData);
      }
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchTodos();
    }
  }, [isAuthenticated]);

  const handleSubmit = async () => {
    if (!title || !description) return;
    const todoData = { title, description };

    if (editingId) {
      const response = await fetch(`${apiEndpoint}/ToDo/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(todoData),
      });
      if (response.ok) {
        setEditingId(null);
        fetchTodos();
      }
    } else {
      const response = await fetch(`${apiEndpoint}/ToDo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(todoData),
      });
      if (response.ok) fetchTodos();
    }
    setTitle("");
    setDescription("");
  };

  const editTodo = (todo) => {
    setTitle(todo.title);
    setDescription(todo.description);
    setEditingId(todo.id);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);  // Reset authentication state
    navigate("/"); // Redirect to login page
  };

  const deleteTodo = async (id) => {
    const response = await fetch(`${apiEndpoint}/ToDo/${id}`, {
      method: "DELETE",
    });
    if (response.ok) fetchTodos();
  };

  const handleSignup = async () => {
    try {
      const response = await fetch(`${apiEndpoint}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setSignupSuccess(true); // Show success message
        setError("");
        setEmail(""); // Clear the email input field
        setPassword(""); // Clear the password input field
      } else {
        const errorData = await response.json();
        setError(errorData.error);
        console.error("Signup failed:", errorData);
      }
    } catch (error) {
      console.error("Error during signup:", error);
      setError("Error during signup.");
    }
  };

  const handleLogin = async () => {
    try {
      const response = await fetch(`${apiEndpoint}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Login successful:", data);
        setIsAuthenticated(true);
        setError("");
        setEmail(""); // Clear the email input field
        setPassword(""); // Clear the password input field
        navigate("/dashboard"); // Navigate to dashboard after login
      } else {
        const errorData = await response.json();
        setError(errorData.error);
        console.error("Login failed:", errorData);
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError("Error during login.");
    }
  };

  return (
    <div className="App">
      <Routes>
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <div>
                <h1 className="center-heading">TODO APP</h1>
                <button className="logout-btn" onClick={handleLogout}>Logout</button>
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
            ) : (
              <div>Please log in to access the dashboard.</div>
            )
          }
        />
        <Route
          path="/"
          element={
            isLogin ? (
              <div>
                <h1>Login</h1>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button onClick={handleLogin}>Login</button>
                {error && <p className="error">{error}</p>}
                <p>
                  Don't have an account?{" "}
                  <button onClick={() => setIsLogin(false)}>Sign Up</button>
                </p>
              </div>
            ) : (
              <div>
                <h1>Sign Up</h1>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button onClick={handleSignup}>Sign Up</button>
                {signupSuccess && <p className="success">Signup successful! You can now log in.</p>}
                {error && <p className="error">{error}</p>}
                <p>
                  Already have an account?{" "}
                  <button onClick={() => setIsLogin(true)}>Login</button>
                </p>
              </div>
            )
          }
        />
      </Routes>
    </div>
  );
};

export default App;
