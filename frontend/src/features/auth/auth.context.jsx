import { createContext, useContext, useEffect, useState } from "react";
import { getMeApi } from "../../api/auth.api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadMe = async () => {
    try {
      const { data } = await getMeApi();
      setUser(data);
    } catch {
      setUser(null);
      localStorage.removeItem("accessToken");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("accessToken")) loadMe();
    else setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, loadMe }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
