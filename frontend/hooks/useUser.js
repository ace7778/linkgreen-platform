import { useState, useEffect } from 'react';
import axios from 'axios';

const useUser = (role, token) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/${role}/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || '無法取得使用者資料');
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchUserData();
  }, [role, token]);

  return { userData, loading, error };
};

export default useUser; 