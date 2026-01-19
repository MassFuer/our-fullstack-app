import { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const nav = useNavigate();
  const { authenticateUser } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const { data } = await axios.post("http://localhost:5005/auth/login", {
        email,
        password,
      });
      console.log(data);
      // store the auth token in local storage
      localStorage.setItem("authToken", data.token);
      await authenticateUser();
      // redirect to the profile page
      nav("/profile");
    } catch (error) {
      console.error("Error during login:", error);
      setError(
        error.response?.data?.errorMessage || "An error occurred during login",
      );
    }
  };

  return (
    <div>
      <h1>Login Form</h1>
      <form onSubmit={handleLogin}>
        <label htmlFor="email">
          Email:
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label htmlFor="password">
          Password:
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button type="submit">Login</button>
        <p>
          Don't have an account? <Link to="/">Signup</Link>
        </p>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default Login;
