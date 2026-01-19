import { createContext } from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const nav = useNavigate();
  //function to authenticate user with token
  async function authenticateUser() {
    const tokenInStorage = localStorage.getItem("authToken");
    if (!tokenInStorage) {
      setCurrentUser(null);
      setIsLoading(false);
      setIsLoggedIn(false);
      nav("/");
      return;
    }
    try {
      const { data } = await axios.get("http://localhost:5005/auth/verify", {
        headers: {
          authorization: `Bearer ${tokenInStorage}`,
        },
      });

      console.log(data);
      setCurrentUser(data.currentLoggedInUser);
      setIsLoggedIn(true);
    } catch (error) {
      console.log(error);
      setCurrentUser(null);
      setIsLoggedIn(false);
      nav("/");
    } finally {
      setIsLoading(false);
    }
  }

  const handleLogOut = () => {
    localStorage.removeItem("authToken");
    setCurrentUser(null);
    setIsLoggedIn(false);
    nav("/login");
  };

  useEffect(() => {
    authenticateUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isLoading,
        isLoggedIn,
        authenticateUser,
        handleLogOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
