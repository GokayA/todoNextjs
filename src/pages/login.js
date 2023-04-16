import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

const LoginPage = () => {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('/api/login', { email, password });
      localStorage.setItem('token', JSON.stringify(res.data));

      router.push('/todos');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form
      className="flex flex-col gap-5 p-10 text-red-500"
      onSubmit={handleSubmit}
    >
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
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginPage;
