import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token && localStorage) {
      router.push('/todos');
    }
  }

  const handleLogin = () => {
    router.push('/login');
  };
  const handleRegister = () => {
    router.push('/register');
  };
  return (
    <div>
      <div className="flex flex-col gap-5 justify-center items-center">
        <h1>Welcome to ToDo App</h1>
        <p> Register or Login </p>
      </div>
      <div className="flex justify-center flex-row gap-5">
        <button onClick={handleRegister}>Register</button>
        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
}
