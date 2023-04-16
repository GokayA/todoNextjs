import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/register', {
        username,
        email,
        password,
      });
      localStorage.setItem('token', JSON.stringify(res.data));
      router.push('/todos');
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <form
      className="text-red-500 flex flex-col gap-5 p-10"
      onSubmit={handleSubmit}
    >
      <label>Username</label>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <label>Email</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <label>Password</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Register</button>
    </form>
  );
};

export default RegisterPage;
