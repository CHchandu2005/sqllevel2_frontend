import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Function to verify the token and set user
  const verifyToken = async () => {
    const token = localStorage.getItem("usertoken");

    if (token) {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/verify`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setUser(data.user);
          localStorage.setItem("user", JSON.stringify(data.user)); // Persist user data
        } else {
          logout();
        }
      } catch (error) {
        console.error("Token verification failed:", error);
        logout();
      }
    }
  };

  // Logout function to clear local storage and reset user state
  const logout = () => {
    localStorage.removeItem("usertoken");
    localStorage.removeItem("user");
    localStorage.removeItem("quizTimeLeft")
    setUser(null);
    navigate("/"); // Redirect to login
  };

  useEffect(() => {
    verifyToken();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, verifyToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
