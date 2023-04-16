import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const PrivateRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    setIsAuthenticated(true);
  }, []);

  return isAuthenticated ? children : null;
};

export default PrivateRoute;
