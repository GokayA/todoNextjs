import axios from 'axios';
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';

const PrivateRoute = dynamic(() => import('@/components/PrivateRoute'), {
  ssr: false,
});
const Todos = () => {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const fetchTodos = async () => {
    try {
      const data = JSON.parse(localStorage.getItem('token'));
      if (!data) {
        return;
      }
      const userId = data.userId._id;
      const res = await axios.get(`/api/todos`, {
        headers: {
          userId: userId,
        },
      });
      setTodos(res.data);
    } catch (error) {
      console.error(error);
      setError(error.response.data.message);
    }
  };
  useEffect(() => {
    fetchTodos();
  }, []);

  const handleAddTodo = async (e) => {
    e.preventDefault();
    try {
      const data = JSON.parse(localStorage.getItem('token'));
      const userId = data.userId;
      console.log('1', userId);
      const res = await axios.post('/api/todos', {
        title,
        description,
        userId,
      });
      setTodos([...todos, res.data]);
      setTitle('');
      setDescription('');
      fetchTodos();
    } catch (error) {
      setError(error.response.data.message);
    }
  };
  const handleUpdateTodo = async (id, updates) => {
    try {
      const res = await axios.put(`/api/todos/${id}`, updates);
      const updatedTodos = todos.map((todo) =>
        todo._id === id ? res.data : todo
      );
      setTodos(updatedTodos);
    } catch (err) {
      setError(err.response.data.message);
    }
  };

  const handleDeleteTodo = async (id) => {
    const data = JSON.parse(localStorage.getItem('token'));
    const userId = data.userId._id;
    try {
      await axios.delete(`/api/todos/`, {
        headers: {
          id: id,
          Userid: userId,
        },
      });
      const filteredTodos = todos.filter((todo) => todo._id !== id);
      setTodos(filteredTodos);
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  return (
    <PrivateRoute>
      <div>
        <h1>Todos</h1>
        <form className="text-red-500" onSubmit={handleAddTodo}>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <label>Description:</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {error && <p className="text-red-500"> {error}</p>}
          <button type="submit">Add Todo</button>
        </form>
        <ul>
          {todos !== null &&
            todos.map((todo) => (
              <li key={todo._id}>
                <div>
                  <span>{todo.title}</span>
                  <span>{todo.description}</span>
                  <button
                    onClick={() =>
                      handleUpdateTodo(todo._id, {
                        completed: !todo.completed,
                      })
                    }
                  >
                    {todo.completed ? 'Mark Incomplete' : 'Mark Complete'}
                  </button>
                  <button onClick={() => handleDeleteTodo(todo._id)}>
                    Delete
                  </button>
                </div>
              </li>
            ))}
        </ul>
      </div>
    </PrivateRoute>
  );
};

export default Todos;
