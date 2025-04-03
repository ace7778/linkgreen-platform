import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

const useAuth = (role) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem(`${role}_token`);
    if (token) {
      const decoded = jwtDecode(token);
      if (decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem(`${role}_token`);
        navigate(`/${role}/login`);
      } else {
        setUser(decoded);
      }
    } else {
      navigate(`/${role}/login`);
    }
  }, [navigate, role]);

  return user;
};

export default useAuth; 