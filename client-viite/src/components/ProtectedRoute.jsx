import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const nav = useNavigate();
  const { currentUser, isLoading, isLoggedIn } = useContext(AuthContext);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isLoggedIn) {
    // return <div>Please log in to view this page</div>;
    nav("/login");
  }

  return children;
};
export default ProtectedRoute;
